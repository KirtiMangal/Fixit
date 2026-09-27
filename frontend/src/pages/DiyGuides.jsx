import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import diyGuideService from '../services/diyGuideService';
import assetService from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { PROBLEM_CATEGORIES } from '../utils/constants';

export const DiyGuides = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const initialCat = searchParams.get('category') || '';
  const initialProblemId = searchParams.get('problemId') || '';

  const [guides, setGuides] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [category, setCategory] = useState(initialCat);
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  // Active guide modal
  const [activeGuide, setActiveGuide] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [completing, setCompleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;
      const res = await diyGuideService.getGuides(params);
      setGuides(res.data || []);
    } catch (err) {
      setError('Unable to load DIY repair guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
    if (user) {
      assetService.getMyAssets().then((r) => setMyAssets(r.data || [])).catch(() => {});
    }
  }, [category, difficulty, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGuides();
  };

  const handleOpenGuide = async (g) => {
    try {
      const res = await diyGuideService.getGuideById(g.id);
      setActiveGuide(res.data);
    } catch (e) {
      setActiveGuide(g);
    }
  };

  const handleCompleteGuide = async () => {
    if (!user) {
      alert('Please log in to track completed DIY repairs and save repair history.');
      return;
    }
    setCompleting(true);
    try {
      const res = await diyGuideService.completeGuide(activeGuide.id, selectedAssetId ? Number(selectedAssetId) : null);
      setActiveGuide(res.data);
      setSuccessMsg('🎉 Awesome job! DIY Repair logged to your personal repair history with $0 spent.');
      fetchGuides();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record completion');
    } finally {
      setCompleting(false);
    }
  };

  const getDifficultyBadge = (d) => {
    switch (d) {
      case 'EASY': return <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>Easy</span>;
      case 'MODERATE': return <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>Moderate</span>;
      case 'ADVANCED': return <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>Advanced</span>;
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          🔧 FixIt DIY Repair Guides
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Tackle equipment repairs yourself with step-by-step verified procedures, parts lists, and safety alerts.
        </p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
            >
              <option value="">All Categories</option>
              {PROBLEM_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 160px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
            >
              <option value="">All Levels</option>
              <option value="EASY">Easy</option>
              <option value="MODERATE">Moderate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div style={{ flex: '2 1 250px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Keywords
            </label>
            <input
              type="text"
              placeholder="e.g. fan, lint, compression, drip, fuse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ paddingTop: '1.2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Search Guides
            </button>
          </div>
        </form>
      </div>

      {/* Guide Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading repair guides...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : guides.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No DIY Guides Match Filters</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try clearing filters or searching for common device symptoms.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {guides.map((g) => (
            <div key={g.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
                    {g.category}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {g.completedByCurrentUser && (
                      <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.7rem' }}>
                        ✓ Completed by you
                      </span>
                    )}
                    {getDifficultyBadge(g.difficulty)}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {g.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  {g.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <span>⏱ ~{g.estimatedMinutes} mins</span>
                  <span>👁 {g.viewsCount || 0} views</span>
                  <span>🏆 {g.completionCount || 0} resolved</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleOpenGuide(g)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  View Step-by-Step Guide &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: '12px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setActiveGuide(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              &times;
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-info">{activeGuide.category}</span>
              {getDifficultyBadge(activeGuide.difficulty)}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱ ~{activeGuide.estimatedMinutes} mins</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {activeGuide.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {activeGuide.description}
            </p>

            {/* Safety Alerts */}
            {activeGuide.safetyWarnings?.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ color: '#b91c1c', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  🚨 Critical Safety Precautions
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#991b1b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {activeGuide.safetyWarnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {/* Required Tools */}
            {activeGuide.requiredTools?.length > 0 && (
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>🛠 Required Tools &amp; Materials</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {activeGuide.requiredTools.map((t, i) => (
                    <span key={i} style={{ background: 'white', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Step-by-Step Instructions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeGuide.steps?.map((st, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {st}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Guide & Log Repair Section */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ color: '#15803d', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    Fixed It Yourself?
                  </h4>
                  <p style={{ color: '#166534', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
                    Mark as completed to log this repair to your asset maintenance history with $0 cost!
                  </p>
                </div>

                {myAssets.length > 0 && (
                  <div>
                    <select
                      value={selectedAssetId}
                      onChange={(e) => setSelectedAssetId(e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.8rem', backgroundColor: 'white' }}
                    >
                      <option value="">-- Link to My Thing (Optional) --</option>
                      {myAssets.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleCompleteGuide}
                  disabled={completing || activeGuide.completedByCurrentUser}
                  className="btn btn-primary"
                  style={{ backgroundColor: activeGuide.completedByCurrentUser ? '#86efac' : '#16a34a', borderColor: '#16a34a', fontSize: '0.85rem' }}
                >
                  {activeGuide.completedByCurrentUser ? '✓ Completed' : completing ? 'Saving...' : 'Mark Completed & Save Repair'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiyGuides;
