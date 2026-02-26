import { useEffect, useState } from "react";
import "./About.css";
import workflowImg from "../assets/images/workflow.png";
import bg from "../assets/images/bg.png";

function About() {
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="about"
      id="about"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay"></div>

      <div className="about-container">

        {/* MAIN CONTENT */}
        <div className="about-content">

          {/* LEFT TEXT */}
          <div className={`about-box ${show ? "slide-left" : ""}`}>
            <h1>
              A comprehensive resource on <br />
              breast milk microbiota
            </h1>

            <p>
              This database is a comprehensive repository of microbes isolated
              from breast milk, their secondary metabolites, and the biological
              functions of these metabolites.
            </p>

            <button
              className="overview-btn"
              onClick={() => setShowImage(!showImage)}
            >
              View Overview
            </button>
          </div>

          {/* RIGHT IMAGE — INLINE (OLD BEHAVIOR) */}
          <div className={`about-image ${show ? "slide-right" : ""}`}>
            {showImage && (
              <div className="image-box">
                <img
                  src={workflowImg}
                  alt="Workflow"
                  className="workflow"
                />
              </div>
            )}
          </div>

        </div>

        {/* FEATURES */}
        <div className="features">
          <div className="card">
            <h3>Catalog Breast Milk Microbes</h3>
          </div>
          <div className="card">
            <h3>Identify Metabolites’ Functions</h3>
          </div>
          <div className="card">
            <h3>Advance Infant Health Research</h3>
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;