import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGrievancesData } from '../hooks/useGrievancesData';

const STATUS_BADGE = { open: 'badge-red', 'in-progress': 'badge-amber', resolved: 'badge-green' };
const CAT_COLORS = { infrastructure: 'blue', hostel: 'purple', academic: 'cyan', ragging: 'red', other: 'gray' };

export default function Grievances() {
  const { user } = useAuth();
  const { grievances, submitGrievance, loading } = useGrievancesData(user);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: 'Infrastructure', subject: '', description: '', anonymous: false });
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading feedback & grievances...</div>;
  }

  const handleSubmit = async () => {
    if (!formData.subject || !formData.description) return alert('Please fill in all fields');
    setSubmitting(true);
    await submitGrievance(formData);
    setSubmitting(false);
    setShowForm(false);
    setFormData({ category: 'Infrastructure', subject: '', description: '', anonymous: false });
  };

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
        <div className="glass-card stat-card"><div className="stat-card__icon">📋</div><div className="stat-card__value">{grievances.length}</div><div className="stat-card__label">Total</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🔴</div><div className="stat-card__value">{grievances.filter(g => g.status === 'open').length}</div><div className="stat-card__label">Open</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🟡</div><div className="stat-card__value">{grievances.filter(g => g.status === 'in-progress').length}</div><div className="stat-card__label">In Progress</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">✅</div><div className="stat-card__value">{grievances.filter(g => g.status === 'resolved').length}</div><div className="stat-card__label">Resolved</div></div>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📝 Submit a Grievance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Category</label>
              <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option>Infrastructure</option><option>Academic</option><option>Hostel</option><option>Ragging</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Subject</label>
              <input type="text" className="input-field" placeholder="Brief subject line" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input-field" rows={4} placeholder="Describe your grievance in detail..." style={{ resize: 'vertical' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={formData.anonymous} onChange={e => setFormData({ ...formData, anonymous: e.target.checked })} /> Submit Anonymously
              </label>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
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
            {grievances.map((g, i) => (
              <tr key={g.id}>
                <td>{i + 1}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{g.subject}</td>
                <td><span className={`badge badge-${CAT_COLORS[g.category] || 'gray'}`}>{g.category}</span></td>
                <td>{new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{g.anonymous ? '🔒 Yes' : 'No'}</td>
                <td><span className={`badge ${STATUS_BADGE[g.status] || 'badge-blue'}`}>{g.status}</span></td>
              </tr>
            ))}
            {grievances.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No grievances found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
