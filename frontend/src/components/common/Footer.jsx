import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <strong>FixIt</strong> — Problem-Resolution and Maintenance Platform
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Diagnose &bull; Decide &bull; Resolve &bull; Learn &bull; Remember &bull; Prevent
        </div>
      </div>
    </footer>
  );
};

export default Footer;
