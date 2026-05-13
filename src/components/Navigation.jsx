import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './navigation.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: 'INDEX', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'WORKS', path: '/portfolio' },
    { name: 'SERVICES', path: '/services' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="ambuka-nav">
      <div className="nav-container">
        {/* Left: The Brand/Logo */}
        <Link to="/" className="nav-brand">
          AMBUKA<span>.</span>
        </Link>

        {/* Center: Links */}
        <div className="nav-menu">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="nav-underline" 
                      className="nav-underline" 
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Availability Indicator */}
        <div className="nav-status d-none d-md-flex">
          <span className="status-dot"></span>
          AVAILABLE FOR HIRE
        </div>
      </div>
    </nav>
  );
}

export default Navigation;