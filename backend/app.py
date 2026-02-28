from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# =========================
# FILE PATHS (RAILWAY SAFE)
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
EXCEL_FILE = os.path.join(DATA_DIR, "database_requirements.xlsx")

# =========================
# GLOBAL DATAFRAME
# =========================
df = None

def load_excel():
    global df
    df = pd.read_excel(EXCEL_FILE)
    df.columns = df.columns.str.strip()
    print("Excel loaded:", df.columns.tolist())

load_excel()

# =========================
# COLUMN NAMES (UPDATED)
# =========================
MICROBE_COL = "Microbes"
METABOLITE_COL = "Metabolites"
PATHWAY_COL = "Pathways Name"
MAP_COL = "Pathway"                     # ✅ UPDATED
FUNCTION_INFANTS_COL = "Function in Infants"
DOI_COL = "DOI"

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
# DROPDOWNS
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
# SEARCH (UPDATED)
# =========================
@app.route("/api/search", methods=["POST"])
def search():
    data = request.json or {}
    result = df.copy()

    for w in normalize(data.get("microbe", "")).split():
        if len(w) > 2:
            result = result[result[MICROBE_COL].astype(str).apply(lambda x: w in normalize(x))]

    for w in normalize(data.get("metabolite", "")).split():
        if len(w) > 2:
            result = result[result[METABOLITE_COL].astype(str).apply(lambda x: w in normalize(x))]

    result = result[
        [
            MICROBE_COL,
            METABOLITE_COL,
            PATHWAY_COL,
            MAP_COL,
            FUNCTION_INFANTS_COL,
            DOI_COL
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
# ADMIN
# =========================
@app.route("/api/admin/current-file")
def current_file():
    return jsonify({"file": os.path.basename(EXCEL_FILE)})

@app.route("/api/admin/upload-excel", methods=["POST"])
def upload_excel():
    if "file" not in request.files:
        return jsonify(error="No file"), 400

    f = request.files["file"]
    if not f.filename.endswith(".xlsx"):
        return jsonify(error="Invalid file type"), 400

    f.save(EXCEL_FILE)
    load_excel()
    return jsonify(message="Excel updated successfully")

# =========================
# RUN (RAILWAY)
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))