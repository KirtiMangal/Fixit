import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import technicianService from '../services/technicianService';
import { PROBLEM_CATEGORIES } from '../utils/constants';
import BookServiceModal from '../components/BookServiceModal';
import { useAuth } from '../context/AuthContext';

export const Technicians = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialCat = searchParams.get('category') || '';
  const initialProblemId = searchParams.get('problemId') || '';

  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [serviceArea, setServiceArea] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Modal State
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const fetchTechnicians = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (serviceArea) params.serviceArea = serviceArea;
      if (availableOnly) params.availableOnly = true;

      const res = await technicianService.searchTechnicians(params);
      setTechnicians(res.data || []);
    } catch (err) {
      setError('Unable to load technician directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [selectedCategory, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTechnicians();
  };

  const handleBookClick = (tech) => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setSelectedTechnician(tech);
    setModalOpen(true);
  };

  const handleBookingSuccess = (newRequest) => {
    setBookingSuccess(`Service request #${newRequest.id} booked successfully with ${selectedTechnician?.user?.name}!`);
    setTimeout(() => setBookingSuccess(null), 6000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          👨‍🔧 Verified Technician Marketplace
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Connect with vetted field professionals for on-site repairs, component replacements, and diagnostics.
        </p>
      </div>

      {bookingSuccess && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✓ {bookingSuccess}</span>
          <button onClick={() => navigate('/service-requests')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            View My Requests &rarr;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
            >
              <option value="">All Categories</option>
              {PROBLEM_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '2 1 250px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Service Area / Neighborhood
            </label>
            <input
              type="text"
              placeholder="e.g. Downtown, Metro, North Side..."
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.2rem' }}>
            <input
              type="checkbox"
              id="availCheck"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="availCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              Available Now Only
            </label>
          </div>

          <div style={{ paddingTop: '1.2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading verified technicians...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : technicians.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Technicians Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            No verified technicians match your current filters. Try resetting the category or expanding your service area.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {technicians.map((tech) => (
            <div key={tech.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'box-shadow 0.2s' }}>
              <div>
                {/* Header with avatar & badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                      {tech.user?.name?.slice(0, 2).toUpperCase() || 'TC'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                        {tech.user?.name || 'Verified Technician'}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {tech.serviceArea || 'Metro Region'} &bull; {tech.experienceYears || 1}+ yrs exp
                      </span>
                    </div>
                  </div>

                  <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.7rem' }}>
                    ✓ Verified
                  </span>
                </div>

                {/* Rating & Rate */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 700 }}>
                    ★ {tech.averageRating ? tech.averageRating.toFixed(1) : '5.0'}
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.2rem' }}>
                      ({tech.reviewCount || 0} reviews)
                    </span>
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ${tech.hourlyRate || 50}/hr
                  </span>
                </div>

                {/* Bio */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem', minHeight: '38px' }}>
                  {tech.bio || 'Certified repair technician specializing in high-reliability diagnosis and parts replacement.'}
                </p>

                {/* Specialties */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {tech.specialties?.map((sp) => (
                    <span key={sp} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: tech.isAvailable ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                  {tech.isAvailable ? '● Available for dispatch' : '○ Currently busy'}
                </span>
                <button
                  onClick={() => handleBookClick(tech)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem' }}
                >
                  Book Service &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Service Modal */}
      <BookServiceModal
        technician={selectedTechnician}
        initialProblemId={initialProblemId}
        initialCategory={selectedCategory}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Technicians;
