import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import problemService from '../services/problemService';
import { PROBLEM_CATEGORIES, PROBLEM_STATUSES, PROBLEM_SEVERITIES } from '../utils/constants';

export const MyProblems = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const isAdmin = user?.role === 'ADMIN';

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = isAdmin
        ? await problemService.getAllProblems()
        : await problemService.getMyProblems();
      setProblems(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [user]);

  const filteredProblems = problems.filter((prob) => {
    if (statusFilter !== 'ALL' && prob.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && prob.category !== categoryFilter) return false;
    return true;
  });

  const getStatusBadge = (statusVal) => {
    const s = PROBLEM_STATUSES.find((item) => item.value === statusVal);
    return (
      <span
        className="badge"
        style={{
          backgroundColor: '#eff6ff',
          color: s ? s.color : '#2563eb',
          border: `1px solid ${s ? s.color : '#2563eb'}`,
        }}
      >
        {s ? s.label : statusVal}
      </span>
    );
  };

  const getSeverityBadge = (sevVal) => {
    const s = PROBLEM_SEVERITIES.find((item) => item.value === sevVal);
    return (
      <span
        className="badge"
        style={{
          backgroundColor: '#fef2f2',
          color: s ? s.color : '#dc2626',
        }}
      >
        {s ? s.label : sevVal}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
            {isAdmin ? 'All Platform Problems (Admin View)' : 'My Reported Problems'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track the status and resolution lifecycle of your reported issues.
          </p>
        </div>
        <Link to="/problems/report" className="btn btn-primary">
          + Report New Problem
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                backgroundColor: 'white',
              }}
            >
              <option value="ALL">All Statuses</option>
              {PROBLEM_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                backgroundColor: 'white',
              }}
            >
              <option value="ALL">All Categories</option>
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {filteredProblems.length} problem{filteredProblems.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading problems...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
          <p>{error}</p>
          <button onClick={fetchProblems} className="btn btn-outline" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No problems found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            {statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'No issues match the selected filter criteria. Try resetting the filters.'
              : "You haven't reported any problems yet. Experience an issue with a laptop, appliance, or vehicle? Let's fix it."}
          </p>
          <Link to="/problems/report" className="btn btn-primary">
            Report a Problem Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredProblems.map((prob) => {
            const cat = PROBLEM_CATEGORIES.find((c) => c.value === prob.category);
            return (
              <Link
                key={prob.id}
                to={`/problems/${prob.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{cat?.icon || '📦'}</span>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {prob.title}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {getSeverityBadge(prob.severity)}
                      {getStatusBadge(prob.status)}
                    </div>
                  </div>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {prob.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.5rem',
                      marginTop: '0.25rem',
                    }}
                  >
                    <div>
                      <span>Category: <strong>{cat?.label || prob.category}</strong></span>
                      {prob.subcategory && (
                        <span> &bull; Component: <strong>{prob.subcategory}</strong></span>
                      )}
                      {isAdmin && prob.createdBy && (
                        <span> &bull; Reported by: <strong>{prob.createdBy.name}</strong> ({prob.createdBy.email})</span>
                      )}
                    </div>
                    <span>{new Date(prob.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProblems;
