import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './navigation.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    
    // { name: 'Blog', path: '/blog' },
    { name: 'Projects', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className='navbar navbar-expand-lg bg-warning fixed-top justify-content-between px-5'>

      <div className='container-fluid'>
        <h1 className='navbar-brand'>Andrew Ambuka&#39;s</h1>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarTogglerDemo03'
          aria-controls='navbarTogglerDemo03'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div style={{ flex: 6 }}></div> 
        <div className='collapse navbar-collapse justify-content-end ms-5' id='navbarTogglerDemo03'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0 px-5'>
            {navItems.map((item) => (
              <li
                key={item.path}
                className={`nav-item nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Link to={item.path} className='nav-link'>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className='navbar-brand'>
            <p className='signature'>is_mbumbu</p>
      </div>
    </nav>
  );
}

export default Navigation;
