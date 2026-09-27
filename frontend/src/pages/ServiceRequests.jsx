import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import serviceRequestService from '../services/serviceRequestService';
import reviewService from '../services/reviewService';

const LIFECYCLE_STEPS = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

export const ServiceRequests = () => {
  const { user } = useAuth();
  const isTechnician = user?.role === 'TECHNICIAN';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Review modal state for customer
  const [reviewingReq, setReviewingReq] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Completion modal state for technician
  const [completingId, setCompletingId] = useState(null);
  const [completionForm, setCompletionForm] = useState({ finalCost: '', resolutionSummary: '' });
  const [completing, setCompleting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = isTechnician
        ? await serviceRequestService.getMyTechnicianRequests()
        : await serviceRequestService.getMyCustomerRequests();
      setRequests(res.data || []);
    } catch (err) {
      setError('Unable to load service requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAccept = async (id) => {
    try {
      await serviceRequestService.acceptRequest(id);
      setActionSuccess(`Request #${id} accepted!`);
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;
    try {
      await serviceRequestService.rejectRequest(id);
      setActionSuccess(`Request #${id} declined.`);
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleStart = async (id) => {
    try {
      await serviceRequestService.startRequest(id);
      setActionSuccess(`Request #${id} marked as IN PROGRESS.`);
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start service');
    }
  };

  const handleOpenCompleteModal = (req) => {
    setCompletingId(req.id);
    setCompletionForm({
      finalCost: req.estimatedCost || '',
      resolutionSummary: '',
    });
  };

  const handleSubmitComplete = async (e) => {
    e.preventDefault();
    setCompleting(true);
    try {
      await serviceRequestService.completeRequest(completingId, {
        finalCost: parseFloat(completionForm.finalCost),
        resolutionSummary: completionForm.resolutionSummary,
      });
      setCompletingId(null);
      setActionSuccess(`Service #${completingId} completed successfully! Repair record generated.`);
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete service');
    } finally {
      setCompleting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this service request?')) return;
    try {
      await serviceRequestService.cancelRequest(id);
      setActionSuccess(`Request #${id} cancelled.`);
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewService.submitReview({
        serviceRequestId: reviewingReq.id,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewingReq(null);
      setActionSuccess('Thank you! Your verified technician review was published.');
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'REQUESTED': return <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>Requested</span>;
      case 'ACCEPTED': return <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>Accepted</span>;
      case 'IN_PROGRESS': return <span className="badge" style={{ backgroundColor: '#fed7aa', color: '#c2410c' }}>In Progress</span>;
      case 'COMPLETED': return <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>Completed</span>;
      case 'CANCELLED': return <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Cancelled</span>;
      case 'REJECTED': return <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>Declined</span>;
      default: return <span className="badge">{st}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {isTechnician ? '📋 Assigned Service Jobs' : '🛠 My Service Requests'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isTechnician
              ? 'Manage incoming dispatch requests, work orders, and job completion.'
              : 'Track professional technician bookings from request to completion.'}
          </p>
        </div>

        {!isTechnician && (
          <Link to="/technicians" className="btn btn-primary">
            + Book a Technician
          </Link>
        )}
      </div>

      {actionSuccess && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          ✓ {actionSuccess}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading service bookings...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Service Requests Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            {isTechnician
              ? 'You have no assigned service bookings right now. Keep your availability active to receive new bookings!'
              : 'You haven’t requested any professional service visits yet.'}
          </p>
          {!isTechnician && (
            <Link to="/technicians" className="btn btn-primary">
              Find a Verified Technician
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => {
            const stepIndex = LIFECYCLE_STEPS.indexOf(req.status);
            const isTerminal = req.status === 'CANCELLED' || req.status === 'REJECTED';

            return (
              <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                        {req.title}
                      </h3>
                      {getStatusBadge(req.status)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Booking #SR-{req.id} &bull; Scheduled for: <strong>{new Date(req.scheduledDate).toLocaleString()}</strong>
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      {isTechnician ? `Customer: ${req.customer?.name}` : `Technician: ${req.technician?.name}`}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {req.finalCost != null ? `$${req.finalCost}` : req.estimatedCost ? `~$${req.estimatedCost}` : 'Hourly'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar (if not cancelled/rejected) */}
                {!isTerminal && (
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      {LIFECYCLE_STEPS.map((step, idx) => {
                        const done = idx <= stepIndex;
                        const current = idx === stepIndex;
                        return (
                          <div key={step} style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                height: '5px',
                                borderRadius: '2px',
                                backgroundColor: current ? 'var(--primary)' : done ? '#86efac' : '#e2e8f0',
                                marginBottom: '0.35rem',
                              }}
                            />
                            <span style={{ fontSize: '0.65rem', fontWeight: current ? 700 : 500, color: current ? 'var(--primary)' : done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                              {step.replace('_', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Details */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  {req.description}
                </p>

                {/* Linked Problem & Asset Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem' }}>
                  {req.problemId && (
                    <Link to={`/problems/${req.problemId}`} style={{ color: 'var(--primary)', textDecoration: 'none', background: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                      🔗 Linked Problem #{req.problemId} &rarr;
                    </Link>
                  )}
                  {req.asset && (
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                      📱 {req.asset.name} ({[req.asset.brand, req.asset.model].filter(Boolean).join(' ')})
                    </span>
                  )}
                  {req.customerNotes && (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Note: "{req.customerNotes}"
                    </span>
                  )}
                </div>

                {/* Resolution Summary if completed */}
                {req.status === 'COMPLETED' && req.resolutionSummary && (
                  <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#15803d' }}>Technician Resolution Report:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#166534' }}>{req.resolutionSummary}</p>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  {/* Technician Controls */}
                  {isTechnician && req.status === 'REQUESTED' && (
                    <>
                      <button onClick={() => handleReject(req.id)} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: '#fca5a5', fontSize: '0.8rem' }}>
                        Decline
                      </button>
                      <button onClick={() => handleAccept(req.id)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                        Accept Booking
                      </button>
                    </>
                  )}

                  {isTechnician && req.status === 'ACCEPTED' && (
                    <button onClick={() => handleStart(req.id)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                      Start Service Job
                    </button>
                  )}

                  {isTechnician && req.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleOpenCompleteModal(req)} className="btn btn-primary" style={{ fontSize: '0.8rem', backgroundColor: '#16a34a', borderColor: '#16a34a' }}>
                      ✓ Complete Service Job
                    </button>
                  )}

                  {/* Customer Controls */}
                  {!isTechnician && (req.status === 'REQUESTED' || req.status === 'ACCEPTED') && (
                    <button onClick={() => handleCancel(req.id)} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: '#fca5a5', fontSize: '0.8rem' }}>
                      Cancel Request
                    </button>
                  )}

                  {!isTechnician && req.status === 'COMPLETED' && (
                    <button
                      onClick={() => { setReviewingReq(req); setReviewForm({ rating: 5, comment: '' }); }}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', color: '#d97706', borderColor: '#fde68a' }}
                    >
                      ★ Rate &amp; Review Technician
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete Job Modal for Technician */}
      {completingId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Complete Service Job #{completingId}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Finalize the billing amount and log what repair actions were taken. This automatically logs a repair record and updates the linked problem.
            </p>

            <form onSubmit={handleSubmitComplete} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Final Billed Cost ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={completionForm.finalCost}
                  onChange={(e) => setCompletionForm((p) => ({ ...p, finalCost: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Resolution Summary &amp; Parts Replaced *
                </label>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  placeholder="e.g. Replaced swollen battery cell with OEM unit. Tested thermal profiles, cleared exhaust vents..."
                  value={completionForm.resolutionSummary}
                  onChange={(e) => setCompletionForm((p) => ({ ...p, resolutionSummary: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setCompletingId(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={completing} className="btn btn-primary" style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}>
                  {completing ? 'Completing...' : 'Finalize & Close Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Rating Modal for Customer */}
      {reviewingReq && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Rate Technician: {reviewingReq.technician?.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              For service job #{reviewingReq.id}: "{reviewingReq.title}". Your verified review helps the community.
            </p>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Overall Rating (1 - 5 Stars) *
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.75rem',
                        cursor: 'pointer',
                        color: star <= reviewForm.rating ? '#f59e0b' : '#cbd5e1',
                        padding: 0,
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#b45309', marginLeft: '0.5rem' }}>
                    {reviewForm.rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Written Feedback &amp; Quality of Repair *
                </label>
                <textarea
                  required
                  rows={4}
                  minLength={5}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                  placeholder="Share details on promptness, cleanliness, technical knowledge, and whether the issue was resolved properly..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setReviewingReq(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={submittingReview} className="btn btn-primary">
                  {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
