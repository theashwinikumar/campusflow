import { useState } from 'react';

const EVENTS = [
  { id: 1, title: 'Annual Tech Fest 2026', date: '2026-03-25', time: '10:00 AM', venue: 'Main Auditorium', category: 'technical', rsvp: 234, desc: 'The biggest technical festival with coding competitions, hackathons, and workshops.' },
  { id: 2, title: 'Cultural Night', date: '2026-03-28', time: '6:00 PM', venue: 'Open Air Theatre', category: 'cultural', rsvp: 156, desc: 'An evening of dance, music, and drama performances by students.' },
  { id: 3, title: 'Inter-College Cricket', date: '2026-04-02', time: '9:00 AM', venue: 'Sports Ground', category: 'sports', rsvp: 89, desc: 'Cricket tournament with teams from 8 colleges.' },
  { id: 4, title: 'AI/ML Workshop', date: '2026-04-05', time: '2:00 PM', venue: 'Seminar Hall B', category: 'academic', rsvp: 67, desc: 'Hands-on workshop on machine learning with Python and TensorFlow.' },
  { id: 5, title: 'Photography Walk', date: '2026-04-08', time: '7:00 AM', venue: 'College Campus', category: 'cultural', rsvp: 45, desc: 'Explore and capture the beauty of our campus.' },
  { id: 6, title: 'Startup Weekend', date: '2026-04-12', time: '10:00 AM', venue: 'Innovation Lab', category: 'technical', rsvp: 112, desc: '54-hour event to launch a startup from scratch.' },
];

const CATEGORIES = ['all', 'technical', 'cultural', 'sports', 'academic'];
const CAT_COLORS = { technical: 'blue', cultural: 'purple', sports: 'green', academic: 'cyan' };

export default function Events() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.category === filter);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>🎉 Events</h1>
          <p>Discover and RSVP to campus events</p>
        </div>
        <button className="btn btn-primary">+ Create Event</button>
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
              <span className={`badge badge-${CAT_COLORS[ev.category]}`}>{ev.category}</span>
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
            <button className="btn btn-primary" style={{ width: '100%' }}>RSVP Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
