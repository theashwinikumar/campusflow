import { useState } from 'react';
import { useNoticeboardData } from '../hooks/useNoticeboardData';

const CAT_COLORS = { academic: 'blue', general: 'purple', events: 'green', finance: 'amber' };

export default function Noticeboard() {
  const { notices, loading } = useNoticeboardData();
  const [filter, setFilter] = useState('all');
  const cats = ['all', 'academic', 'general', 'events', 'finance'];

  const filtered = filter === 'all' ? notices : notices.filter(n => n.category === filter);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading notices...</div>;
  }

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
                <span className={`badge badge-${CAT_COLORS[notice.category] || 'purple'}`}>{notice.category}</span>
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
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No notices found.</div>
        )}
      </div>
    </div>
  );
}
