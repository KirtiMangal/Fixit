import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import problemService from '../services/problemService';

export const SimilarProblemsWidget = ({ problemId }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!problemId) return;
    problemService.getSimilarProblems(problemId)
      .then((res) => setSimilar(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading || similar.length === 0) return null;

  return (
    <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        🔍 Similar Reported Problems &amp; Outcomes
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Historical community problems with matching symptoms and how they were resolved.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {similar.map((p) => (
          <div key={p.id} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  #PR-{p.id} &bull; {p.category}
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                  {p.status}
                </span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                {p.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.description}
              </p>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Link to={`/problems/${p.id}`} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                View Resolution &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProblemsWidget;
