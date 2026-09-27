import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recommendationService from '../services/recommendationService';

export const AiRecommendationsWidget = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recommendationService.getRecommendations()
      .then((res) => setRecommendations(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || recommendations.length === 0) return null;

  const getUrgencyBadge = (u) => {
    switch (u) {
      case 'HIGH': return <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>High Priority</span>;
      case 'MEDIUM': return <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>Recommended</span>;
      default: return <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Routine</span>;
    }
  };

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
            🧠 AI Preventive Maintenance Recommendations
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Data-driven proactive actions tailored to your equipment profile to prevent sudden breakdowns.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {recommendations.map((rec) => (
          <div key={rec.id} style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {rec.category}
                </span>
                {getUrgencyBadge(rec.urgency)}
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.25rem 0' }}>
                {rec.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.35rem 0 0.75rem 0' }}>
                {rec.rationale}
              </p>

              {rec.assetName && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                  Target: <strong>{rec.assetName}</strong>
                </span>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                to={rec.actionUrl}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                Take Action &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiRecommendationsWidget;
