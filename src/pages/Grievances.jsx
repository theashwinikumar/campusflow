import { useState } from 'react';

const GRIEVANCES = [
  { id: 1, subject: 'WiFi issue in Block C', category: 'infrastructure', status: 'open', date: '2026-03-16', anonymous: false },
  { id: 2, subject: 'Canteen food quality', category: 'hostel', status: 'in-progress', date: '2026-03-14', anonymous: true },
  { id: 3, subject: 'Lab computers not updated', category: 'academic', status: 'resolved', date: '2026-03-10', anonymous: false },
  { id: 4, subject: 'Harassment incident report', category: 'ragging', status: 'in-progress', date: '2026-03-12', anonymous: true },
  { id: 5, subject: 'Broken chairs in Room 201', category: 'infrastructure', status: 'open', date: '2026-03-15', anonymous: false },
];

const STATUS_BADGE = { open: 'badge-red', 'in-progress': 'badge-amber', resolved: 'badge-green' };
const CAT_COLORS = { infrastructure: 'blue', hostel: 'purple', academic: 'cyan', ragging: 'red' };

export default function Grievances() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>🛡️ Grievances & Feedback</h1>
          <p>Submit and track grievances — anonymous submissions supported</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ Submit Grievance'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card"><div className="stat-card__icon">📋</div><div className="stat-card__value">{GRIEVANCES.length}</div><div className="stat-card__label">Total</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🔴</div><div className="stat-card__value">{GRIEVANCES.filter(g => g.status === 'open').length}</div><div className="stat-card__label">Open</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🟡</div><div className="stat-card__value">{GRIEVANCES.filter(g => g.status === 'in-progress').length}</div><div className="stat-card__label">In Progress</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">✅</div><div className="stat-card__value">{GRIEVANCES.filter(g => g.status === 'resolved').length}</div><div className="stat-card__label">Resolved</div></div>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📝 Submit a Grievance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Category</label>
              <select className="input-field">
                <option>Infrastructure</option><option>Academic</option><option>Hostel</option><option>Ragging</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Subject</label>
              <input type="text" className="input-field" placeholder="Brief subject line" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input-field" rows={4} placeholder="Describe your grievance in detail..." style={{ resize: 'vertical' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <input type="checkbox" /> Submit Anonymously
              </label>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary">Submit</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Grievance List */}
      <div className="glass-card section-card">
        <h3>📋 Your Grievances</h3>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Subject</th><th>Category</th><th>Date</th><th>Anonymous</th><th>Status</th></tr>
          </thead>
          <tbody>
            {GRIEVANCES.map((g, i) => (
              <tr key={g.id}>
                <td>{i + 1}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{g.subject}</td>
                <td><span className={`badge badge-${CAT_COLORS[g.category]}`}>{g.category}</span></td>
                <td>{new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{g.anonymous ? '🔒 Yes' : 'No'}</td>
                <td><span className={`badge ${STATUS_BADGE[g.status]}`}>{g.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
