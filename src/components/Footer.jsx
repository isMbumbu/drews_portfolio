import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <footer className="ambuka-footer">
      <div className="footer-container">
        {/* Top Section: Navigation and Socials in one sleek row */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="f-logo">AMBUKA<span>.</span></Link>
            <p className="f-tagline">Architecting Scalable Solutions</p>
          </div>

          <div className="footer-nav-group">
             <span className="f-label">SOCIALS</span>
             <div className="f-links">
               <a href="https://linkedin.com/in/andrew-ambuka-9582152b0/" target="_blank" rel="noopener noreferrer">LN</a>
               <a href="https://github.com/isMbumbu" target="_blank" rel="noopener noreferrer">GH</a>
               <a href="https://wa.me/0785592231" target="_blank" rel="noopener noreferrer">WA</a>
             </div>
          </div>
        </div>

        {/* Bottom Section: Legal and Timestamp */}
        <div className="footer-bottom">
          <p className="f-copyright">
            © {new Date().getFullYear()} — NAIROBI, KENYA
          </p>
          <div className="f-legal">
            <span>DEVELOPED WITH PRECISION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;