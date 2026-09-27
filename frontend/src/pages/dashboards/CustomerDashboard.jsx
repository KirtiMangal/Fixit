import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export const CustomerDashboard = () => {
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Customer Portal</h1>
          <span className="badge badge-info">{user?.role}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Welcome back, <strong>{user?.name}</strong>. Here is your profile and role access summary.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Profile Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              User ID
            </label>
            <p style={{ fontWeight: 600 }}>#{user?.id}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Email
            </label>
            <p style={{ fontWeight: 600 }}>{user?.email}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Phone
            </label>
            <p style={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Role
            </label>
            <p style={{ fontWeight: 600 }}>{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Problem Reporting Quick Actions */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Experiencing an Issue?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Report a broken device, home appliance, or plumbing issue to start the resolution process.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/things" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
              📦 My Things
            </a>
            <a href="/problems/report" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
              + Report New Problem
            </a>
            <a href="/problems" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
              My Reported Problems
            </a>
          </div>
        </div>
      </div>
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          RBAC Security Verification Tester
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Test Spring Security's <code>@PreAuthorize</code> rules by calling endpoints restricted to different roles:
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button
            onClick={() => handleTestRole('customer')}
            disabled={loadingRole}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            Call /api/test/customer (Expected: 200 OK)
          </button>
          <button
            onClick={() => handleTestRole('technician')}
            disabled={loadingRole}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            Call /api/test/technician (Expected: 403 Forbidden)
          </button>
          <button
            onClick={() => handleTestRole('expert')}
            disabled={loadingRole}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            Call /api/test/expert (Expected: 403 Forbidden)
          </button>
          <button
            onClick={() => handleTestRole('admin')}
            disabled={loadingRole}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
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

export default CustomerDashboard;
