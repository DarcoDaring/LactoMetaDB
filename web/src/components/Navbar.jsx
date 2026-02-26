import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/LactoMetaDB (1).png";

function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Track active section (ONLY on home page)
  useEffect(() => {
    if (location.pathname !== "/") return;

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
        threshold: window.innerWidth < 768 ? 0.3 : 0.5,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  // Close menu on scroll (mobile UX)
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  const goHomeAndScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }

    handleClick(sectionId);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* NAV LINKS */}
        <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHomeAndScroll("home");
            }}
          >
            Home
          </a>

          <a
            href="#about"
            className={activeSection === "about" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHomeAndScroll("about");
            }}
          >
            About
          </a>

          <a
            href="#search"
            className={activeSection === "search" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHomeAndScroll("search");
            }}
          >
            Search
          </a>

          <a
            href="#projects"
            className={activeSection === "projects" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHomeAndScroll("projects");
            }}
          >
            Team
          </a>

          <a
            href="#contact"
            className={activeSection === "contact" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHomeAndScroll("contact");
            }}
          >
            Contact
          </a>

          {/* LOGIN */}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            Login
          </a>
        </nav>

        {/* CENTER LOGO */}
        <div
          className="nav-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
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