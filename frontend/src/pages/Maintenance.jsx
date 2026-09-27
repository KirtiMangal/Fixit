import React, { useState, useEffect } from 'react';
import maintenanceService from '../services/maintenanceService';
import assetService from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { PROBLEM_CATEGORIES } from '../utils/constants';

export const Maintenance = () => {
  const { user } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // New Reminder form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    category: 'LAPTOP',
    assetId: '',
    dueDate: '',
    recurrenceDays: '90',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, aRes] = await Promise.all([
        maintenanceService.getMyReminders(),
        assetService.getMyAssets().catch(() => ({ data: [] })),
      ]);
      setReminders(rRes.data || []);
      setAssets(aRes.data || []);
    } catch (e) {
      setError('Unable to load maintenance schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await maintenanceService.createReminder({
        title: newForm.title,
        description: newForm.description,
        category: newForm.category,
        assetId: newForm.assetId ? Number(newForm.assetId) : null,
        dueDate: new Date(newForm.dueDate).toISOString(),
        recurrenceDays: newForm.recurrenceDays ? parseInt(newForm.recurrenceDays) : null,
      });
      setShowAddForm(false);
      setNewForm({ title: '', description: '', category: 'LAPTOP', assetId: '', dueDate: '', recurrenceDays: '90' });
      setSuccessMsg('Maintenance reminder scheduled!');
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await maintenanceService.completeReminder(id);
      setSuccessMsg('Maintenance marked complete! If recurring, next cycle is scheduled.');
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete reminder');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this maintenance reminder?')) return;
    try {
      await maintenanceService.deleteReminder(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete reminder');
    }
  };

  const now = new Date();

  return (
    <div style={{ maxWidth: '1000px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            📅 Preventive Maintenance Schedule
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Stay ahead of equipment breakdowns with automated recurring inspection schedules.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Close Form' : '+ Add Maintenance Task'}
        </button>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          ✓ {successMsg}
        </div>
      )}

      {/* New Reminder Form */}
      {showAddForm && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Schedule Maintenance Task</h3>
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Task Title *</label>
              <input
                type="text"
                required
                value={newForm.title}
                onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Clean AC condenser coils and wash intake filters"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Category *</label>
                <select
                  value={newForm.category}
                  onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                >
                  {PROBLEM_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {assets.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Associated Thing (Optional)</label>
                  <select
                    value={newForm.assetId}
                    onChange={(e) => setNewForm((p) => ({ ...p, assetId: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                  >
                    <option value="">-- None --</option>
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Due Date *</label>
                <input
                  type="date"
                  required
                  value={newForm.dueDate}
                  onChange={(e) => setNewForm((p) => ({ ...p, dueDate: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Recurrence Interval</label>
                <select
                  value={newForm.recurrenceDays}
                  onChange={(e) => setNewForm((p) => ({ ...p, recurrenceDays: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                >
                  <option value="">One-time Only</option>
                  <option value="30">Every Month (30 days)</option>
                  <option value="90">Quarterly (90 days)</option>
                  <option value="180">Semi-annually (6 months)</option>
                  <option value="365">Annually (1 year)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Checklist Details &amp; Notes (Optional)</label>
              <textarea
                rows={2}
                value={newForm.description}
                onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Specific instructions, part numbers, filter sizes..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Scheduling...' : 'Save Maintenance Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading maintenance schedule...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Maintenance Tasks Scheduled</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            Prevent premature equipment wear by setting periodic reminders for filter cleanings, thermal checkups, and safety tests.
          </p>
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            + Schedule First Maintenance Task
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reminders.map((rem) => {
            const dueDate = new Date(rem.dueDate);
            const isOverdue = rem.status === 'PENDING' && dueDate < now;
            const isCompleted = rem.status === 'COMPLETED';

            return (
              <div
                key={rem.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: isOverdue ? '4px solid #ef4444' : isCompleted ? '4px solid #16a34a' : '4px solid var(--primary)',
                  backgroundColor: isCompleted ? '#fafafa' : '#fff',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {rem.title}
                    </h3>
                    {isOverdue && <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Overdue</span>}
                    {isCompleted && <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>Completed</span>}
                    <span className="badge badge-info">{rem.category}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                    {rem.description || 'Routine preventive maintenance task.'}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>📅 Due: <strong>{dueDate.toLocaleDateString()}</strong></span>
                    {rem.recurrenceDays && <span>🔄 Repeats every {rem.recurrenceDays} days</span>}
                    {rem.asset && <span>📱 {rem.asset.name}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isCompleted && (
                    <button
                      onClick={() => handleComplete(rem.id)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                    >
                      ✓ Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', color: 'var(--danger)', borderColor: '#fca5a5' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Maintenance;
