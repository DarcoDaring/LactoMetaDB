import "./Significance.css";

function Significance() {
  return (
    <section className="significance">
      <div className="significance-wrapper">
        {/* TITLE */}
        <h2 className="significance-title">Significance</h2>

        {/* INTRO */}
        <p className="significance-intro">
          The breastmilk microbiome plays a vital role in early-life development,
          influencing immune maturation, gut colonization, and metabolic
          regulation. Microbial-derived metabolites contribute to several key
          biological functions essential for neonatal health.
        </p>

        {/* FEATURES */}
        <div className="significance-features">
          <div className="feature-card one">
            <span>🛡️</span>
            <h3>Gut Barrier Integrity</h3>
            <p>Strengthens intestinal defense and reduces inflammatory risk.</p>
          </div>

          <div className="feature-card two">
            <span>🧬</span>
            <h3>Immune Modulation</h3>
            <p>Supports balanced immune responses and immune tolerance.</p>
          </div>

          <div className="feature-card three">
            <span>🦠</span>
            <h3>Pathogen Defense</h3>
            <p>Protects against harmful microbes through bioactive compounds.</p>
          </div>

          <div className="feature-card four">
            <span>⚡</span>
            <h3>Metabolic Regulation</h3>
            <p>Enhances nutrient absorption and energy metabolism.</p>
          </div>

          <div className="feature-card five">
            <span>🧠</span>
            <h3>Neurodevelopment</h3>
            <p>Supports brain development via gut–brain axis signaling.</p>
          </div>
        </div>

        {/* FOOTER */}
        <p className="significance-footer">
          This database provides a centralized platform to explore interactions
          between breastmilk microbiota and their metabolic outputs, enabling
          future research, clinical translation, and probiotic or postbiotic
          interventions for neonatal health.
        </p>
      </div>
    </section>
  );
}

export default Significance;