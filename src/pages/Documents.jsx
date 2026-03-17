import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocumentsData } from '../hooks/useDocumentsData';

const DOC_TYPES = ['Bonafide Certificate', 'Transcript', 'No Objection Certificate', 'Character Certificate',
  'Migration Certificate', 'Fee Receipt', 'ID Card Duplicate', 'Recommendation Letter'];

const STATUS_MAP = {
  pending: { label: 'Pending', badge: 'badge-amber' },
  approved: { label: 'Approved', badge: 'badge-blue' },
  ready: { label: 'Ready', badge: 'badge-green' },
  rejected: { label: 'Rejected', badge: 'badge-red' },
};

export default function Documents() {
  const { user } = useAuth();
  const { documents, loading, submitting, submitDocumentRequest, cancelRequest } = useDocumentsData(user);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [type, setType] = useState('');
  const [copies, setCopies] = useState(1);
  const [remarks, setRemarks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) return alert('Please select a document type.');
    const success = await submitDocumentRequest(type, copies, remarks);
    if (success) {
      setShowForm(false);
      setType('');
      setCopies(1);
      setRemarks('');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading documents...</div>;
  }

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
          <div className="stat-card__value">{documents.length}</div>
          <div className="stat-card__label">Total Requests</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">⏳</div>
          <div className="stat-card__value">{documents.filter(d => d.status === 'pending').length}</div>
          <div className="stat-card__label">Pending</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__value">{documents.filter(d => d.status === 'ready' || d.status === 'approved').length}</div>
          <div className="stat-card__label">Ready to Collect</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">❌</div>
          <div className="stat-card__value">{documents.filter(d => d.status === 'rejected').length}</div>
          <div className="stat-card__label">Rejected</div>
        </div>
      </div>

      {/* Request Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📝 New Document Request</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Document Type</label>
              <select className="input-field" value={type} onChange={e => setType(e.target.value)} required>
                <option value="">Select document type</option>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Copies Needed</label>
              <input type="number" className="input-field" value={copies} onChange={e => setCopies(Number(e.target.value))} min={1} max={5} required />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Purpose / Remarks</label>
              <textarea className="input-field" rows={3} placeholder="Briefly describe the purpose..." value={remarks} onChange={e => setRemarks(e.target.value)} style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
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
            {documents.map((doc, i) => (
              <tr key={doc.id}>
                <td>{i + 1}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{doc.type}</td>
                <td>{new Date(doc.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td><span className={`badge ${STATUS_MAP[doc.status]?.badge || 'badge-amber'}`}>{STATUS_MAP[doc.status]?.label || doc.status}</span></td>
                <td>{doc.remarks}</td>
                <td>
                  {(doc.status === 'ready' || doc.status === 'approved') && <button className="btn btn-success" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Download</button>}
                  {doc.status === 'pending' && <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }} onClick={() => cancelRequest(doc.id)}>Cancel</button>}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No documents found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
