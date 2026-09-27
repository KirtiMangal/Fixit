import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import technicianService from '../../services/technicianService';
import serviceRequestService from '../../services/serviceRequestService';
import { PROBLEM_CATEGORIES } from '../../utils/constants';

export const TechnicianDashboard = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    hourlyRate: 50,
    serviceArea: '',
    experienceYears: 1,
    isAvailable: true,
    specialties: [],
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // RBAC test state
  const [testResult, setTestResult] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        technicianService.getMyProfile().catch(() => ({ data: null })),
        serviceRequestService.getMyTechnicianRequests().catch(() => ({ data: [] })),
      ]);

      if (pRes.data) {
        setProfile(pRes.data);
        setProfileForm({
          bio: pRes.data.bio || '',
          hourlyRate: pRes.data.hourlyRate || 50,
          serviceArea: pRes.data.serviceArea || '',
          experienceYears: pRes.data.experienceYears || 1,
          isAvailable: pRes.data.isAvailable ?? true,
          specialties: pRes.data.specialties || [],
        });
      }
      setRequests(rRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const updated = await technicianService.updateMyProfile(profileForm);
      setProfile(updated.data);
      setIsEditingProfile(false);
      setProfileMsg('Technician profile updated successfully!');
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleSpecialty = (cat) => {
    setProfileForm((prev) => {
      const exists = prev.specialties.includes(cat);
      return {
        ...prev,
        specialties: exists ? prev.specialties.filter((s) => s !== cat) : [...prev.specialties, cat],
      };
    });
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

  const pendingRequests = requests.filter((r) => r.status === 'REQUESTED');
  const activeRequests = requests.filter((r) => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Technician Operations Workspace</h1>
            <span className="badge badge-info">{user?.role}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Welcome, <strong>{user?.name}</strong>. Manage your availability, profile credentials, and dispatch work orders.
          </p>
        </div>

        <Link to="/service-requests" className="btn btn-primary">
          View All Work Orders ({requests.length}) &rarr;
        </Link>
      </div>

      {profileMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          ✓ {profileMsg}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING DISPATCHES</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0' }}>{pendingRequests.length}</p>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Awaiting your acceptance</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE JOBS</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0' }}>{activeRequests.length}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>In progress or scheduled</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RATING &amp; REVIEWS</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0', color: '#d97706' }}>
            ★ {profile?.averageRating ? profile.averageRating.toFixed(1) : '5.0'}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile?.reviewCount || 0} customer reviews</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>HOURLY RATE</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0' }}>${profile?.hourlyRate || 50}/hr</p>
          <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>{profile?.isAvailable ? '● Dispatch Active' : '○ Offline'}</span>
        </div>
      </div>

      {/* Technician Profile & Credentials Editor */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Marketplace Profile &amp; Verification</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Controls how customers find you in the technician marketplace.
            </p>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Professional Bio &amp; Experience Summary
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Certified repair specialist with 6+ years in micro-soldering, appliance servicing..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={profileForm.hourlyRate}
                  onChange={(e) => setProfileForm((p) => ({ ...p, hourlyRate: parseFloat(e.target.value) }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={profileForm.experienceYears}
                  onChange={(e) => setProfileForm((p) => ({ ...p, experienceYears: parseInt(e.target.value) }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Service Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro Area, West Suburbs"
                  value={profileForm.serviceArea}
                  onChange={(e) => setProfileForm((p) => ({ ...p, serviceArea: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  id="availToggle"
                  checked={profileForm.isAvailable}
                  onChange={(e) => setProfileForm((p) => ({ ...p, isAvailable: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="availToggle" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Available for Dispatches
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Specialties &amp; Categories
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PROBLEM_CATEGORIES.map((cat) => {
                  const selected = profileForm.specialties.includes(cat.value);
                  return (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => toggleSpecialty(cat.value)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: selected ? 'var(--primary-light)' : 'white',
                        color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={savingProfile} className="btn btn-primary">
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Verification Status
              </label>
              <p style={{ fontWeight: 700, margin: '0.2rem 0' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: profile?.verificationStatus === 'VERIFIED' ? '#dcfce7' : '#fef3c7',
                    color: profile?.verificationStatus === 'VERIFIED' ? '#15803d' : '#b45309',
                  }}
                >
                  {profile?.verificationStatus || 'PENDING'}
                </span>
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Service Coverage Area
              </label>
              <p style={{ fontWeight: 600, margin: '0.2rem 0' }}>{profile?.serviceArea || 'Not specified'}</p>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Experience
              </label>
              <p style={{ fontWeight: 600, margin: '0.2rem 0' }}>{profile?.experienceYears || 0} years</p>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Specialties
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                {profile?.specialties?.length > 0 ? (
                  profile.specialties.map((s) => (
                    <span key={s} className="badge badge-info">{s}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No specialties selected yet. Click Edit Profile to add.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role-Based Access Control Live Verification */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>RBAC Security Verification</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={() => handleTestRole('technician')} disabled={loadingRole} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Call /api/test/technician (Expected: 200 OK)
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

export default TechnicianDashboard;
