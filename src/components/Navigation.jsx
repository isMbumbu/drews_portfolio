import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './navigation.css';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'WORKS', path: '/portfolio' },
    { name: 'SERVICES', path: '/services' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="ambuka-nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setIsOpen(false)}>
          AMBUKA<span>.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu d-none d-lg-block">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div layoutId="nav-underline" className="nav-underline" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`nav-toggle d-lg-none ${isOpen ? 'is-active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span className="line"></span>
          <span className="line"></span>
        </button>

        {/* Desktop Status */}
        <div className="nav-status d-none d-lg-flex">
          <span className="status-dot"></span>
          AVAILABLE FOR HIRE
        </div>
      </div>

      {/* Mobile Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mobile-nav-list">
              {navItems.map((item, i) => (
                <motion.li 
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={item.path} 
                    className="mobile-nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;