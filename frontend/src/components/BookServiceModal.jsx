import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import serviceRequestService from '../services/serviceRequestService';
import problemService from '../services/problemService';
import assetService from '../services/assetService';
import { PROBLEM_CATEGORIES } from '../utils/constants';

export const BookServiceModal = ({ technician, initialProblemId, initialCategory, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: initialCategory || technician?.specialties?.[0] || 'LAPTOP',
    scheduledDate: '',
    problemId: initialProblemId || '',
    assetId: '',
    customerNotes: '',
    estimatedCost: technician?.hourlyRate ? technician.hourlyRate * 2 : 100,
  });

  const [myProblems, setMyProblems] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      // Fetch problems & assets for dropdown linkage
      problemService.getMyProblems().then((res) => {
        setMyProblems(res.data || []);
        if (initialProblemId) {
          const match = (res.data || []).find((p) => p.id === Number(initialProblemId));
          if (match) {
            setFormData((prev) => ({
              ...prev,
              title: `Service for: ${match.title}`,
              description: match.description,
              category: match.category,
              assetId: match.asset?.id || '',
            }));
          }
        }
      }).catch(() => {});

      assetService.getMyAssets().then((res) => {
        setMyAssets(res.data || []);
      }).catch(() => {});
    }
  }, [isOpen, initialProblemId, user]);

  if (!isOpen || !technician) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProblemSelect = (e) => {
    const probId = e.target.value;
    if (!probId) {
      setFormData((prev) => ({ ...prev, problemId: '' }));
      return;
    }
    const match = myProblems.find((p) => p.id === Number(probId));
    if (match) {
      setFormData((prev) => ({
        ...prev,
        problemId: match.id,
        title: `Service for: ${match.title}`,
        description: match.description,
        category: match.category,
        assetId: match.asset?.id || prev.assetId,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        technicianId: technician.user?.id || technician.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        problemId: formData.problemId ? Number(formData.problemId) : null,
        assetId: formData.assetId ? Number(formData.assetId) : null,
        customerNotes: formData.customerNotes,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
      };

      const res = await serviceRequestService.createRequest(payload);
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  // Default date to tomorrow 10:00 AM
  const getMinDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: '12px', padding: '1.75rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          &times;
        </button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Book Service with {technician.user?.name || 'Technician'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Hourly rate: <strong>${technician.hourlyRate || 50}/hr</strong> &bull; Area: <strong>{technician.serviceArea || 'Metro'}</strong>
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myProblems.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Link to Existing Problem Report (Optional)
              </label>
              <select
                value={formData.problemId}
                onChange={handleProblemSelect}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
              >
                <option value="">-- No Problem Linked / Direct Request --</option>
                {myProblems.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Service Title *
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={5}
              maxLength={150}
              placeholder="e.g. Broken laptop hinge repair or diagnosis"
              value={formData.title}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
              >
                {PROBLEM_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Scheduled Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                required
                min={getMinDateTime()}
                value={formData.scheduledDate}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          {myAssets.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Linked Thing / Device (Optional)
              </label>
              <select
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
              >
                <option value="">-- None --</option>
                {myAssets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({[a.brand, a.model].filter(Boolean).join(' ')})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Service Requirements &amp; Symptoms *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              minLength={10}
              placeholder="Describe the issue, symptoms, location access details..."
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Additional Customer Notes (Optional)
            </label>
            <input
              type="text"
              name="customerNotes"
              placeholder="e.g. Ring doorbell twice, dog is in backyard"
              value={formData.customerNotes}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Confirming Booking...' : 'Confirm Service Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookServiceModal;
