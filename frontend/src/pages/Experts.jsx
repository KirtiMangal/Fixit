import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import expertService from '../services/expertService';
import problemService from '../services/problemService';
import { useAuth } from '../context/AuthContext';
import { PROBLEM_CATEGORIES } from '../utils/constants';

export const Experts = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isExpertRole = user?.role === 'EXPERT';

  const initialCat = searchParams.get('category') || '';
  const initialProblemId = searchParams.get('problemId') || '';

  const [activeTab, setActiveTab] = useState(isExpertRole ? 'sessions' : 'directory');
  const [experts, setExperts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [myProblems, setMyProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category filter for directory
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    title: '',
    topic: '',
    category: initialCat || 'LAPTOP',
    scheduledAt: '',
    durationMinutes: 45,
    problemId: initialProblemId || '',
    customerNotes: '',
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Expert Complete Modal
  const [completingSessionId, setCompletingSessionId] = useState(null);
  const [completeForm, setCompleteForm] = useState({
    expertSummary: '',
    checkpointsText: '',
  });
  const [completing, setCompleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'directory') {
        const res = await expertService.searchExperts(selectedCategory ? { category: selectedCategory } : {});
        setExperts(res.data || []);
      } else {
        const res = isExpertRole
          ? await expertService.getMyExpertSessions()
          : await expertService.getMyCustomerSessions();
        setSessions(res.data || []);
      }

      if (user && !isExpertRole) {
        problemService.getMyProblems().then((r) => setMyProblems(r.data || [])).catch(() => {});
      }
    } catch (e) {
      setError('Unable to load experts or sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedCategory, user]);

  const handleOpenBookModal = (exp) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedExpert(exp);
    setBookingForm({
      title: `Guided Repair Session with ${exp.user?.name}`,
      topic: 'Component diagnosis and troubleshooting',
      category: exp.specialties?.[0] || 'LAPTOP',
      scheduledAt: '',
      durationMinutes: 45,
      problemId: initialProblemId || '',
      customerNotes: '',
    });
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmittingBooking(true);
    try {
      await expertService.bookSession({
        expertId: selectedExpert.user?.id || selectedExpert.id,
        title: bookingForm.title,
        topic: bookingForm.topic,
        category: bookingForm.category,
        scheduledAt: new Date(bookingForm.scheduledAt).toISOString(),
        durationMinutes: parseInt(bookingForm.durationMinutes),
        problemId: bookingForm.problemId ? Number(bookingForm.problemId) : null,
        customerNotes: bookingForm.customerNotes,
      });
      setBookingModalOpen(false);
      setSuccessMsg(`Session scheduled with ${selectedExpert.user?.name}!`);
      setActiveTab('sessions');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book session');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCompleteSessionSubmit = async (e) => {
    e.preventDefault();
    setCompleting(true);
    try {
      const items = completeForm.checkpointsText.split('\n').map((s) => s.trim()).filter(Boolean);
      await expertService.completeSession(completingSessionId, {
        expertSummary: completeForm.expertSummary,
        checklistItems: items,
      });
      setCompletingSessionId(null);
      setSuccessMsg('Session marked completed and repair record created!');
      loadData();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete session');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            🎓 Learn With An Expert
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Book 1-on-1 interactive troubleshooting sessions. Master technical skills with guidance from veteran technicians.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('directory')}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'directory' ? 'white' : 'transparent',
              fontWeight: activeTab === 'directory' ? 700 : 500,
              cursor: 'pointer',
              color: activeTab === 'directory' ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            Find Instructors
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'sessions' ? 'white' : 'transparent',
              fontWeight: activeTab === 'sessions' ? 700 : 500,
              cursor: 'pointer',
              color: activeTab === 'sessions' ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            {isExpertRole ? 'My Teaching Queue' : 'My Booked Sessions'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <>
          {/* Category Filter */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Filter By Discipline:
              </span>
              <button
                onClick={() => setSelectedCategory('')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  border: !selectedCategory ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: !selectedCategory ? 'var(--primary-light)' : 'white',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                All Disciplines
              </button>
              {PROBLEM_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    border: selectedCategory === c.value ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: selectedCategory === c.value ? 'var(--primary-light)' : 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading expert instructors...</p>
            </div>
          ) : experts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧑‍🏫</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Expert Instructors Listed Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Instructors with the EXPERT role can register their technical profile to mentor customers.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {experts.map((exp) => (
                <div key={exp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                          {exp.user?.name?.slice(0, 2).toUpperCase() || 'EX'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{exp.user?.name || 'Expert Instructor'}</h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {exp.sessionCount || 0} mentored sessions
                          </span>
                        </div>
                      </div>

                      <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.7rem' }}>
                        🎓 Mentor
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#d97706', fontWeight: 700 }}>
                        ★ {exp.averageRating ? exp.averageRating.toFixed(1) : '5.0'}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ${exp.sessionRate || 35} / 45-min session
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem', minHeight: '36px' }}>
                      {exp.bio || 'Expert technical instructor dedicated to teaching step-by-step diagnostic and maintenance skills.'}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {exp.specialties?.map((s) => (
                        <span key={s} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#eff6ff', borderRadius: '4px', color: '#1d4ed8', fontWeight: 500 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      🕒 {exp.availableHours || 'Flexible Schedule'}
                    </span>
                    <button
                      onClick={() => handleOpenBookModal(exp)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem' }}
                    >
                      Book Session &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading guided sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗓</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Scheduled Sessions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {isExpertRole ? 'You have no mentoring sessions scheduled.' : 'You haven’t booked any expert guidance sessions yet.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {sessions.map((s) => (
                <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{s.title}</h3>
                        <span className="badge badge-info">{s.status}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Topic: <strong>{s.topic}</strong> &bull; Scheduled: <strong>{new Date(s.scheduledAt).toLocaleString()}</strong> (~{s.durationMinutes}m)
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                        {isExpertRole ? `Student: ${s.customer?.name}` : `Instructor: ${s.expert?.name}`}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>${s.sessionPrice}</span>
                    </div>
                  </div>

                  {/* Meeting link */}
                  {s.meetingLink && (
                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>
                        📹 Video Conference Room: <a href={s.meetingLink} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.meetingLink}</a>
                      </span>
                      <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                        Join Call &rarr;
                      </a>
                    </div>
                  )}

                  {/* Checkpoints or Notes */}
                  {s.checklistItems?.length > 0 && (
                    <div style={{ background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#15803d' }}>Skills &amp; Checkpoints Covered:</strong>
                      <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem', color: '#166534' }}>
                        {s.checklistItems.map((chk, i) => <li key={i}>{chk}</li>)}
                      </ul>
                    </div>
                  )}

                  {s.expertSummary && (
                    <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <strong>Instructor Follow-up Notes:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>{s.expertSummary}</p>
                    </div>
                  )}

                  {/* Expert completion action */}
                  {isExpertRole && s.status === 'SCHEDULED' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      <button
                        onClick={() => { setCompletingSessionId(s.id); setCompleteForm({ expertSummary: '', checkpointsText: '' }); }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                      >
                        ✓ Mark Session Completed &amp; Log Repair
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Session Modal */}
      {bookingModalOpen && selectedExpert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', background: '#fff', borderRadius: '12px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setBookingModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              &times;
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Book Guided Mentoring with {selectedExpert.user?.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Fee: <strong>${selectedExpert.sessionRate || 35}</strong> / 45-minute interactive video troubleshooting call.
            </p>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Session Topic / Learning Goal *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.topic}
                  onChange={(e) => setBookingForm((p) => ({ ...p, topic: e.target.value }))}
                  placeholder="e.g. Inspecting thermal throttling and replacing cooling paste"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Category *</label>
                  <select
                    value={bookingForm.category}
                    onChange={(e) => setBookingForm((p) => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                  >
                    {PROBLEM_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingForm.scheduledAt}
                    onChange={(e) => setBookingForm((p) => ({ ...p, scheduledAt: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              {myProblems.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Link to Reported Problem (Optional)</label>
                  <select
                    value={bookingForm.problemId}
                    onChange={(e) => setBookingForm((p) => ({ ...p, problemId: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                  >
                    <option value="">-- None --</option>
                    {myProblems.map((pr) => (
                      <option key={pr.id} value={pr.id}>#{pr.id} - {pr.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>What tools do you have on hand? (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Screwdriver set, multimeter, isopropyl alcohol"
                  value={bookingForm.customerNotes}
                  onChange={(e) => setBookingForm((p) => ({ ...p, customerNotes: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setBookingModalOpen(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={submittingBooking} className="btn btn-primary">
                  {submittingBooking ? 'Scheduling...' : 'Confirm & Reserve Time'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expert Complete Modal */}
      {completingSessionId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', background: '#fff', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Finalize Mentoring Session #{completingSessionId}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Log what you guided the student through. This adds a repair record to the customer’s maintenance history.
            </p>

            <form onSubmit={handleCompleteSessionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Session Summary &amp; Recommendations *
                </label>
                <textarea
                  required
                  rows={4}
                  value={completeForm.expertSummary}
                  onChange={(e) => setCompleteForm((p) => ({ ...p, expertSummary: e.target.value }))}
                  placeholder="e.g. Verified fan bearing was intact. Guided customer through removing dust blanket..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Skills &amp; Checkpoints Covered (One per line)
                </label>
                <textarea
                  rows={3}
                  value={completeForm.checkpointsText}
                  onChange={(e) => setCompleteForm((p) => ({ ...p, checkpointsText: e.target.value }))}
                  placeholder="Safe battery disconnection&#10;Thermal paste pea method application&#10;Stress test temperature audit"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setCompletingSessionId(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={completing} className="btn btn-primary" style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}>
                  {completing ? 'Saving...' : 'Finalize Session & Log Repair'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experts;
