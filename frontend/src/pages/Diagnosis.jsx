import React from 'react';
import Card from '../components/common/Card';
import { DOMAINS } from '../utils/constants';

export const Diagnosis = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Intelligent Problem Diagnosis</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Step 1: Diagnose &bull; Intake problem symptoms, images, and device specifications.
        </p>
      </div>

      <Card title="Module Status: Architecture Placeholder" subtitle="Scheduled for Phase 4 (AI Diagnostic Engine & Intake Flow)">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          This interface will allow users to select an affected item, describe symptoms, upload photos or audio, 
          and receive automated root-cause hypotheses with confidence ratings.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {DOMAINS.map(d => (
            <span key={d.id} className="badge badge-info">{d.name}</span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Diagnosis;
