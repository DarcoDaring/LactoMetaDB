from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import os
import tempfile
from io import BytesIO

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

# =========================
# ADMIN CREDENTIALS
# =========================
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials missing")

if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    raise RuntimeError("Admin credentials missing")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================
# COLUMN NAMES
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
# LOAD EXCEL FROM SUPABASE (startup only)
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
        df.dropna(how="all", inplace=True)

        print("✅ Excel loaded from Supabase | Rows:", len(df))

    except Exception as e:
        print("❌ Failed to load Excel:", e)
        df = pd.DataFrame(columns=list(REQUIRED_COLUMNS))

# Load once on startup
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
                result[MICROBE_COL].astype(str)
                .apply(lambda x: w in normalize(x))
            ]

    for w in normalize(data.get("metabolite", "")).split():
        if len(w) > 2:
            result = result[
                result[METABOLITE_COL].astype(str)
                .apply(lambda x: w in normalize(x))
            ]

    result = result[list(REQUIRED_COLUMNS)]

    return jsonify([
        {col: safe_value(row[col]) for col in REQUIRED_COLUMNS}
        for _, row in result.iterrows()
    ])

# =========================
# LOGIN
# =========================
@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify(ok=True), 200

    d = request.json or {}
    if d.get("username") == ADMIN_USERNAME and d.get("password") == ADMIN_PASSWORD:
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
    global df

    if "file" not in request.files:
        return jsonify(error="No file uploaded"), 400

    file = request.files["file"]

    if not file.filename.endswith(".xlsx"):
        return jsonify(error="Only .xlsx files allowed"), 400

    try:
        file_bytes = file.read()

        # Upload to Supabase
        storage = supabase.storage.from_(SUPABASE_BUCKET)
        try:
            storage.remove([SUPABASE_EXCEL_NAME])
        except Exception:
            pass

        storage.upload(
            SUPABASE_EXCEL_NAME,
            file_bytes,
            file_options={
                "content-type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        )

        # 🔥 LOAD DIRECTLY FROM UPLOADED FILE (NO CACHE)
        df = pd.read_excel(BytesIO(file_bytes))
        df.columns = df.columns.str.strip()
        df.dropna(how="all", inplace=True)

        print("✅ Excel loaded from upload | Rows:", len(df))

        return jsonify(success=True, message="Excel uploaded and data refreshed")

    except Exception as e:
        print("❌ Upload failed:", e)
        return jsonify(error=str(e)), 500

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))