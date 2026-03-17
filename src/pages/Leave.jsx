import { useState } from 'react';

const LEAVE_REQUESTS = [
  { id: 1, type: 'Casual', from: '2026-03-20', to: '2026-03-21', reason: 'Family function', status: 'approved', approver: 'Dr. Priya Mehta' },
  { id: 2, type: 'Medical', from: '2026-03-18', to: '2026-03-19', reason: 'Doctor appointment', status: 'pending', approver: 'Dr. Amit Verma' },
  { id: 3, type: 'Academic', from: '2026-03-25', to: '2026-03-26', reason: 'Conference at IIT Delhi', status: 'pending', approver: 'Dr. Priya Mehta' },
  { id: 4, type: 'Casual', from: '2026-03-01', to: '2026-03-01', reason: 'Personal work', status: 'rejected', approver: 'Dr. Neha Gupta' },
];

const LEAVE_BALANCE = [
  { type: 'Casual', total: 12, used: 3, color: 'blue' },
  { type: 'Medical', total: 10, used: 1, color: 'green' },
  { type: 'Academic', total: 5, used: 0, color: 'purple' },
];

const STATUS_STYLES = { approved: 'badge-green', pending: 'badge-amber', rejected: 'badge-red' };

export default function Leave() {
  const [showForm, setShowForm] = useState(false);

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
        {LEAVE_BALANCE.map(lb => (
          <div className="glass-card stat-card" key={lb.type}>
            <div className="stat-card__header">
              <span className="stat-card__icon">{lb.type === 'Casual' ? '🏖️' : lb.type === 'Medical' ? '🏥' : '🎓'}</span>
              <span className={`badge badge-${lb.color}`}>{lb.total - lb.used} left</span>
            </div>
            <div className="stat-card__value">{lb.used}/{lb.total}</div>
            <div className="stat-card__label">{lb.type} Leave</div>
            <div style={{ marginTop: '8px', height: 4, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${(lb.used / lb.total) * 100}%`, height: '100%', background: `var(--accent-${lb.color})`, borderRadius: 'var(--radius-full)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Application Form */}
      {showForm && (
        <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📝 Leave Application</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Leave Type</label>
              <select className="input-field">
                <option>Casual</option><option>Medical</option><option>Academic</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>From Date</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>To Date</label>
              <input type="date" className="input-field" />
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Reason</label>
              <textarea className="input-field" rows={3} placeholder="Provide your reason for leave..." style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary">Submit Application</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="glass-card section-card">
        <h3>📋 Leave History</h3>
        <table className="data-table">
          <thead>
            <tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Approver</th><th>Status</th></tr>
          </thead>
          <tbody>
            {LEAVE_REQUESTS.map(lr => (
              <tr key={lr.id}>
                <td><span className={`badge badge-${lr.type === 'Casual' ? 'blue' : lr.type === 'Medical' ? 'green' : 'purple'}`}>{lr.type}</span></td>
                <td>{new Date(lr.from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{new Date(lr.to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td style={{ color: 'var(--text-primary)' }}>{lr.reason}</td>
                <td>{lr.approver}</td>
                <td><span className={`badge ${STATUS_STYLES[lr.status]}`}>{lr.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
