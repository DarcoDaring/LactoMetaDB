import { useEffect, useState, useRef } from "react";
import "./Search.css";

/* 🔑 BACKEND BASE URL */
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
  const [hasSearched, setHasSearched] = useState(false);
  const [searched, setSearched] = useState(false);

  const microbeRef = useRef(null);
  const metaboliteRef = useRef(null);

  /* INITIAL LOAD */
  useEffect(() => {
    fetch(`${API_BASE}/api/microbes`).then(r => r.json()).then(setMicrobes);
    fetch(`${API_BASE}/api/metabolites`).then(r => r.json()).then(setMetabolites);
  }, []);

  /* CLOSE DROPDOWNS */
  useEffect(() => {
    const h = e => {
      if (microbeRef.current && !microbeRef.current.contains(e.target)) setShowMicrobeDropdown(false);
      if (metaboliteRef.current && !metaboliteRef.current.contains(e.target)) setShowMetaboliteDropdown(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* SEARCH */
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
    fetch(`${API_BASE}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        microbe: selectedMicrobe,
        metabolite: selectedMetabolite
      })
    })
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setHasSearched(true);
        setSearched(true);
        setLoading(false);
      });
  };

  return (
    <section className="search-page">
      <div className={`search-container ${searched ? "searched" : ""}`}>
        <div className="search-card">
          <h2 className="title">Search Records</h2>

          <div className="inputs">
            <div className="input-group custom-select" ref={microbeRef}>
              <input value={selectedMicrobe} onChange={e => setSelectedMicrobe(e.target.value)} placeholder=" " />
              <label>Select The Microbes</label>
            </div>

            <div className="input-group custom-select" ref={metaboliteRef}>
              <input value={selectedMetabolite} onChange={e => setSelectedMetabolite(e.target.value)} placeholder=" " />
              <label>Select The Metabolites</label>
            </div>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            {loading ? "Searching..." : hasSearched ? "Clear" : "Search"}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="results-container">
          {results.map((row, i) => (
            <div className="result-card" key={i}>
              <h4>{row["Pathways Name"]}</h4>

              <p><strong>Metabolite:</strong> {row.Metabolites}</p>
              <p><strong>Function in Infants:</strong> {row["Function in Infants"]}</p>
              <p><strong>Microbe:</strong> {row.Microbes}</p>

              {row.Pathway !== "Not Available" && (
                <a href={row.Pathway} target="_blank">Pathway Map</a>
              )}

              {row.DOI !== "Not Available" && (
                <a href={`https://doi.org/${row.DOI}`} target="_blank">DOI</a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Search;