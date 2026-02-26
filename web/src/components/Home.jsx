import "./Home.css";
import heroImg from "../assets/images/bgef.png";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">

        <div className="hero-top">

          {/* LEFT TEXT */}
          <div className="hero-text">
            <h1>Introduction</h1>

            <p>
              Breast milk is rich in essential nutrients, bioactive chemicals,
              and a varied microbial population, all of which are important for
              an infant's initial development.
            </p>

            <p>
              It includes a variety of secondary metabolites including short-chain
              fatty acids (SCFAs), organic acids, and bioactive peptides.
            </p>

            <p>
              The interaction of breast milk microbes and their metabolites plays
              a key role in immunological development.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-img">
            <img src={heroImg} alt="Breast milk microbiome" />
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;