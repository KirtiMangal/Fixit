import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import repairService from '../services/repairService';
import assetService from '../services/assetService';
import { useAuth } from '../context/AuthContext';

export const Repairs = () => {
  const { user } = useAuth();

  const [repairs, setRepairs] = useState([]);
  const [stats, setStats] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, sRes, aRes] = await Promise.all([
        selectedAssetId ? repairService.getAssetRepairs(selectedAssetId) : repairService.getMyRepairs(),
        repairService.getStats(),
        assetService.getMyAssets().catch(() => ({ data: [] })),
      ]);
      setRepairs(rRes.data || []);
      setStats(sRes.data || null);
      setAssets(aRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user, selectedAssetId]);

  const getResolutionBadge = (type) => {
    switch (type) {
      case 'DIY_GUIDE':
        return <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>🔧 DIY Repair</span>;
      case 'EXPERT_SESSION':
        return <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>🎓 Expert Guided</span>;
      case 'TECHNICIAN_SERVICE':
        return <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>👨‍🔧 Professional Service</span>;
      default:
        return <span className="badge">{type}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            📜 Equipment Repair History &amp; Spending
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Permanent lifetime log of repairs across your devices, warranties, and cumulative savings.
          </p>
        </div>

        {assets.length > 0 && (
          <div>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <option value="">All Things &amp; Devices</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Metrics Banner */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total Repairs Completed
            </span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>{stats.totalRepairs}</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Across all registered things</span>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total Repair Spending
            </span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--primary)' }}>
              ${stats.totalSpent?.toFixed(2)}
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Parts, experts &amp; technicians</span>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#15803d' }}>
              Estimated DIY Savings
            </span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0', color: '#16a34a' }}>
              ${stats.estimatedSavings?.toFixed(2)}
            </p>
            <span style={{ fontSize: '0.8rem', color: '#166534' }}>Saved vs commercial service rates</span>
          </div>
        </div>
      )}

      {/* Repairs List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading repair timeline...</p>
        </div>
      ) : repairs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛠</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Repairs Recorded Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            When you complete a DIY Guide, finish an Expert Mentoring session, or have a technician dispatch finalized, the repair will be automatically logged here.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/diy-guides" className="btn btn-outline">Explore DIY Guides</Link>
            <Link to="/technicians" className="btn btn-primary">Find a Technician</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {repairs.map((r) => (
            <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{r.title}</h3>
                    {getResolutionBadge(r.resolutionType)}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Repaired on <strong>{new Date(r.repairedAt).toLocaleDateString()}</strong> &bull; Warranty: {r.warrantyDays || 90} days
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: r.cost > 0 ? 'var(--text-primary)' : '#16a34a' }}>
                    {r.cost > 0 ? `$${r.cost.toFixed(2)}` : '$0 (DIY Free)'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                {r.summary}
              </p>

              {r.assetName && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Associated Device:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    📱 {r.assetName}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Repairs;
