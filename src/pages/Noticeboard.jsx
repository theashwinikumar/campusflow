import { useState } from 'react';

const NOTICES = [
  { id: 1, title: 'Mid-Semester Exam Schedule Released', body: 'The mid-semester examination schedule for all departments has been published. Please check the Exams section for detailed timetable.', category: 'academic', urgent: true, pinned: true, author: 'Examination Cell', date: '2026-03-17' },
  { id: 2, title: 'Campus WiFi Maintenance — March 20', body: 'Campus WiFi will be under maintenance from 10 PM to 6 AM on March 20. Please plan accordingly.', category: 'general', urgent: false, pinned: true, author: 'IT Department', date: '2026-03-16' },
  { id: 3, title: 'Tech Fest 2026 Registrations Open', body: 'Register for the Annual Tech Fest 2026! Over 20 events including hackathons, coding contests, and workshops. Last date: March 22.', category: 'events', urgent: false, pinned: false, author: 'Event Committee', date: '2026-03-15' },
  { id: 4, title: 'Library Hours Extended During Exams', body: 'The central library will remain open until 11 PM from April 10 to April 30 to support exam preparation.', category: 'academic', urgent: false, pinned: false, author: 'Library', date: '2026-03-14' },
  { id: 5, title: 'Anti-Ragging Awareness Week', body: 'Anti-ragging awareness sessions will be held from March 24-28. Attendance is mandatory for all first-year students.', category: 'general', urgent: true, pinned: false, author: 'Dean of Students', date: '2026-03-13' },
  { id: 6, title: 'Semester Fee Last Date: March 31', body: 'Students are reminded that the last date for paying semester fees without late charges is March 31, 2026.', category: 'finance', urgent: true, pinned: false, author: 'Accounts Department', date: '2026-03-12' },
];

const CAT_COLORS = { academic: 'blue', general: 'purple', events: 'green', finance: 'amber' };

export default function Noticeboard() {
  const [filter, setFilter] = useState('all');
  const cats = ['all', 'academic', 'general', 'events', 'finance'];
  const filtered = filter === 'all' ? NOTICES : NOTICES.filter(n => n.category === filter);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>📢 Noticeboard</h1>
          <p>Official notices and announcements</p>
        </div>
        <button className="btn btn-primary">+ Post Notice</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(c)} style={{ fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Notices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {filtered.map((notice, i) => (
          <div key={notice.id} className="glass-card" style={{ padding: 'var(--space-lg)', animation: `fadeIn 0.3s ease ${i * 0.06}s both`, borderLeft: notice.urgent ? '3px solid var(--accent-red)' : notice.pinned ? '3px solid var(--accent-blue)' : '3px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                {notice.pinned && <span title="Pinned" style={{ fontSize: '0.9rem' }}>📌</span>}
                {notice.urgent && <span className="badge badge-red">🔴 Urgent</span>}
                <span className={`badge badge-${CAT_COLORS[notice.category]}`}>{notice.category}</span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)' }}>{notice.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-sm)' }}>{notice.body}</p>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Posted by {notice.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
