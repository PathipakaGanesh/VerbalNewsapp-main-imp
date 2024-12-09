import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HelpModal from './HelpModal';

const Navbar = ({ mode, toggleMode }) => {
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <nav className={`navbar navbar-expand-lg ${mode === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">VerbalNews Hub</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {['home', 'sports', 'business', 'entertainment'].map((category, index) => (
              <li key={index} className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === `/${category}` ? 'active' : ''}`}
                  to={`/${category}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="form-check form-switch ms-auto">
            <input
              className="form-check-input"
              onChange={toggleMode}
              type="checkbox"
              checked={mode === 'dark'}
            />
            <label className={`form-check-label ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>Dark Mode</label>
          </div>
          <button
            className="btn btn-outline-primary ms-3"
            onClick={() => setShowHelp(true)}
          >
            Help
          </button>
        </div>
      </div>
      <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />
    </nav>
  );
};

export default Navbar;
