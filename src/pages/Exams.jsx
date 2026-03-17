const EXAM_SCHEDULE = [
  { subject: 'Data Structures', code: 'CS301', date: '2026-04-15', time: '10:00 AM', venue: 'Exam Hall A', type: 'Mid-Sem' },
  { subject: 'Operating Systems', code: 'CS302', date: '2026-04-17', time: '10:00 AM', venue: 'Exam Hall B', type: 'Mid-Sem' },
  { subject: 'Database Systems', code: 'CS303', date: '2026-04-19', time: '2:00 PM', venue: 'Exam Hall A', type: 'Mid-Sem' },
  { subject: 'Computer Networks', code: 'CS304', date: '2026-04-21', time: '10:00 AM', venue: 'Exam Hall C', type: 'Mid-Sem' },
  { subject: 'Discrete Mathematics', code: 'MA301', date: '2026-04-23', time: '2:00 PM', venue: 'Exam Hall B', type: 'Mid-Sem' },
];

const RESULTS = [
  { subject: 'Data Structures', code: 'CS301', marks: 88, total: 100, grade: 'A', credits: 4 },
  { subject: 'Operating Systems', code: 'CS302', marks: 76, total: 100, grade: 'B+', credits: 4 },
  { subject: 'Database Systems', code: 'CS303', marks: 92, total: 100, grade: 'A+', credits: 4 },
  { subject: 'Computer Networks', code: 'CS304', marks: 71, total: 100, grade: 'B', credits: 3 },
  { subject: 'Discrete Mathematics', code: 'MA301', marks: 85, total: 100, grade: 'A', credits: 3 },
  { subject: 'Software Engineering', code: 'CS305', marks: 79, total: 100, grade: 'B+', credits: 3 },
];

const GRADE_COLORS = { 'A+': 'green', 'A': 'green', 'B+': 'blue', 'B': 'blue', 'C+': 'amber', 'C': 'amber', 'D': 'red', 'F': 'red' };

export default function Exams() {
  const sgpa = (RESULTS.reduce((a, r) => a + (r.marks / r.total * 10) * r.credits, 0) / RESULTS.reduce((a, r) => a + r.credits, 0)).toFixed(2);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 Exams & Results</h1>
        <p>Exam schedules, results, and academic performance</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card"><div className="stat-card__icon">📊</div><div className="stat-card__value">{sgpa}</div><div className="stat-card__label">Current SGPA</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🎯</div><div className="stat-card__value">8.45</div><div className="stat-card__label">CGPA</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">📅</div><div className="stat-card__value">{EXAM_SCHEDULE.length}</div><div className="stat-card__label">Upcoming Exams</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🏆</div><div className="stat-card__value">12</div><div className="stat-card__label">Rank in Class</div></div>
      </div>

      {/* Upcoming Exams */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>📅 Upcoming Exams — Mid Semester</h3>
        <table className="data-table">
          <thead><tr><th>Code</th><th>Subject</th><th>Date</th><th>Time</th><th>Venue</th><th>Type</th></tr></thead>
          <tbody>
            {EXAM_SCHEDULE.map(ex => (
              <tr key={ex.code}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{ex.code}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ex.subject}</td>
                <td>{new Date(ex.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                <td>{ex.time}</td>
                <td>{ex.venue}</td>
                <td><span className="badge badge-purple">{ex.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div className="glass-card section-card">
        <h3>📊 Last Semester Results</h3>
        <table className="data-table">
          <thead><tr><th>Code</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Credits</th></tr></thead>
          <tbody>
            {RESULTS.map(r => (
              <tr key={r.code}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{r.code}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.subject}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: 80 }}>
                      <div style={{ width: `${r.marks}%`, height: '100%', borderRadius: 'var(--radius-full)', background: r.marks >= 80 ? 'var(--accent-green)' : r.marks >= 60 ? 'var(--accent-blue)' : 'var(--accent-amber)' }}></div>
                    </div>
                    <span>{r.marks}/{r.total}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${GRADE_COLORS[r.grade] || 'blue'}`}>{r.grade}</span></td>
                <td>{r.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
