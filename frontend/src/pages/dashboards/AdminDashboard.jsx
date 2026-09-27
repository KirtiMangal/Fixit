import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import technicianService from '../../services/technicianService';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  // RBAC tester state
  const [testResult, setTestResult] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, uRes, tRes, eRes] = await Promise.all([
        adminService.getMetrics().catch(() => ({ data: null })),
        adminService.getAllUsers().catch(() => ({ data: [] })),
        technicianService.getAllProfilesForAdmin().catch(() => ({ data: [] })),
        adminService.getAllExperts().catch(() => ({ data: [] })),
      ]);
      setMetrics(mRes.data || null);
      setUsersList(uRes.data || []);
      setTechnicians(tRes.data || []);
      setExperts(eRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleVerifyTechnician = async (id) => {
    try {
      await technicianService.verifyTechnician(id);
      setActionMsg(`Technician verified successfully!`);
      loadAdminData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (e) {
      alert('Failed to verify technician');
    }
  };

  const handleRejectTechnician = async (id) => {
    try {
      await technicianService.rejectTechnician(id);
      setActionMsg(`Technician profile rejected.`);
      loadAdminData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (e) {
      alert('Failed to reject technician');
    }
  };

  const handleVerifyExpert = async (id) => {
    try {
      await adminService.verifyExpert(id);
      setActionMsg(`Expert instructor verified successfully!`);
      loadAdminData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (e) {
      alert('Failed to verify expert');
    }
  };

  const handleRejectExpert = async (id) => {
    try {
      await adminService.rejectExpert(id);
      setActionMsg(`Expert profile rejected.`);
      loadAdminData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (e) {
      alert('Failed to reject expert');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setActionMsg(`User role updated to ${newRole}`);
      loadAdminData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (e) {
      alert('Failed to update user role');
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Platform Governance Console</h1>
          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            {user?.role}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Welcome, <strong>{user?.name}</strong>. Monitor platform activity, verify service professionals, and govern access control.
        </p>
      </div>

      {actionMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          ✓ {actionMsg}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Users</span>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>{metrics?.totalUsers || 0}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {metrics?.totalCustomers || 0} Customers &bull; {metrics?.totalTechnicians || 0} Techs &bull; {metrics?.totalExperts || 0} Experts
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reported Problems</span>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>{metrics?.totalProblems || 0}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across all 9 categories</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service Bookings</span>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>{metrics?.totalServices || 0}</p>
          <span style={{ fontSize: '0.75rem', color: '#15803d' }}>{metrics?.completedServices || 0} Completed Dispatches</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Gross Repair Volume (GMV)</span>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--primary)' }}>
            ${metrics?.totalGmv?.toFixed(2) || '0.00'}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total billed by providers</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '8px', overflowX: 'auto' }}>
        {[
          { key: 'overview', label: 'Problem Status Breakdown' },
          { key: 'technicians', label: `Technicians (${technicians.length})` },
          { key: 'experts', label: `Experts (${experts.length})` },
          { key: 'users', label: `User Roles (${usersList.length})` },
          { key: 'rbac', label: 'RBAC Security Audit' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === t.key ? 'white' : 'transparent',
              fontWeight: activeTab === t.key ? 700 : 500,
              cursor: 'pointer',
              color: activeTab === t.key ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview Breakdown */}
      {activeTab === 'overview' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Problem Lifecycle Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {metrics?.problemsByStatus && Object.entries(metrics.problemsByStatus).map(([st, cnt]) => (
              <div key={st} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{st}</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>{cnt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Technicians Verification */}
      {activeTab === 'technicians' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Technician Verification &amp; Vetting</h3>
          {technicians.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No registered technicians yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Name</th>
                    <th style={{ padding: '0.5rem' }}>Email</th>
                    <th style={{ padding: '0.5rem' }}>Area</th>
                    <th style={{ padding: '0.5rem' }}>Rate</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{t.user?.name}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>{t.user?.email}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{t.serviceArea || 'Metro'}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>${t.hourlyRate}/hr</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <span className="badge" style={{ backgroundColor: t.verificationStatus === 'VERIFIED' ? '#dcfce7' : '#fef3c7', color: t.verificationStatus === 'VERIFIED' ? '#15803d' : '#b45309' }}>
                          {t.verificationStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                        {t.verificationStatus !== 'VERIFIED' && (
                          <button onClick={() => handleVerifyTechnician(t.id)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', marginRight: '0.35rem' }}>
                            Verify
                          </button>
                        )}
                        {t.verificationStatus !== 'REJECTED' && (
                          <button onClick={() => handleRejectTechnician(t.id)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--danger)', borderColor: '#fca5a5' }}>
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Experts Verification */}
      {activeTab === 'experts' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Expert Instructor Verification</h3>
          {experts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No registered expert instructors yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Name</th>
                    <th style={{ padding: '0.5rem' }}>Email</th>
                    <th style={{ padding: '0.5rem' }}>Rate</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experts.map((exp) => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{exp.user?.name}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>{exp.user?.email}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>${exp.sessionRate} / session</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <span className="badge" style={{ backgroundColor: exp.verificationStatus === 'VERIFIED' ? '#dcfce7' : '#fef3c7', color: exp.verificationStatus === 'VERIFIED' ? '#15803d' : '#b45309' }}>
                          {exp.verificationStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                        {exp.verificationStatus !== 'VERIFIED' && (
                          <button onClick={() => handleVerifyExpert(exp.id)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', marginRight: '0.35rem' }}>
                            Verify
                          </button>
                        )}
                        {exp.verificationStatus !== 'REJECTED' && (
                          <button onClick={() => handleRejectExpert(exp.id)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--danger)', borderColor: '#fca5a5' }}>
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: User Management */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>User Role Governance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>User ID</th>
                  <th style={{ padding: '0.5rem' }}>Name</th>
                  <th style={{ padding: '0.5rem' }}>Email</th>
                  <th style={{ padding: '0.5rem' }}>Current Role</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Reassign Role</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 0.5rem' }}>#{u.id}</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>
                      <span className="badge badge-info">{u.role}</span>
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem', backgroundColor: 'white' }}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="TECHNICIAN">TECHNICIAN</option>
                        <option value="EXPERT">EXPERT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: RBAC Audit */}
      {activeTab === 'rbac' && (
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>RBAC Security Verification</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Simulate role-protected calls against backend Spring Security filters.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button onClick={() => handleTestRole('admin')} disabled={loadingRole} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              Call /api/test/admin (Expected: 200 OK)
            </button>
            <button onClick={() => handleTestRole('technician')} disabled={loadingRole} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              Call /api/test/technician (Expected: 200 OK or 403 depending on role)
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
      )}
    </div>
  );
};

export default AdminDashboard;
