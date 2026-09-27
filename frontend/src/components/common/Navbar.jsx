import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, Activity, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <Wrench className="w-6 h-6 text-blue-600" size={24} color="#2563eb" />
          <span>FixIt</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Overview
            </Link>
          </li>
          <li>
            <Link to="/diagnosis" className={`nav-link ${isActive('/diagnosis') ? 'active' : ''}`}>
              Diagnose
            </Link>
          </li>
          <li>
            <Link to="/resolution" className={`nav-link ${isActive('/resolution') ? 'active' : ''}`}>
              Resolutions
            </Link>
          </li>
          <li>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              My Equipment
            </Link>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={14} /> MVP Phase 1
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
