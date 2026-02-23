import "./Home.css";
import introImage from "../assets/images/enhanced_image.png";

function Home() {
  return (
    <>
      {/* ===== INTRODUCTION SECTION ===== */}
      <section className="home-intro" id="home">
        <div className="home-intro-container">
          {/* LEFT IMAGE */}
          <div className="home-intro-image">
            <img
              src={introImage}
              alt="Breast milk microbiome illustration"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="home-intro-content">
            <h2>Introduction</h2>

            {/* PARAGRAPH CONTAINER */}
            <div className="intro-text-box">
              <p>
                Breast milk is rich in essential nutrients, bioactive chemicals,
                and a varied microbial population, all of which are important
                for an infant&apos;s initial development. Breast milk&apos;s
                microbiota contributes to the development of a healthy gut
                microbiome, which is necessary for digestion and immune system
                function.
              </p>

              <p>
                In addition to bacteria, breast milk includes a variety of
                secondary metabolites such as short-chain fatty acids (SCFAs),
                organic acids, and bioactive peptides. These components play a
                crucial role in infant health and immunological development.
              </p>

              <p>
                This database catalogs microbial species sequenced from breast
                milk, their secondary metabolites, and the biological functions
                of these metabolites, providing a comprehensive resource for
                advancing maternal and infant health research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="home-about">
        <div className="home-about-container">
          <h2>About</h2>

          <p>
            This database is a comprehensive repository of microbes isolated
            from breast milk, their secondary metabolites, and the biological
            functions of these metabolites. It serves as a valuable resource
            for researchers, clinicians, and healthcare professionals
            exploring the role of breast milk microbiota in infant health,
            immune development, gut colonization, and metabolic regulation.
          </p>

          <p>
            By cataloguing microbial species and their functional metabolites,
            this database aims to enhance our understanding of neonatal
            nutrition, disease prevention, and potential therapeutic
            applications.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;