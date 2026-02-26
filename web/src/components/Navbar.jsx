import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../assets/LactoMetaDB (1).png";

function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,   // 👈 improved detection
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleClick = (section) => {
    setActiveSection(section);   // 👈 update immediately on click
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LEFT LINKS */}
        <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
          <a href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => handleClick("home")}
          >Home</a>

          <a href="#about"
            className={activeSection === "about" ? "active" : ""}
            onClick={() => handleClick("about")}
          >About</a>

          <a href="#search"
            className={activeSection === "search" ? "active" : ""}
            onClick={() => handleClick("search")}
          >Search</a>

          <a href="#projects"
            className={activeSection === "projects" ? "active" : ""}
            onClick={() => handleClick("projects")}
          >Team</a>

          <a href="#contact"
            className={activeSection === "contact" ? "active" : ""}
            onClick={() => handleClick("contact")}
          >Contact</a>
        </nav>

        {/* CENTER LOGO */}
        <div className="nav-logo">
          <img src={logo} alt="logo" className="nav-logo-img" />
          <span>LactoMetaDB</span>
        </div>

        {/* HAMBURGER */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </header>
  );
}

export default Navbar;