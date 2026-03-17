import { useAuth } from '../context/AuthContext';
import { useExamsData } from '../hooks/useExamsData';

const GRADE_COLORS = { 'A+': 'green', 'A': 'green', 'B+': 'blue', 'B': 'blue', 'C+': 'amber', 'C': 'amber', 'D': 'red', 'F': 'red' };

// Helper to format time strings like "10:00:00" or "10:00 AM" uniformly
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  
  // Format HH:MM:SS to HH:MM AM/PM
  const [hourStart, min] = timeStr.split(':');
  let h = parseInt(hourStart, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${min} ${ampm}`;
};

export default function Exams() {
  const { user } = useAuth();
  const { schedule, results, sgpa, loading } = useExamsData(user);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading exams & results...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 Exams & Results</h1>
        <p>Exam schedules, results, and academic performance</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card"><div className="stat-card__icon">📊</div><div className="stat-card__value">{sgpa}</div><div className="stat-card__label">Current SGPA</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🎯</div><div className="stat-card__value">8.45</div><div className="stat-card__label">CGPA</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">📅</div><div className="stat-card__value">{schedule.length}</div><div className="stat-card__label">Upcoming Exams</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">🏆</div><div className="stat-card__value">12</div><div className="stat-card__label">Rank in Class</div></div>
      </div>

      {/* Upcoming Exams */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>📅 Upcoming Exams</h3>
        <table className="data-table">
          <thead><tr><th>Code</th><th>Subject</th><th>Date</th><th>Time</th><th>Venue</th><th>Type</th></tr></thead>
          <tbody>
            {schedule.map(ex => (
              <tr key={ex.id || ex.code}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{ex.code}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ex.subject}</td>
                <td>{new Date(ex.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                <td>{formatTime(ex.time)}</td>
                <td>{ex.venue}</td>
                <td><span className="badge badge-purple">{ex.type}</span></td>
              </tr>
            ))}
            {schedule.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No upcoming exams.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div className="glass-card section-card">
        <h3>📊 Semester Results</h3>
        <table className="data-table">
          <thead><tr><th>Code</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Credits</th></tr></thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.id || i}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{r.code}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.subject}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: 80 }}>
                      <div style={{ width: `${(r.marks / r.total) * 100}%`, height: '100%', borderRadius: 'var(--radius-full)', background: (r.marks/r.total) >= 0.8 ? 'var(--accent-green)' : (r.marks/r.total) >= 0.6 ? 'var(--accent-blue)' : 'var(--accent-amber)' }}></div>
                    </div>
                    <span>{r.marks}/{r.total}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${GRADE_COLORS[r.grade] || 'blue'}`}>{r.grade}</span></td>
                <td>{r.credits}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
