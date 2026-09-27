import React from 'react';
import { Link } from 'react-router-dom';
import useHealth from '../hooks/useHealth';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { health, loading, error, refetch } = useHealth();
  const { isAuthenticated, user } = useAuth();

  const domains = [
    { name: 'Laptop', icon: '💻', desc: 'Overheating, display, battery, slow OS, keyboard failure' },
    { name: 'Mobile Phone', icon: '📱', desc: 'Cracked glass, charging port, battery drain, mic/audio' },
    { name: 'Home Appliance', icon: '🧊', desc: 'Refrigerators, washing machines, microwaves, HVAC' },
    { name: 'Electronics', icon: '⚡', desc: 'Smart TV, audio systems, power supplies, circuit boards' },
    { name: 'Plumbing', icon: '🚰', desc: 'Leaking pipe, low water pressure, clogged drains, faucets' },
    { name: 'Electrical', icon: '💡', desc: 'Tripping breakers, flicker lights, short circuits, switchboards' },
    { name: 'Furniture', icon: '🪑', desc: 'Wobbly chairs, hinge alignment, wood polish, upholstery' },
    { name: 'Vehicle', icon: '🚗', desc: 'Brake squeak, battery jump, oil service, tire pressure' },
  ];

  const journeySteps = [
    {
      num: '01',
      title: 'Diagnose',
      badge: 'AI Powered',
      desc: 'Describe symptoms or select an asset. Our AI triage system pinpoints probable root causes, severity, and safety hazards.',
      icon: '🔍',
    },
    {
      num: '02',
      title: 'Decide',
      badge: '3 Pathways',
      desc: 'We never force a single path. Choose between self-repair, guided mentorship, or professional dispatch depending on risk and skill.',
      icon: '🧭',
    },
    {
      num: '03',
      title: 'Resolve',
      badge: 'Actionable',
      desc: 'Follow curated DIY step guides or dispatch certified background-checked technicians with transparent rate cards.',
      icon: '🛠️',
    },
    {
      num: '04',
      title: 'Learn',
      badge: 'Mentorship',
      desc: 'Book 1-on-1 virtual sessions with vetted master technicians to learn how to diagnose and repair yourself next time.',
      icon: '🎓',
    },
    {
      num: '05',
      title: 'Remember',
      badge: 'Asset Ledger',
      desc: 'Every repair is logged against your registered asset. Monitor cumulative spend, warranty dates, and lifetime DIY savings.',
      icon: '📋',
    },
    {
      num: '06',
      title: 'Prevent',
      badge: 'Proactive',
      desc: 'Receive AI preventive maintenance reminders tailored to your assets before costly catastrophic breakdowns happen.',
      icon: '🛡️',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
          borderRadius: '16px',
          border: '1px solid var(--border-color, #e2e8f0)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <span>✨</span> FixIt Lifecycle Engine &bull; Beyond Simple Booking
        </div>
        
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
          Diagnose. Decide. Resolve.<br />
          <span style={{ color: 'var(--primary, #3b82f6)' }}>Learn. Remember. Prevent.</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary, #64748b)', maxWidth: '720px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          FixIt is your complete problem-resolution and maintenance platform. We empower you to understand issues with AI diagnosis, choose between DIY, mentorship, or certified technicians, and maintain a permanent health record for every device you own.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={isAuthenticated ? '/problems/report' : '/login'}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }}
          >
            🚨 Report a Problem
          </Link>
          <Link
            to="/diy-guides"
            className="btn btn-outline"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', backgroundColor: '#ffffff' }}
          >
            📖 Browse DIY Guides
          </Link>
          <Link
            to="/technicians"
            className="btn btn-outline"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', backgroundColor: '#ffffff' }}
          >
            👨‍🔧 Hire Technician
          </Link>
        </div>

        {isAuthenticated && (
          <div style={{ marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Welcome back, <strong>{user?.name}</strong>! Jump straight to your{' '}
            <Link to="/maintenance-hub" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Personal Maintenance Hub &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Core 6-Stage Journey Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            The 6-Stage Resolution Journey
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            FixIt replaces stressful guesswork with a structured, transparent engineering process.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {journeySteps.map((step) => (
            <div
              key={step.num}
              className="card"
              style={{
                position: 'relative',
                padding: '1.75rem',
                borderTop: '4px solid var(--primary, #3b82f6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>{step.icon}</span>
                <span className="badge badge-info" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {step.badge}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  {step.num}.
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Domains Grid */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Supported Domains
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            From high-tech microelectronics to plumbing and automotive systems.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {domains.map((dom) => (
            <div
              key={dom.name}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{dom.icon}</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {dom.name}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {dom.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section
        style={{
          background: '#f8fafc',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color, #e2e8f0)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Why FixIt is Different</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '1.75rem' }}>🛡️</div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Safety Triage First</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                High-voltage, combustible gas, or critical brake systems automatically trigger safety locks advising professional dispatch.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '1.75rem' }}>💰</div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Cumulative Spend & DIY Savings</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Every self-repair logs estimated contractor savings to celebrate your growing mechanical independence.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '1.75rem' }}>🔔</div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Predictive Maintenance Engine</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Set recurring cycles (AC filter, laptop thermal paste, oil change) with automatic recalculation of next due dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Connectivity Status Section */}
      <section style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>System Health & Connectivity</h3>
            <button onClick={refetch} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              Ping API
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Endpoint: <code>GET /api/health</code>
          </p>

          <div>
            {loading ? (
              <span className="badge badge-warning">Connecting to backend...</span>
            ) : health ? (
              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                  Backend Connected (UP)
                </span>
                <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto', marginTop: '0.5rem' }}>
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                  Backend Offline / Disconnected
                </span>
                <p style={{ fontSize: '0.825rem', color: '#b91c1c', marginTop: '0.5rem' }}>
                  {error}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Make sure the Spring Boot backend is running on <code>http://localhost:8080</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
