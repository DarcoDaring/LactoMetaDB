from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import os
import tempfile

from supabase import Client, create_client

# =========================
# APP SETUP
# =========================
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# =========================
# SUPABASE CONFIG
# =========================
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "excel-data")
SUPABASE_EXCEL_NAME = os.environ.get(
    "SUPABASE_EXCEL_NAME", "database_requirements.xlsx"
)

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Supabase credentials missing")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================
# COLUMN NAMES (LATEST)
# =========================
MICROBE_COL = "Microbes"
METABOLITE_COL = "Metabolites"
PATHWAY_COL = "Pathways Name"
MAP_COL = "Pathway"
FUNCTION_INFANTS_COL = "Function in Infants"
DOI_COL = "DOI"

REQUIRED_COLUMNS = {
    MICROBE_COL,
    METABOLITE_COL,
    PATHWAY_COL,
    MAP_COL,
    FUNCTION_INFANTS_COL,
    DOI_COL,
}

# =========================
# GLOBAL DATAFRAME
# =========================
df = pd.DataFrame(columns=list(REQUIRED_COLUMNS))

# =========================
# HELPERS
# =========================
def normalize(text):
    return re.sub(r"[^a-z0-9 ]", " ", str(text).lower())

def safe_value(value):
    if pd.isna(value) or str(value).strip() == "":
        return "Not Available"
    return str(value)

# =========================
# LOAD EXCEL FROM SUPABASE
# =========================
def load_excel():
    global df

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
            data = supabase.storage.from_(SUPABASE_BUCKET).download(
                SUPABASE_EXCEL_NAME
            )
            with open(tmp.name, "wb") as f:
                f.write(data)

        df = pd.read_excel(tmp.name)
        df.columns = df.columns.str.strip()

        missing = REQUIRED_COLUMNS - set(df.columns)
        if missing:
            raise ValueError(f"Missing columns: {missing}")

        print("✅ Excel loaded from Supabase:", df.columns.tolist())

    except Exception as e:
        print("❌ Failed to load Excel from Supabase:", e)
        df = pd.DataFrame(columns=list(REQUIRED_COLUMNS))

# Load Excel on startup
load_excel()

# =========================
# DROPDOWN APIs
# =========================
@app.route("/api/microbes")
def microbes():
    return jsonify(sorted(df[MICROBE_COL].dropna().unique().tolist()))

@app.route("/api/metabolites")
def metabolites():
    return jsonify(sorted(df[METABOLITE_COL].dropna().unique().tolist()))

@app.route("/api/metabolites/by-microbe")
def metabolites_by_microbe():
    m = request.args.get("microbe", "").lower()
    if not m:
        return metabolites()
    f = df[df[MICROBE_COL].astype(str).str.lower().str.contains(m, na=False)]
    return jsonify(sorted(f[METABOLITE_COL].dropna().unique().tolist()))

@app.route("/api/microbes/by-metabolite")
def microbes_by_metabolite():
    m = request.args.get("metabolite", "").lower()
    if not m:
        return microbes()
    f = df[df[METABOLITE_COL].astype(str).str.lower().str.contains(m, na=False)]
    return jsonify(sorted(f[MICROBE_COL].dropna().unique().tolist()))

# =========================
# SEARCH API
# =========================
@app.route("/api/search", methods=["POST"])
def search():
    data = request.json or {}
    result = df.copy()

    for w in normalize(data.get("microbe", "")).split():
        if len(w) > 2:
            result = result[
                result[MICROBE_COL].astype(str).apply(lambda x: w in normalize(x))
            ]

    for w in normalize(data.get("metabolite", "")).split():
        if len(w) > 2:
            result = result[
                result[METABOLITE_COL].astype(str).apply(lambda x: w in normalize(x))
            ]

    result = result[
        [
            MICROBE_COL,
            METABOLITE_COL,
            PATHWAY_COL,
            MAP_COL,
            FUNCTION_INFANTS_COL,
            DOI_COL,
        ]
    ]

    return jsonify([
        {
            MICROBE_COL: safe_value(r[MICROBE_COL]),
            METABOLITE_COL: safe_value(r[METABOLITE_COL]),
            PATHWAY_COL: safe_value(r[PATHWAY_COL]),
            MAP_COL: safe_value(r[MAP_COL]),
            FUNCTION_INFANTS_COL: safe_value(r[FUNCTION_INFANTS_COL]),
            DOI_COL: safe_value(r[DOI_COL]),
        }
        for _, r in result.iterrows()
    ])

# =========================
# LOGIN
# =========================
@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify(ok=True), 200

    d = request.json or {}
    if d.get("username") == "admin" and d.get("password") == "admin123":
        return jsonify(success=True)

    return jsonify(success=False), 401

# =========================
# ADMIN APIs
# =========================
@app.route("/api/admin/current-file")
def current_file():
    return jsonify({"file": SUPABASE_EXCEL_NAME})

@app.route("/api/admin/upload-excel", methods=["POST"])
def upload_excel():
    if "file" not in request.files:
        return jsonify(error="No file uploaded"), 400

    file = request.files["file"]

    if not file.filename.endswith(".xlsx"):
        return jsonify(error="Only .xlsx files allowed"), 400

    try:
        supabase.storage.from_(SUPABASE_BUCKET).upload(
            SUPABASE_EXCEL_NAME,
            file.read(),
            {
                "content-type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            upsert=True,  # ✅ REPLACE OLD FILE
        )

        load_excel()
        return jsonify(success=True, message="Excel uploaded and reloaded")

    except Exception as e:
        return jsonify(error=str(e)), 500

# =========================
# RUN (RAILWAY)
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))