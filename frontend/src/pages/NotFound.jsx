import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>
        The requested page does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Overview
      </Link>
    </div>
  );
};

export default NotFound;
