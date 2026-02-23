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
          <p>
            Dr Vidhya Niranjan<br />
            RV College of Engineering<br />
            Banglore-560059
          </p>
        </div>

        <div className="contact-box">
          <div className="icon">📞</div>
          <h4>Phone</h4>
          <p>+91 9945465657</p>
        </div>

        <div className="contact-box">
          <div className="icon">✉️</div>
          <h4>Email</h4>
          <p>vidya.n@rvce.edu.in</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-form-wrapper">
        <h3>Send us a Message</h3>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
