import { useState } from 'react';

const DOCUMENTS = [
  { id: 1, type: 'Bonafide Certificate', requestDate: '2026-03-10', status: 'approved', remarks: 'Ready for collection' },
  { id: 2, type: 'Transcript', requestDate: '2026-03-12', status: 'pending', remarks: 'Under review' },
  { id: 3, type: 'No Objection Certificate', requestDate: '2026-03-05', status: 'ready', remarks: 'Collect from admin office' },
  { id: 4, type: 'Character Certificate', requestDate: '2026-02-28', status: 'rejected', remarks: 'Incomplete application' },
  { id: 5, type: 'Migration Certificate', requestDate: '2026-03-15', status: 'pending', remarks: 'Processing' },
];

const DOC_TYPES = ['Bonafide Certificate', 'Transcript', 'No Objection Certificate', 'Character Certificate',
  'Migration Certificate', 'Fee Receipt', 'ID Card Duplicate', 'Recommendation Letter'];

const STATUS_MAP = {
  pending: { label: 'Pending', badge: 'badge-amber' },
  approved: { label: 'Approved', badge: 'badge-blue' },
  ready: { label: 'Ready', badge: 'badge-green' },
  rejected: { label: 'Rejected', badge: 'badge-red' },
};

export default function Documents() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>📄 Documents</h1>
          <p>Request and track your document applications</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ New Request'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📋</div>
          <div className="stat-card__value">{DOCUMENTS.length}</div>
          <div className="stat-card__label">Total Requests</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">⏳</div>
          <div className="stat-card__value">{DOCUMENTS.filter(d => d.status === 'pending').length}</div>
          <div className="stat-card__label">Pending</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__value">{DOCUMENTS.filter(d => d.status === 'ready').length}</div>
          <div className="stat-card__label">Ready to Collect</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">❌</div>
          <div className="stat-card__value">{DOCUMENTS.filter(d => d.status === 'rejected').length}</div>
          <div className="stat-card__label">Rejected</div>
        </div>
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📝 New Document Request</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Document Type</label>
              <select className="input-field">
                <option value="">Select document type</option>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Copies Needed</label>
              <input type="number" className="input-field" defaultValue={1} min={1} max={5} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Purpose / Remarks</label>
              <textarea className="input-field" rows={3} placeholder="Briefly describe the purpose..." style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary">Submit Request</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Documents Table */}
      <div className="glass-card section-card">
        <h3>📁 Your Requests</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Document</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map((doc, i) => (
              <tr key={doc.id}>
                <td>{i + 1}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{doc.type}</td>
                <td>{new Date(doc.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td><span className={`badge ${STATUS_MAP[doc.status].badge}`}>{STATUS_MAP[doc.status].label}</span></td>
                <td>{doc.remarks}</td>
                <td>
                  {doc.status === 'ready' && <button className="btn btn-success" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Download</button>}
                  {doc.status === 'pending' && <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
