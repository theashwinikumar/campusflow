const ROOMS = [
  { room: 'A-101', block: 'A', floor: 1, capacity: 3, occupants: ['Arjun S.', 'Rohan G.', 'Vikram R.'], status: 'full' },
  { room: 'A-102', block: 'A', floor: 1, capacity: 3, occupants: ['Sneha P.', 'Priya S.'], status: 'available' },
  { room: 'B-201', block: 'B', floor: 2, capacity: 2, occupants: ['Karthik N.', 'Anil K.'], status: 'full' },
  { room: 'B-202', block: 'B', floor: 2, capacity: 2, occupants: ['Divya M.'], status: 'available' },
  { room: 'C-301', block: 'C', floor: 3, capacity: 4, occupants: ['Rahul V.', 'Ankit M.', 'Suresh D.', 'Nitin P.'], status: 'full' },
  { room: 'C-302', block: 'C', floor: 3, capacity: 4, occupants: ['Meena T.', 'Kavita R.'], status: 'available' },
];

const COMPLAINTS = [
  { id: 1, room: 'A-101', issue: 'Water leakage in bathroom', priority: 'high', status: 'open', date: '2026-03-15' },
  { id: 2, room: 'B-201', issue: 'Fan not working', priority: 'medium', status: 'in-progress', date: '2026-03-14' },
  { id: 3, room: 'C-301', issue: 'Window broken', priority: 'high', status: 'resolved', date: '2026-03-10' },
  { id: 4, room: 'A-102', issue: 'WiFi connectivity issues', priority: 'low', status: 'open', date: '2026-03-16' },
];

const PRIORITY_BADGE = { high: 'badge-red', medium: 'badge-amber', low: 'badge-blue' };
const STATUS_BADGE = { open: 'badge-red', 'in-progress': 'badge-amber', resolved: 'badge-green' };

export default function Hostel() {
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
          <div className="stat-card__value">{ROOMS.length}</div>
          <div className="stat-card__label">Total Rooms</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🟢</div>
          <div className="stat-card__value">{ROOMS.filter(r => r.status === 'available').length}</div>
          <div className="stat-card__label">Available</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🔴</div>
          <div className="stat-card__value">{ROOMS.filter(r => r.status === 'full').length}</div>
          <div className="stat-card__label">Full</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🛠️</div>
          <div className="stat-card__value">{COMPLAINTS.filter(c => c.status !== 'resolved').length}</div>
          <div className="stat-card__label">Open Complaints</div>
        </div>
      </div>

      {/* Room Allocation */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>🛏️ Room Allocation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
          {ROOMS.map(r => (
            <div key={r.room} className="glass-card" style={{ padding: 'var(--space-md)' }}>
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
                {r.occupants.map(o => (
                  <span key={o} className="badge badge-blue">{o}</span>
                ))}
                {Array.from({ length: r.capacity - r.occupants.length }).map((_, i) => (
                  <span key={i} className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px dashed var(--border-subtle)' }}>Empty</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complaints */}
      <div className="glass-card section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h3>🛠️ Maintenance Complaints</h3>
          <button className="btn btn-primary" style={{ fontSize: 'var(--text-sm)' }}>+ New Complaint</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Room</th><th>Issue</th><th>Priority</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {COMPLAINTS.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.room}</td>
                <td>{c.issue}</td>
                <td><span className={`badge ${PRIORITY_BADGE[c.priority]}`}>{c.priority}</span></td>
                <td><span className={`badge ${STATUS_BADGE[c.status]}`}>{c.status}</span></td>
                <td>{new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
