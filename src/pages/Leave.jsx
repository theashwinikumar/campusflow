import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeaveData } from '../hooks/useLeaveData';

const STATUS_STYLES = { approved: 'badge-green', pending: 'badge-amber', rejected: 'badge-red' };

export default function Leave() {
  const { user } = useAuth();
  const { requests, balance, loading, submitting, submitLeave } = useLeaveData(user);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [type, setType] = useState('Casual');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to || !reason) return alert('Please fill in all fields.');
    if (new Date(to) < new Date(from)) return alert('End date cannot be before start date.');
    
    const success = await submitLeave(type, from, to, reason);
    if (success) {
      setShowForm(false);
      setFrom('');
      setTo('');
      setReason('');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading leave data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>🌿 Leave Manager</h1>
          <p>Apply for leave and track your requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ Apply Leave'}
        </button>
      </div>

      {/* Leave Balance */}
      <div className="stats-grid">
        {balance.map(lb => (
          <div className="glass-card stat-card" key={lb.type}>
            <div className="stat-card__header">
              <span className="stat-card__icon">{lb.type === 'Casual' ? '🏖️' : lb.type === 'Medical' ? '🏥' : '🎓'}</span>
              <span className={`badge badge-${lb.color}`}>{Math.max(0, lb.total - lb.used)} left</span>
            </div>
            <div className="stat-card__value">{lb.used}/{lb.total}</div>
            <div className="stat-card__label">{lb.type} Leave</div>
            <div style={{ marginTop: '8px', height: 4, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (lb.used / lb.total) * 100)}%`, height: '100%', background: `var(--accent-${lb.color})`, borderRadius: 'var(--radius-full)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Application Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📝 Leave Application</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Leave Type</label>
              <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
                <option>Casual</option><option>Medical</option><option>Academic</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>From Date</label>
              <input type="date" className="input-field" value={from} onChange={e => setFrom(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>To Date</label>
              <input type="date" className="input-field" value={to} onChange={e => setTo(e.target.value)} required />
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Reason</label>
              <textarea className="input-field" rows={3} placeholder="Provide your reason for leave..." value={reason} onChange={e => setReason(e.target.value)} style={{ resize: 'vertical' }} required></textarea>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Leave Requests Table */}
      <div className="glass-card section-card">
        <h3>📋 Leave History</h3>
        <table className="data-table">
          <thead>
            <tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Approver</th><th>Status</th></tr>
          </thead>
          <tbody>
            {requests.map(lr => (
              <tr key={lr.id}>
                <td><span className={`badge badge-${lr.type === 'Casual' ? 'blue' : lr.type === 'Medical' ? 'green' : 'purple'}`}>{lr.type}</span></td>
                <td>{new Date(lr.from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{new Date(lr.to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td style={{ color: 'var(--text-primary)' }}>{lr.reason}</td>
                <td>{lr.approver}</td>
                <td><span className={`badge ${STATUS_STYLES[lr.status] || 'badge-amber'}`}>{lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}</span></td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No leave history.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
