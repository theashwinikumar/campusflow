import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHostelData } from '../hooks/useHostelData';

const PRIORITY_BADGE = { high: 'badge-red', medium: 'badge-amber', low: 'badge-blue', critical: 'badge-red' };
const STATUS_BADGE = { open: 'badge-red', 'in-progress': 'badge-amber', resolved: 'badge-green', closed: 'badge-green' };

export default function Hostel() {
  const { user } = useAuth();
  const { rooms, complaints, submitComplaint, loading } = useHostelData(user);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ roomId: '', issue: '', priority: 'Low' });
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading hostel details...</div>;
  }

  const handleSubmit = async () => {
    if (!formData.roomId || !formData.issue) return alert('Please fill in all fields');
    setSubmitting(true);
    await submitComplaint(formData.roomId, formData.issue, formData.priority);
    setSubmitting(false);
    setShowForm(false);
    setFormData({ roomId: '', issue: '', priority: 'Low' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏠 Hostel Manager</h1>
        <p>Room allocations, complaints, and hostel management</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🏢</div>
          <div className="stat-card__value">{rooms.length}</div>
          <div className="stat-card__label">Total Rooms</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🟢</div>
          <div className="stat-card__value">{rooms.filter(r => r.status === 'available').length}</div>
          <div className="stat-card__label">Available</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🔴</div>
          <div className="stat-card__value">{rooms.filter(r => r.status === 'full').length}</div>
          <div className="stat-card__label">Full</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🛠️</div>
          <div className="stat-card__value">{complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length}</div>
          <div className="stat-card__label">Open Complaints</div>
        </div>
      </div>

      {/* Room Allocation */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>🛏️ Room Allocation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
          {rooms.map(r => (
            <div key={r.id || r.room} className="glass-card" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>{r.room}</span>
                <span className={`badge ${r.status === 'available' ? 'badge-green' : 'badge-red'}`}>
                  {r.status === 'available' ? '🟢 Available' : '🔴 Full'}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Block {r.block} · Floor {r.floor} · Capacity: {r.capacity}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {r.occupants.map((o, index) => (
                  <span key={index} className="badge badge-blue">{typeof o === 'string' && o.length < 15 ? o : `Resident ${index+1}`}</span>
                ))}
                {Array.from({ length: Math.max(0, r.capacity - r.occupants.length) }).map((_, i) => (
                  <span key={`empty-${i}`} className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px dashed var(--border-subtle)' }}>Empty</span>
                ))}
              </div>
            </div>
          ))}
          {rooms.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No rooms configured.</div>}
        </div>
      </div>

      {/* Complaints */}
      <div className="glass-card section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h3>🛠️ Your Maintenance Complaints</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ fontSize: 'var(--text-sm)' }}>
            {showForm ? '✕ Cancel' : '+ New Complaint'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: '1px solid var(--border-subtle)', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Room</label>
                <select className="input-field" value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })}>
                  <option value="">Select Room</option>
                  {rooms.map(r => <option key={r.id || r.room} value={r.id || r.room}>{r.room}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Priority</label>
                <select className="input-field" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Issue Description</label>
              <input type="text" className="input-field" placeholder="Describe the issue..." value={formData.issue} onChange={e => setFormData({ ...formData, issue: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Complaint'}</button>
          </div>
        )}

        <table className="data-table">
          <thead>
            <tr><th>Room</th><th>Issue</th><th>Priority</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.room}</td>
                <td>{c.issue}</td>
                <td><span className={`badge ${PRIORITY_BADGE[c.priority] || 'badge-gray'}`}>{c.priority}</span></td>
                <td><span className={`badge ${STATUS_BADGE[c.status] || 'badge-gray'}`}>{c.status}</span></td>
                <td>{new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
