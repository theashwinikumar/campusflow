import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = [
  { code: 'CS301', name: 'Data Structures', total: 40, present: 36, faculty: 'Dr. Priya Mehta' },
  { code: 'CS302', name: 'Operating Systems', total: 38, present: 30, faculty: 'Dr. Amit Verma' },
  { code: 'CS303', name: 'Database Systems', total: 42, present: 38, faculty: 'Dr. Neha Gupta' },
  { code: 'CS304', name: 'Computer Networks', total: 35, present: 28, faculty: 'Dr. Ravi Kumar' },
  { code: 'MA301', name: 'Discrete Mathematics', total: 40, present: 37, faculty: 'Dr. Sanjay Joshi' },
  { code: 'CS305', name: 'Software Engineering', total: 30, present: 27, faculty: 'Prof. Anita Roy' },
];

const STUDENTS_LIST = [
  { id: 1, name: 'Arjun Sharma', rollNo: 'CS2023001', status: 'present' },
  { id: 2, name: 'Sneha Patel', rollNo: 'CS2023002', status: 'present' },
  { id: 3, name: 'Rohan Gupta', rollNo: 'CS2023003', status: 'absent' },
  { id: 4, name: 'Priya Singh', rollNo: 'CS2023004', status: 'present' },
  { id: 5, name: 'Vikram Rao', rollNo: 'CS2023005', status: 'present' },
  { id: 6, name: 'Ananya Das', rollNo: 'CS2023006', status: 'absent' },
  { id: 7, name: 'Karthik Nair', rollNo: 'CS2023007', status: 'present' },
  { id: 8, name: 'Divya Menon', rollNo: 'CS2023008', status: 'present' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS = [
  [1,1,1,1,1,0], [1,1,0,1,1,0], [1,1,1,1,0,0], [1,0,1,1,1,1],
  [1,1,1,0,1,0], [0,1,1,1,1,0], [1,1,1,1,1,0], [1,1,0,1,1,1],
];

export default function Attendance() {
  const { user } = useAuth();
  const [students, setStudents] = useState(STUDENTS_LIST);
  const isFaculty = user?.role === 'faculty' || user?.role === 'admin';

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const overallPct = Math.round(SUBJECTS.reduce((a, s) => a + (s.present / s.total), 0) / SUBJECTS.length * 100);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Attendance</h1>
        <p>{isFaculty ? 'Mark and manage student attendance' : 'View your attendance records'}</p>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📊</div>
          <div className="stat-card__value">{overallPct}%</div>
          <div className="stat-card__label">Overall Attendance</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📅</div>
          <div className="stat-card__value">{SUBJECTS.reduce((a, s) => a + s.total, 0)}</div>
          <div className="stat-card__label">Total Classes</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__value">{SUBJECTS.reduce((a, s) => a + s.present, 0)}</div>
          <div className="stat-card__label">Classes Attended</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">⚠️</div>
          <div className="stat-card__value">{SUBJECTS.filter(s => (s.present / s.total) < 0.75).length}</div>
          <div className="stat-card__label">Subjects Below 75%</div>
        </div>
      </div>

      {/* Subject-wise Breakdown */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>📚 Subject-wise Breakdown</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Attended</th>
              <th>Total</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {SUBJECTS.map(s => {
              const pct = Math.round((s.present / s.total) * 100);
              return (
                <tr key={s.code}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{s.code}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                  <td>{s.faculty}</td>
                  <td>{s.present}</td>
                  <td>{s.total}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        flex: 1, height: 6, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)',
                        overflow: 'hidden', maxWidth: 100
                      }}>
                        <div style={{
                          width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-full)',
                          background: pct >= 75 ? 'var(--accent-green)' : 'var(--accent-red)'
                        }}></div>
                      </div>
                      <span className={`badge ${pct >= 75 ? 'badge-green' : 'badge-red'}`}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Heatmap */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>🗓️ Attendance Heatmap (Last 8 Weeks)</h3>
        <div style={{ display: 'flex', gap: '4px', marginTop: 'var(--space-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: '8px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ height: 24, display: 'flex', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{d}</div>
            ))}
          </div>
          {WEEKS.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((v, di) => (
                <div key={di} style={{
                  width: 24, height: 24, borderRadius: 'var(--radius-sm)',
                  background: v ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.3)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }} title={`Week ${wi + 1}, ${DAYS[di]}: ${v ? 'Present' : 'Absent'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Faculty: Mark Attendance */}
      {isFaculty && (
        <div className="glass-card section-card">
          <h3>✏️ Mark Attendance — CS301 Data Structures</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)' }}>
            Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <table className="data-table">
            <thead>
              <tr><th>Roll No</th><th>Name</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{s.rollNo}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                  <td>
                    <span className={`badge ${s.status === 'present' ? 'badge-green' : 'badge-red'}`}>
                      {s.status === 'present' ? '✓ Present' : '✗ Absent'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" onClick={() => toggleStatus(s.id)}
                      style={{ fontSize: 'var(--text-xs)' }}>
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary">Submit Attendance</button>
            <button className="btn btn-secondary">Mark All Present</button>
          </div>
        </div>
      )}
    </div>
  );
}
