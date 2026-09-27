import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import problemService from '../services/problemService';
import { PROBLEM_CATEGORIES, PROBLEM_SEVERITIES, PROBLEM_STATUSES } from '../utils/constants';
import SimilarProblemsWidget from '../components/SimilarProblemsWidget';

export const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: 'LAPTOP',
    subcategory: '',
    severity: 'MEDIUM',
    status: 'REPORTED',
  });
  const [updating, setUpdating] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);

  const fetchProblem = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await problemService.getProblemById(id);
      const data = response.data;
      setProblem(data);
      setEditFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory || '',
        severity: data.severity,
        status: data.status,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load problem details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const isOwner = user && problem && problem.createdBy?.email === user.email;
  const isAdmin = user?.role === 'ADMIN';

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    try {
      const response = await problemService.updateProblem(id, editFormData);
      setProblem(response.data);
      setIsEditing(false);
      setSuccessMsg('Problem updated successfully');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this problem report? This action cannot be undone.')) {
      return;
    }
    try {
      await problemService.deleteProblem(id);
      navigate('/problems', { state: { message: 'Problem report deleted' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete problem');
    }
  };

  const handleDiagnose = async () => {
    setDiagnosing(true);
    setError(null);
    try {
      const response = await problemService.diagnoseProblem(id);
      setProblem(response.data);
      setSuccessMsg('AI Diagnosis completed successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete AI diagnosis');
    } finally {
      setDiagnosing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading problem details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Unable to load problem</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/problems" className="btn btn-outline">
          Return to My Problems
        </Link>
      </div>
    );
  }

  const categoryObj = PROBLEM_CATEGORIES.find((c) => c.value === problem.category);
  const statusObj = PROBLEM_STATUSES.find((s) => s.value === problem.status);
  const severityObj = PROBLEM_SEVERITIES.find((s) => s.value === problem.severity);

  // Status Lifecycle Index
  const statusIndex = PROBLEM_STATUSES.findIndex((s) => s.value === problem.status);

  return (
    <div style={{ maxWidth: '900px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/problems" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Problems List
        </Link>

        {(isOwner || isAdmin) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isOwner && (
              <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                {isEditing ? 'Cancel Editing' : 'Edit Problem'}
              </button>
            )}
            <button
              onClick={handleDelete}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', color: 'var(--danger)', borderColor: '#fca5a5' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      {/* Problem Lifecycle Progress Bar */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Problem Lifecycle Tracker
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PROBLEM_STATUSES.length}, 1fr)`, gap: '0.5rem' }}>
          {PROBLEM_STATUSES.map((st, idx) => {
            const isCompleted = idx <= statusIndex;
            const isCurrent = idx === statusIndex;
            return (
              <div key={st.value} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: isCurrent ? 'var(--primary)' : isCompleted ? '#86efac' : 'var(--border-color)',
                    marginBottom: '0.5rem',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'block',
                    lineHeight: 1.2,
                  }}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Problem Details or Edit Form */}
      {isEditing ? (
        <div className="card">
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>Edit Problem Report</h2>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Title</label>
              <input
                type="text"
                name="title"
                required
                minLength={5}
                maxLength={150}
                value={editFormData.title}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                >
                  {PROBLEM_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Subcategory</label>
                <input
                  type="text"
                  name="subcategory"
                  value={editFormData.subcategory}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Severity</label>
                <select
                  name="severity"
                  value={editFormData.severity}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                >
                  {PROBLEM_SEVERITIES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                >
                  {PROBLEM_STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Description</label>
              <textarea
                name="description"
                required
                rows={5}
                minLength={10}
                maxLength={3000}
                value={editFormData.description}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{categoryObj?.icon || '📦'}</span>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{problem.title}</h1>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Reported by <strong>{problem.createdBy?.name}</strong> on {new Date(problem.createdAt).toLocaleString()}
                {problem.updatedAt && problem.updatedAt !== problem.createdAt && (
                  <span> &bull; Updated {new Date(problem.updatedAt).toLocaleString()}</span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ backgroundColor: '#fef2f2', color: severityObj?.color || '#dc2626' }}>
                Severity: {severityObj?.label || problem.severity}
              </span>
              <span className="badge badge-info">
                Status: {statusObj?.label || problem.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Category</span>
              <p style={{ fontWeight: 600 }}>{categoryObj?.label || problem.category}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Subcategory</span>
              <p style={{ fontWeight: 600 }}>{problem.subcategory || 'Not specified'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Report ID</span>
              <p style={{ fontWeight: 600 }}>#PR-{problem.id}</p>
            </div>
          </div>

          {problem.asset && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>
                  🔗 Linked Device / Thing
                </span>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#15803d', margin: '0.1rem 0' }}>
                  {problem.asset.name}
                </p>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {[problem.asset.brand, problem.asset.model].filter(Boolean).join(' - ') || problem.asset.category}
                </span>
              </div>
              <Link to="/things" className="btn btn-outline" style={{ fontSize: '0.8rem', backgroundColor: 'white' }}>
                View in My Things &rarr;
              </Link>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Problem Description</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-primary)', background: '#ffffff', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              {problem.description}
            </div>
          </div>
        </div>
      )}

      {/* AI Diagnostic & Resolution Pathways Section */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)', backgroundColor: problem.diagnosis ? '#ffffff' : 'var(--primary-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🧠 FixIt AI Diagnostic Assessment
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Intelligent diagnostic reasoning, safety triage, and resolution pathways.
            </p>
          </div>

          {(isOwner || isAdmin) && (
            <button
              onClick={handleDiagnose}
              disabled={diagnosing}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              {diagnosing ? 'Analyzing problem...' : problem.diagnosis ? '🔄 Re-Analyze with AI' : '⚡ Analyze Problem with AI'}
            </button>
          )}
        </div>

        {problem.diagnosis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* AI Summary */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
                  Diagnostic Summary
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {problem.diagnosis.diySuitable && (
                    <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                      ✓ DIY Suitable
                    </span>
                  )}
                  {problem.diagnosis.professionalRecommended && (
                    <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                      ⚠ Professional Recommended
                    </span>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                {problem.diagnosis.summary}
              </p>
            </div>

            {/* Safety Warnings Banner if present */}
            {problem.diagnosis.safetyWarnings && problem.diagnosis.safetyWarnings.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '1rem' }}>
                <h4 style={{ color: '#b91c1c', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🚨 Critical Safety Precautions
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#991b1b', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {problem.diagnosis.safetyWarnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Possible Causes vs Confirmed Diagnosis */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>🔍 Possible Causes</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hypotheses</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                  The AI identifies probable hypotheses; these should be physically verified.
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {problem.diagnosis.possibleCauses?.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  🛠 Recommended Actions
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Triage steps to test, isolate, or safely prepare the item:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {problem.diagnosis.recommendedActions?.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Choose How to Resolve It (The Core FixIt Journey) */}
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Choose Your Resolution Path
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Diagnose &rarr; <strong>Decide</strong> &rarr; Resolve &rarr; Learn &rarr; Remember &rarr; Prevent
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {/* 1. DIY */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fafafa' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔧</div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>1. Fix it Myself</h5>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                      Step-by-step DIY guides with parts, tools, and safety checkpoints.
                    </p>
                  </div>
                  <Link
                    to={`/diy-guides?category=${problem.category}&problemId=${problem.id}`}
                    className="btn btn-outline"
                    style={{ textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Browse DIY Guides &rarr;
                  </Link>
                </div>

                {/* 2. Learn with Expert */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fafafa' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎓</div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>2. Learn with an Expert</h5>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                      Book an interactive live consultation or guided mentoring session.
                    </p>
                  </div>
                  <Link
                    to={`/experts?category=${problem.category}&problemId=${problem.id}`}
                    className="btn btn-outline"
                    style={{ textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Find an Expert &rarr;
                  </Link>
                </div>

                {/* 3. Hire Technician */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fafafa' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👨‍🔧</div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>3. Hire a Technician</h5>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                      Schedule an on-site or in-shop repair with a verified technician.
                    </p>
                  </div>
                  <Link
                    to={`/technicians?category=${problem.category}&problemId=${problem.id}`}
                    className="btn btn-primary"
                    style={{ textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Book Technician &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              FixIt's AI diagnostic engine will analyze the symptoms, identify likely hypotheses, evaluate safety risks, and recommend whether DIY, expert guidance, or a certified technician is most suitable.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleDiagnose}
                disabled={diagnosing}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}
              >
                {diagnosing ? 'Running AI Diagnostics...' : '⚡ Run AI Diagnosis Now'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Module 13: Similar Problems & Outcomes */}
      <SimilarProblemsWidget problemId={problem?.id} />
    </div>
  );
};

export default ProblemDetails;
