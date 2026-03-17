import { useAuth } from '../context/AuthContext';
import { useTimetableData } from '../hooks/useTimetableData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOTS = ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 1:00', '2:00 - 3:00', '3:00 - 4:00', '4:00 - 5:00'];

const SUBJECT_COLORS = {
  'CS301': 'rgba(59, 130, 246, 0.15)',
  'CS302': 'rgba(139, 92, 246, 0.15)',
  'CS303': 'rgba(6, 182, 212, 0.15)',
  'CS304': 'rgba(34, 197, 94, 0.15)',
  'CS305': 'rgba(236, 72, 153, 0.15)',
  'MA301': 'rgba(245, 158, 11, 0.15)',
};

function getSubjectBg(cell) {
  const code = Object.keys(SUBJECT_COLORS).find(k => cell.includes(k));
  return code ? SUBJECT_COLORS[code] : 'transparent';
}

export default function Timetable() {
  const { user } = useAuth();
  const { timetable, loading } = useTimetableData(user);
  
  const today = DAYS[new Date().getDay() - 1] || 'Monday';

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading timetable...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🕐 Timetable</h1>
        <p>Your weekly class schedule — {user?.year || '3rd Year'}, {user?.department || 'CS'} Section {user?.section || 'A'}</p>
      </div>

      <div className="glass-card section-card" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ width: 120 }}>Time</th>
              {DAYS.map(d => (
                <th key={d} style={{ background: d === today ? 'rgba(59,130,246,0.08)' : 'transparent' }}>
                  {d} {d === today && '📍'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, si) => (
              <tr key={si}>
                <td style={{ fontWeight: 500, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{slot}</td>
                {DAYS.map(day => {
                  const cell = timetable[day][si] || '— Free —';
                  const isLunch = cell.includes('Lunch');
                  const isFree = cell.includes('Free');
                  return (
                    <td key={day} style={{
                      background: day === today ? 'rgba(59,130,246,0.04)' : getSubjectBg(cell),
                      color: isLunch ? 'var(--text-muted)' : isFree ? 'var(--text-muted)' : 'var(--text-primary)',
                      fontWeight: isLunch || isFree ? 400 : 500,
                      fontSize: 'var(--text-sm)',
                      textAlign: 'center',
                      fontStyle: isLunch ? 'italic' : 'normal'
                    }}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
        {Object.entries(SUBJECT_COLORS).map(([code, color]) => (
          <span key={code} style={{ padding: '4px 10px', background: color, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {code}
          </span>
        ))}
      </div>
    </div>
  );
}
