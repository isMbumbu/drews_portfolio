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
    { name: 'Projects', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className='navbar navbar-expand-lg bg-secondary fixed-top px-4'>
  <div className='container-fluid d-flex justify-content-between align-items-center'>

    {/* Left: Brand */}
    <h1 className='navbar-brand m-0'>IsMbumbu&#39;s</h1>

    {/* Right: Toggler + Signature */}
    <div className='d-flex align-items-center gap-3'>
      <p className='signature mb-0 d-none d-lg-block'>is_mbumbu</p>

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
    </div>

    {/* Collapsible menu */}
    <div className='collapse navbar-collapse justify-content-center' id='navbarTogglerDemo03'>
      <ul className='navbar-nav mb-2 mb-lg-0 d-flex flex-row gap-3'>
        {navItems.map((item) => (
          <li key={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
            <Link to={item.path} className='nav-link'>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
</nav>

  );
}

export default Navigation;
