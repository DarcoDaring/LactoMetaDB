import { useEffect, useState, useRef } from "react";
import "./Search.css";

/* 🔑 BACKEND BASE URL (Railway in prod, localhost in dev) */
const API_BASE = import.meta.env.VITE_API_URL;

function Search() {
  const [microbes, setMicrobes] = useState([]);
  const [metabolites, setMetabolites] = useState([]);

  const [selectedMicrobe, setSelectedMicrobe] = useState("");
  const [selectedMetabolite, setSelectedMetabolite] = useState("");

  const [showMicrobeDropdown, setShowMicrobeDropdown] = useState(false);
  const [showMetaboliteDropdown, setShowMetaboliteDropdown] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const microbeRef = useRef(null);
  const metaboliteRef = useRef(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [searched, setSearched] = useState(false);

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/microbes`)
      .then(res => res.json())
      .then(setMicrobes);

    fetch(`${API_BASE}/api/metabolites`)
      .then(res => res.json())
      .then(setMetabolites);
  }, []);

  /* =========================
     CLOSE DROPDOWNS
  ========================= */
  useEffect(() => {
    const handler = (e) => {
      if (microbeRef.current && !microbeRef.current.contains(e.target)) {
        setShowMicrobeDropdown(false);
      }
      if (metaboliteRef.current && !metaboliteRef.current.contains(e.target)) {
        setShowMetaboliteDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =========================
     DEPENDENT FETCH: MICROBE → METABOLITES
  ========================= */
  useEffect(() => {
    if (!selectedMicrobe) {
      fetch(`${API_BASE}/api/metabolites`)
        .then(res => res.json())
        .then(setMetabolites);
      return;
    }

    fetch(
      `${API_BASE}/api/metabolites/by-microbe?microbe=${encodeURIComponent(
        selectedMicrobe
      )}`
    )
      .then(res => res.json())
      .then(setMetabolites);
  }, [selectedMicrobe]);

  /* =========================
     DEPENDENT FETCH: METABOLITE → MICROBES
  ========================= */
  useEffect(() => {
    if (!selectedMetabolite) {
      fetch(`${API_BASE}/api/microbes`)
        .then(res => res.json())
        .then(setMicrobes);
      return;
    }

    fetch(
      `${API_BASE}/api/microbes/by-metabolite?metabolite=${encodeURIComponent(
        selectedMetabolite
      )}`
    )
      .then(res => res.json())
      .then(setMicrobes);
  }, [selectedMetabolite]);

  /* =========================
     SEARCH
  ========================= */
  const handleSearch = () => {
    if (hasSearched) {
      setSelectedMicrobe("");
      setSelectedMetabolite("");
      setResults([]);
      setHasSearched(false);
      setSearched(false);
      return;
    }

    setLoading(true);
    setResults([]);

    fetch(`${API_BASE}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        microbe: selectedMicrobe,
        metabolite: selectedMetabolite
      })
    })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setHasSearched(true);
        setSearched(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const filterOptions = (options, value) =>
    options.filter(opt =>
      opt.toLowerCase().includes(value.toLowerCase())
    );

  return (
    <section className="search-page" id="search">
      <div className={`search-container ${searched ? "searched" : ""}`}>
        <div className="search-card">
          <h2 className="title">Search Records</h2>

          <div className="inputs">
            {/* MICROBE */}
            <div className="input-group custom-select" ref={microbeRef}>
              <input
                type="text"
                value={selectedMicrobe}
                onChange={(e) => {
                  setSelectedMicrobe(e.target.value);
                  setSelectedMetabolite("");
                  setHasSearched(false);
                  setSearched(false);
                  setShowMicrobeDropdown(true);
                }}
                onFocus={() => setShowMicrobeDropdown(true)}
                placeholder=" "
              />
              <label>Select The Microbes</label>
              <span className="select-icon">▾</span>

              {showMicrobeDropdown && (
                <div className="dropdown">
                  {filterOptions(microbes, selectedMicrobe).map((m, i) => (
                    <div
                      key={i}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedMicrobe(m);
                        setShowMicrobeDropdown(false);
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* METABOLITE */}
            <div className="input-group custom-select" ref={metaboliteRef}>
              <input
                type="text"
                value={selectedMetabolite}
                onChange={(e) => {
                  setSelectedMetabolite(e.target.value);
                  setSelectedMicrobe("");
                  setHasSearched(false);
                  setSearched(false);
                  setShowMetaboliteDropdown(true);
                }}
                onFocus={() => setShowMetaboliteDropdown(true)}
                placeholder=" "
              />
              <label>Select The Metabolites</label>
              <span className="select-icon">▾</span>

              {showMetaboliteDropdown && (
                <div className="dropdown">
                  {filterOptions(metabolites, selectedMetabolite).map((m, i) => (
                    <div
                      key={i}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedMetabolite(m);
                        setShowMetaboliteDropdown(false);
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            {loading ? "Searching..." : hasSearched ? "Clear" : "Search"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="results-container slide-in">
          <h3 className="results-title">Search Results</h3>

          {results.map((row, i) => (
            <div className="result-card" key={i}>
              

              <div className="result-grid">
                {/* METABOLITE + FUNCTION */}
                <div>
                  <span className="label">Metabolite</span>
                  <p>{row.Metabolites}</p>
                  <div className="result-top">
                <span className="label">Pathway</span>
                <h4 className="primary-text">{row["Pathways Name"]}</h4>
              </div>

                  <div style={{ marginTop: "10px" }}>
                    <span className="label">Function in Infants</span>
                    <p>
                      {row["Function in Infants"] !== "Not Available"
                        ? row["Function in Infants"]
                        : <span className="na-text">Not Available</span>}
                    </p>
                  </div>
                </div>

                {/* MICROBE */}
                <div>
                  <span className="label">Microbe</span>
                  <p>{row.Microbes}</p>
                </div>
              </div>

              <div className="result-links-column">
                {/* PATHWAY MAP */}
                <div className="result-link-block">
                  <span className="label">URL</span><br />
                  {row.Pathway !== "Not Available" ? (
                    <a
                      href={row.Pathway}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.Pathway}
                    </a>
                  ) : (
                    <p className="na-text">Not Available</p>
                  )}
                </div>

                {/* DOI */}
                <div className="result-link-block">
                  <span className="label">DOI</span><br />
                  {row.DOI !== "Not Available" ? (
                    <a
                      href={`https://doi.org/${row.DOI}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.DOI}
                    </a>
                  ) : (
                    <p className="na-text">Not Available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Search;