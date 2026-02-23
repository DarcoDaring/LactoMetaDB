import "./FlowChart.css";

function FlowChart() {
  return (
    <section className="flowchart">
      <h2 className="flowchart-title">Workflow Overview</h2>

      <div className="flowchart-grid">
        {/* Row 1 */}
        <div className="node top">Breast Milk</div>

        {/* Row 2 */}
        <div className="node pink">Metagenomic Analysis</div>
        <div className="node purple">Metabolomic Analysis</div>

        {/* Row 3 */}
        <div className="node yellow">Vaginal Delivery<br />Mother</div>
        <div className="node yellow">C-section Delivery<br />Mother</div>
        <div className="node yellow">GCMS</div>
        <div className="node yellow">Metabolomic Flux</div>

        {/* Row 4 */}
        <div className="node blue">Kraken2 Database</div>
        <div className="node blue">NIST Database</div>
        <div className="node blue">MORFlux-FBA Tool</div>

        {/* SVG ARROWS */}
        <svg className="arrows" viewBox="0 0 1200 700">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Breast Milk */}
          <line x1="600" y1="80" x2="300" y2="170" />
          <line x1="600" y1="80" x2="900" y2="170" />

          {/* Metagenomic */}
          <line x1="300" y1="230" x2="200" y2="330" />
          <line x1="300" y1="230" x2="400" y2="330" />
          <line x1="200" y1="390" x2="300" y2="520" />
          <line x1="400" y1="390" x2="300" y2="520" />

          {/* Metabolomic */}
          <line x1="900" y1="230" x2="800" y2="330" />
          <line x1="900" y1="230" x2="1000" y2="330" />
          <line x1="800" y1="390" x2="800" y2="520" />
          <line x1="1000" y1="390" x2="1000" y2="520" />
        </svg>
      </div>
    </section>
  );
}

export default FlowChart;
