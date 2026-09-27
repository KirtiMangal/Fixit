import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import maintenanceService from '../services/maintenanceService';
import { useAuth } from '../context/AuthContext';
import AiRecommendationsWidget from '../components/AiRecommendationsWidget';

export const PersonalMaintenanceDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/dashboard/summary');
      setData(res.data?.data || null);
    } catch (err) {
      setError('Unable to load maintenance dashboard summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboard();
  }, [user]);

  const handleQuickCompleteReminder = async (id) => {
    try {
      await maintenanceService.completeReminder(id);
      setActionMsg('Maintenance task marked completed!');
      fetchDashboard();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (e) {
      alert('Failed to complete reminder');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your personal maintenance dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            🛠 FixIt Maintenance &amp; Equipment Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Welcome back, <strong>{user?.name}</strong>. Track your devices, proactive care schedules, and lifetime savings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/report-problem" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            + Report Problem
          </Link>
          <Link to="/technicians" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Book Technician
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          ✓ {actionMsg}
        </div>
      )}

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
        <Link to="/things" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)', transition: 'transform 0.15s' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>My Things</span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0' }}>{data?.myThingsCount || 0}</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Manage devices &rarr;</span>
          </div>
        </Link>

        <Link to="/problems" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b', transition: 'transform 0.15s' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Open Problems</span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0' }}>{data?.myProblemsCount || 0}</p>
            <span style={{ fontSize: '0.8rem', color: '#b45309' }}>View reports &rarr;</span>
          </div>
        </Link>

        <Link to="/service-requests" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6', transition: 'transform 0.15s' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Dispatches</span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0' }}>{data?.activeServiceRequestsCount || 0}</p>
            <span style={{ fontSize: '0.8rem', color: '#1d4ed8' }}>Track technician &rarr;</span>
          </div>
        </Link>

        <Link to="/maintenance" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', transition: 'transform 0.15s' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Upcoming Care</span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0' }}>{data?.upcomingRemindersCount || 0}</p>
            <span style={{ fontSize: '0.8rem', color: '#047857' }}>Schedule &rarr;</span>
          </div>
        </Link>

        <Link to="/repairs" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6', transition: 'transform 0.15s' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>DIY Savings</span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0', color: '#16a34a' }}>
              ${data?.estimatedSavings?.toFixed(0) || 0}
            </p>
            <span style={{ fontSize: '0.8rem', color: '#6d28d9' }}>Repair history &rarr;</span>
          </div>
        </Link>
      </div>

      {/* AI Recommendations Widget (Module 12) */}
      <AiRecommendationsWidget />

      {/* Two Column Layout: Upcoming Tasks & Active Dispatches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Upcoming Maintenance */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>📅 Next Due Maintenance</h3>
            <Link to="/maintenance" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          {(!data?.upcomingReminders || data.upcomingReminders.length === 0) ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
              No preventive maintenance due. Great job keeping your gear maintained!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.upcomingReminders.map((rem) => (
                <div key={rem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{rem.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Due: {new Date(rem.dueDate).toLocaleDateString()} &bull; {rem.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickCompleteReminder(rem.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#16a34a', borderColor: '#86efac' }}
                  >
                    ✓ Done
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Repairs Timeline */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>📜 Recent Repair Log</h3>
            <Link to="/repairs" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Full History &rarr;
            </Link>
          </div>

          {(!data?.recentRepairs || data.recentRepairs.length === 0) ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
              No past repairs logged. Complete DIY guides or hire a technician to start your timeline.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.recentRepairs.map((rep) => (
                <div key={rep.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{rep.title}</h4>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: rep.cost > 0 ? 'var(--text-primary)' : '#16a34a' }}>
                      {rep.cost > 0 ? `$${rep.cost.toFixed(0)}` : '$0 DIY'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(rep.repairedAt).toLocaleDateString()} &bull; {rep.resolutionType.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalMaintenanceDashboard;
