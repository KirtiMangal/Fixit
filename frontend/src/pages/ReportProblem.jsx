import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import problemService from '../services/problemService';
import assetService from '../services/assetService';
import { PROBLEM_CATEGORIES, PROBLEM_SEVERITIES } from '../utils/constants';

export const ReportProblem = () => {
  const [searchParams] = useSearchParams();
  const preSelectedAssetId = searchParams.get('assetId');

  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'LAPTOP',
    subcategory: '',
    severity: 'MEDIUM',
    description: '',
    assetId: preSelectedAssetId ? Number(preSelectedAssetId) : null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load user's registered things
  useEffect(() => {
    const fetchUserAssets = async () => {
      try {
        const response = await assetService.getMyAssets();
        const userAssets = response.data || [];
        setAssets(userAssets);

        // If pre-selected via URL, auto-fill category and subcategory
        if (preSelectedAssetId) {
          const match = userAssets.find((a) => a.id === Number(preSelectedAssetId));
          if (match) {
            setFormData((prev) => ({
              ...prev,
              category: match.category,
              subcategory: [match.brand, match.model].filter(Boolean).join(' '),
            }));
          }
        }
      } catch (err) {
        // Silently continue if assets cannot be loaded
      }
    };

    fetchUserAssets();
  }, [preSelectedAssetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetSelect = (e) => {
    const val = e.target.value;
    if (!val) {
      setFormData((prev) => ({ ...prev, assetId: null }));
      return;
    }

    const selectedId = Number(val);
    const chosen = assets.find((a) => a.id === selectedId);
    if (chosen) {
      setFormData((prev) => ({
        ...prev,
        assetId: selectedId,
        category: chosen.category,
        subcategory: [chosen.brand, chosen.model].filter(Boolean).join(' ') || prev.subcategory,
      }));
    } else {
      setFormData((prev) => ({ ...prev, assetId: selectedId }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await problemService.createProblem(formData);
      const createdProblem = response.data;
      navigate(`/problems/${createdProblem.id}`, {
        state: { message: 'Problem reported successfully!' },
      });
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        const first = Object.values(err.response.data.validationErrors)[0];
        setError(first);
      } else {
        setError(err.response?.data?.message || 'Failed to submit problem report');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/problems" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          &larr; Back to My Problems
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>Report a Problem</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Describe what is wrong. In future phases, our AI will diagnose the root cause and suggest the best fix.
        </p>
      </div>

      <div className="card">
        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Optional Asset Association */}
          {assets.length > 0 && (
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', border: '1px dashed var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                🔗 Associate with a Registered Thing (Optional)
              </label>
              <select
                value={formData.assetId || ''}
                onChange={handleAssetSelect}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="">-- None (Unregistered item or generic issue) --</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.brand || asset.category} {asset.model || ''})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Selecting an asset auto-fills category and links this repair record to the item.
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Problem Title *
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={5}
              maxLength={150}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Dell XPS 15 laptop screen flickers when hinge is moved"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.95rem',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formData.title.length}/150 characters
            </span>
          </div>

          {/* Category & Subcategory Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  backgroundColor: 'white',
                }}
              >
                {PROBLEM_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Subcategory / Component (Optional)
              </label>
              <input
                type="text"
                name="subcategory"
                maxLength={100}
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g. Display Cable, Motherboard, Pipe Valve"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {/* Severity */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Severity Level *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {PROBLEM_SEVERITIES.map((sev) => (
                <label
                  key={sev.value}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: `2px solid ${formData.severity === sev.value ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: formData.severity === sev.value ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <input
                      type="radio"
                      name="severity"
                      value={sev.value}
                      checked={formData.severity === sev.value}
                      onChange={handleChange}
                    />
                    <strong style={{ fontSize: '0.85rem' }}>{sev.label}</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sev.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Detailed Problem Description *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              minLength={10}
              maxLength={3000}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what happened, any unusual noises, smells, error codes, and what you were doing when it broke..."
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Minimum 10 characters</span>
              <span>{formData.description.length}/3000 characters</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Link to="/problems" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportProblem;
