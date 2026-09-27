import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export const ExpertDashboard = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);

  const handleTestRole = async (targetRole) => {
    setLoadingRole(true);
    setTestResult(null);
    try {
      const response = await authService.testRoleAccess(targetRole);
      setTestResult({ success: true, message: response.data || response.message });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Request failed';
      const status = err.response?.status || 500;
      setTestResult({ success: false, status, message: `${status} ${msg}` });
    } finally {
      setLoadingRole(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Expert &amp; Instructor Studio</h1>
          <span className="badge badge-info">{user?.role}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Welcome, Expert <strong>{user?.name}</strong>. Virtual consultation and guide authoring placeholder.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Instructor Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Specialist ID
            </label>
            <p style={{ fontWeight: 600 }}>EXP-{user?.id}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Email
            </label>
            <p style={{ fontWeight: 600 }}>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>RBAC Security Verification</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={() => handleTestRole('expert')} disabled={loadingRole} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Call /api/test/expert (Expected: 200 OK)
          </button>
          <button onClick={() => handleTestRole('admin')} disabled={loadingRole} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Call /api/test/admin (Expected: 403 Forbidden)
          </button>
        </div>

        {testResult && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: testResult.success ? '#dcfce7' : '#fee2e2',
              color: testResult.success ? '#15803d' : '#b91c1c',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {testResult.success ? `Success: ${testResult.message}` : `Access Check: ${testResult.message}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;
