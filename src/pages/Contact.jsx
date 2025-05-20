import React from 'react';
import Navigation from '../components/Navigation';
import '../components/contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <Navigation />
      <div className="contact-me">
        <h2>Let’s Connect!</h2>
        <p>Got a project, an idea, or just want to say hi? Hit me up! 🚀</p>

        <div className="contact-links">
          <a href="https://www.linkedin.com/in/andrew-ambuka-9582152b0/" target="_blank" rel="noopener noreferrer" className="contact-link linkedin">
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <a href="https://github.com/isMbumbu" target="_blank" rel="noopener noreferrer" className="contact-link github">
            <i className="fab fa-github"></i> GitHub
          </a>
          <a href="https://wa.me/0785592231" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
          <a href="mailto:ambukaa93@gmail.com" className="contact-link email">
            <i className="fas fa-envelope"></i> Email Me
          </a>
        </div>

        <p className="tagline">Let’s build something great together! 💡</p>
      </div>
    </div>
  );
}

export default Contact;
