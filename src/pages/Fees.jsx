const FEES = [
  { id: 1, type: 'Tuition Fee', amount: 45000, dueDate: '2026-03-31', status: 'pending' },
  { id: 2, type: 'Hostel Fee', amount: 25000, dueDate: '2026-03-31', status: 'pending' },
  { id: 3, type: 'Exam Fee', amount: 3000, dueDate: '2026-04-15', status: 'upcoming' },
  { id: 4, type: 'Library Fee', amount: 1500, dueDate: '2026-02-28', status: 'paid' },
  { id: 5, type: 'Lab Fee', amount: 5000, dueDate: '2026-01-31', status: 'paid' },
  { id: 6, type: 'Sports Fee', amount: 2000, dueDate: '2026-01-31', status: 'paid' },
];

const STATUS_BADGE = { paid: 'badge-green', pending: 'badge-amber', upcoming: 'badge-blue', overdue: 'badge-red' };

export default function Fees() {
  const totalDue = FEES.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0);
  const totalPaid = FEES.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);

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
          <div className="stat-card__value">{FEES.filter(f => f.status === 'pending').length}</div>
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
            {FEES.map(fee => (
              <tr key={fee.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{fee.type}</td>
                <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>₹{fee.amount.toLocaleString('en-IN')}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td><span className={`badge ${STATUS_BADGE[fee.status]}`}>{fee.status}</span></td>
                <td>
                  {fee.status === 'paid'
                    ? <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>📥 Receipt</button>
                    : <button className="btn btn-primary" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Pay Now</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
