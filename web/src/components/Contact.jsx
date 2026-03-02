import "./Contact.css";

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="contact-heading">Get in Touch</h2>
      <p className="contact-subheading">
        Reach out to us for collaboration, questions, or support
      </p>

      {/* Contact Info */}
      <div className="contact-grid">
        <div className="contact-box">
  <div className="icon">📍</div>
  <h4>Address</h4>

  <a
    href="https://www.google.com/maps?q=RV+College+of+Engineering+Bangalore"
    target="_blank"
    rel="noreferrer"
    className="map-link"
  >
     Vidhya Niranjan<br />
    RV College of Engineering<br />
    Bangalore-560059
  </a>
</div>

        <div className="contact-box">
  <div className="icon">📞</div>
  <h4>Phone</h4>
  <a href="tel:+919945465657" className="contact-link">
    +91 9945465657
  </a>
</div>

<div className="contact-box">
  <div className="icon">✉️</div>
  <h4>Email</h4>
  <a href="mailto:vidya.n@rvce.edu.in" className="contact-link">
    vidya.n@rvce.edu.in
  </a>
</div>
      </div>

      
    </section>
  );
}

export default Contact;
