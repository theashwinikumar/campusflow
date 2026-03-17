import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEventsData } from '../hooks/useEventsData';

const CATEGORIES = ['all', 'technical', 'cultural', 'sports', 'academic'];
const CAT_COLORS = { technical: 'blue', cultural: 'purple', sports: 'green', academic: 'cyan' };

export default function Events() {
  const { user } = useAuth();
  const { events, loading, toggleRSVP } = useEventsData(user);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading events...</div>;
  }

  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>🎉 Events</h1>
          <p>Discover and RSVP to campus events</p>
        </div>
        {isFacultyOrAdmin && (
          <button className="btn btn-primary">+ Create Event</button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(c)}
            style={{ fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-lg)' }}>
        {filtered.map((ev, i) => (
          <div key={ev.id} className="glass-card" style={{ padding: 'var(--space-lg)', animation: `fadeIn 0.4s ease ${i * 0.08}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <span className={`badge badge-${CAT_COLORS[ev.category?.toLowerCase()] || 'purple'}`}>{ev.category}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)' }}>{ev.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>{ev.desc}</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
              <span>🕐 {ev.time}</span>
              <span>📍 {ev.venue}</span>
              <span>👥 {ev.rsvp} RSVPs</span>
            </div>
            <button 
              className={`btn ${ev.hasRSVP ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ width: '100%' }}
              onClick={() => toggleRSVP(ev)}
            >
              {ev.hasRSVP ? 'Cancel RSVP' : 'RSVP Now'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7, gridColumn: '1 / -1' }}>No events found for this category.</div>
        )}
      </div>
    </div>
  );
}
