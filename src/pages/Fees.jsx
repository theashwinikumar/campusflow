import { useAuth } from '../context/AuthContext';
import { useFeesData } from '../hooks/useFeesData';

const STATUS_BADGE = { paid: 'badge-green', pending: 'badge-amber', upcoming: 'badge-blue', overdue: 'badge-red' };

export default function Fees() {
  const { user } = useAuth();
  const { fees, payFee, loading } = useFeesData(user);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading fee details...</div>;
  }

  const totalDue = fees.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((a, f) => a + Number(f.amount), 0);
  const totalPaid = fees.filter(f => f.status === 'paid').reduce((a, f) => a + Number(f.amount), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💰 Fee Management</h1>
        <p>View fee breakdown and payment status</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card__icon">💳</div>
          <div className="stat-card__value">₹{totalDue.toLocaleString('en-IN')}</div>
          <div className="stat-card__label">Total Due</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__value">₹{totalPaid.toLocaleString('en-IN')}</div>
          <div className="stat-card__label">Total Paid</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📅</div>
          <div className="stat-card__value">{fees.filter(f => f.status === 'pending' || f.status === 'overdue').length}</div>
          <div className="stat-card__label">Pending Payments</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📊</div>
          <div className="stat-card__value">₹{(totalDue + totalPaid).toLocaleString('en-IN')}</div>
          <div className="stat-card__label">Total Fees</div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="glass-card section-card">
        <h3>📋 Fee Breakdown</h3>
        <table className="data-table">
          <thead>
            <tr><th>Fee Type</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {fees.map(fee => (
              <tr key={fee.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{fee.type}</td>
                <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>₹{Number(fee.amount).toLocaleString('en-IN')}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td><span className={`badge ${STATUS_BADGE[fee.status] || 'badge-blue'}`}>{fee.status}</span></td>
                <td>
                  {fee.status === 'paid'
                    ? <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>📥 Receipt</button>
                    : <button className="btn btn-primary" onClick={() => payFee(fee.id)} style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Pay Now</button>
                  }
                </td>
              </tr>
            ))}
            {fees.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No fee records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
