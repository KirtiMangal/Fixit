import React from 'react';
import Card from '../components/common/Card';
import { RESOLUTION_PATHS } from '../utils/constants';

export const Resolution = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Resolution Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Step 2 &amp; 3: Decide &amp; Resolve &bull; Choose your resolution route.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {Object.values(RESOLUTION_PATHS).map((res) => (
          <Card key={res.id} title={res.title} subtitle={`Path: ${res.id}`}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {res.description}
            </p>
            <span className="badge badge-info">Phase 5 (Resolution Pathways)</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resolution;
