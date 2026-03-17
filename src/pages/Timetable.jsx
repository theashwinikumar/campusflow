const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOTS = ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 1:00', '2:00 - 3:00', '3:00 - 4:00', '4:00 - 5:00'];

const TIMETABLE = {
  Monday:    ['CS301 - DS', 'CS302 - OS', 'MA301 - DM', '— Lunch —', 'CS303 - DBMS', 'CS304 - CN Lab', 'CS304 - CN Lab'],
  Tuesday:   ['CS303 - DBMS', 'CS301 - DS', 'CS305 - SE', '— Lunch —', 'MA301 - DM', 'CS302 - OS Lab', 'CS302 - OS Lab'],
  Wednesday: ['MA301 - DM', 'CS304 - CN', 'CS301 - DS', '— Lunch —', 'CS305 - SE', 'CS301 - DS Lab', 'CS301 - DS Lab'],
  Thursday:  ['CS302 - OS', 'CS303 - DBMS', 'CS304 - CN', '— Lunch —', 'CS301 - DS', 'CS305 - SE Lab', 'CS305 - SE Lab'],
  Friday:    ['CS305 - SE', 'MA301 - DM', 'CS302 - OS', '— Lunch —', 'CS303 - DBMS Lab', 'CS303 - DBMS Lab', '— Free —'],
  Saturday:  ['CS304 - CN', 'MA301 - DM', '— Free —', '— Lunch —', '— Free —', '— Free —', '— Free —'],
};

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
  const today = DAYS[new Date().getDay() - 1] || 'Monday';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🕐 Timetable</h1>
        <p>Your weekly class schedule — 3rd Year, CS Section A</p>
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
                  const cell = TIMETABLE[day][si];
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
