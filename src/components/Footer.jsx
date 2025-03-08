import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <footer className='footer bg-warning text-center'>
      <div className='container'>
        <p className='footer-text'>© {new Date().getFullYear()} Andrew Ambuka. All Rights Reserved.</p>
        
        <div className='footer-links'>
          <span className='divider'>|</span>
          <Link to='/contact' className='footer-link'>Contact Me</Link>
        </div>

        <div className='social-icons'>
          <a href='https://www.linkedin.com/in/andrewambuka' target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-linkedin'></i>
          </a>
          <a href='https://github.com/AndrewAmbuka' target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-github'></i>
          </a>
          <a href='https://wa.me/yourwhatsappnumber' target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-whatsapp'></i>
          </a>
        </div>

        <p className='signature'>Crafted with 🔥 by Andrew Ambuka</p>
      </div>
    </footer>
  );
}

export default Footer;
