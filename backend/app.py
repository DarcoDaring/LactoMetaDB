from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re

app = Flask(__name__)
CORS(app)

# =========================
# LOAD EXCEL DATA
# =========================
df = pd.read_excel("data/database_requirements.csv")
df.columns = df.columns.str.strip()

print("EXCEL COLUMNS:", df.columns.tolist())

# Column names (exact from Excel)
MICROBE_COL = "Microbes"
METABOLITE_COL = "Metabolites"
PATHWAY_COL = "Pathways Name"
MAP_COL = "map [KEGG & BioCyC maps-Gastrointestinal tract]"
DOI_COL = "DOI"

# =========================
# HELPERS
# =========================
def normalize(text):
    return re.sub(r"[^a-z0-9 ]", " ", str(text).lower())

def safe_value(value):
    """Return 'Not Available' for empty/NaN values"""
    if pd.isna(value) or str(value).strip() == "":
        return "Not Available"
    return str(value)

# =========================
# DROPDOWN ENDPOINTS
# =========================
@app.route("/api/microbes", methods=["GET"])
def get_microbes():
    microbes = sorted(df[MICROBE_COL].dropna().unique().tolist())
    return jsonify(microbes)


@app.route("/api/metabolites", methods=["GET"])
def get_metabolites():
    metabolites = sorted(df[METABOLITE_COL].dropna().unique().tolist())
    return jsonify(metabolites)


@app.route("/api/metabolites/by-microbe", methods=["GET"])
def get_metabolites_by_microbe():
    microbe = request.args.get("microbe", "").strip().lower()

    if not microbe:
        return jsonify(sorted(df[METABOLITE_COL].dropna().unique().tolist()))

    filtered = df[
        df[MICROBE_COL]
        .astype(str)
        .str.lower()
        .str.contains(microbe, na=False)
    ]

    metabolites = sorted(filtered[METABOLITE_COL].dropna().unique().tolist())
    return jsonify(metabolites)


@app.route("/api/microbes/by-metabolite", methods=["GET"])
def get_microbes_by_metabolite():
    metabolite = request.args.get("metabolite", "").strip().lower()

    if not metabolite:
        return jsonify(sorted(df[MICROBE_COL].dropna().unique().tolist()))

    filtered = df[
        df[METABOLITE_COL]
        .astype(str)
        .str.lower()
        .str.contains(metabolite, na=False)
    ]

    microbes = sorted(filtered[MICROBE_COL].dropna().unique().tolist())
    return jsonify(microbes)

# =========================
# SEARCH ENDPOINT
# =========================
@app.route("/api/search", methods=["POST"])
def search():
    data = request.json or {}

    microbe_input = data.get("microbe", "").strip()
    metabolite_input = data.get("metabolite", "").strip()

    result = df.copy()

    # --- MICROBE KEYWORD MATCH ---
    if microbe_input:
        words = normalize(microbe_input).split()
        for word in words:
            if len(word) > 2:
                result = result[
                    result[MICROBE_COL]
                    .astype(str)
                    .apply(lambda x: word in normalize(x))
                ]

    # --- METABOLITE KEYWORD MATCH ---
    if metabolite_input:
        words = normalize(metabolite_input).split()
        for word in words:
            if len(word) > 2:
                result = result[
                    result[METABOLITE_COL]
                    .astype(str)
                    .apply(lambda x: word in normalize(x))
                ]

    # Keep only required columns
    result = result[
        [MICROBE_COL, METABOLITE_COL, PATHWAY_COL, MAP_COL, DOI_COL]
    ]

    print("SEARCH INPUT:", microbe_input, metabolite_input)
    print("RESULT COUNT:", len(result))

    # --- CLEAN EMPTY VALUES ---
    cleaned_results = []
    for _, row in result.iterrows():
        cleaned_results.append({
            MICROBE_COL: safe_value(row[MICROBE_COL]),
            METABOLITE_COL: safe_value(row[METABOLITE_COL]),
            PATHWAY_COL: safe_value(row[PATHWAY_COL]),
            MAP_COL: safe_value(row[MAP_COL]),
            DOI_COL: safe_value(row[DOI_COL]),
        })

    return jsonify(cleaned_results)

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)