import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'DIY Guides', path: '/diy-guides' },
    { label: 'Technicians', path: '/technicians' },
    { label: 'Experts', path: '/experts' },
    ...(isAuthenticated
      ? [
          { label: 'Things', path: '/things' },
          { label: 'Problems', path: '/problems' },
          { label: 'Dispatches', path: '/service-requests' },
          { label: 'Care Schedule', path: '/maintenance' },
          { label: 'Repairs', path: '/repairs' },
          { label: 'Dashboard', path: '/dashboard' },
        ]
      : []),
  ];

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem' }}>🛠️</span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>FixIt</span>
          </Link>

          <nav>
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} FixIt Platform &mdash; <strong>Diagnose &bull; Decide &bull; Resolve &bull; Learn &bull; Remember &bull; Prevent</strong>
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
