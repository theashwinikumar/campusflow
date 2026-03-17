import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../lib/utils';
import './Dashboard.css';

const STATS_STUDENT = [
  { label: 'Attendance', value: '87%', icon: '📋', color: 'blue', trend: '+2%' },
  { label: 'Pending Docs', value: '2', icon: '📄', color: 'amber', trend: '' },
  { label: 'Leave Balance', value: '12', icon: '🌿', color: 'green', trend: '-1' },
  { label: 'Upcoming Events', value: '5', icon: '🎉', color: 'purple', trend: '' },
  { label: 'Due Fees', value: '₹15,000', icon: '💰', color: 'red', trend: '' },
  { label: 'Library Books', value: '3', icon: '📚', color: 'cyan', trend: '' },
];

const STATS_FACULTY = [
  { label: 'Classes Today', value: '4', icon: '📊', color: 'blue', trend: '' },
  { label: 'Pending Approvals', value: '8', icon: '📄', color: 'amber', trend: '+3' },
  { label: 'Students', value: '142', icon: '🎓', color: 'green', trend: '' },
  { label: 'Events Created', value: '3', icon: '🎉', color: 'purple', trend: '' },
];

const RECENT_ACTIVITIES = [
  { text: 'Attendance marked for CS301 - Data Structures', time: '10 min ago', icon: '📋' },
  { text: 'Leave request approved by Dr. Mehta', time: '1 hour ago', icon: '✅' },
  { text: 'New event: Annual Tech Fest 2026', time: '2 hours ago', icon: '🎉' },
  { text: 'Document request: Bonafide Certificate', time: '3 hours ago', icon: '📄' },
  { text: 'Library book returned: Introduction to Algorithms', time: '5 hours ago', icon: '📚' },
  { text: 'Fee payment confirmed: Tuition Fee Q1', time: 'Yesterday', icon: '💰' },
];

const UPCOMING = [
  { title: 'Data Structures Lab', time: '2:00 PM', type: 'class', color: 'blue' },
  { title: 'Leave Approval Meeting', time: '3:30 PM', type: 'meeting', color: 'amber' },
  { title: 'Club Rehearsal', time: '5:00 PM', type: 'event', color: 'purple' },
  { title: 'Library Due: ML Textbook', time: 'Tomorrow', type: 'deadline', color: 'red' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const stats = user?.role === 'faculty' ? STATS_FACULTY : STATS_STUDENT;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's what's happening on your campus today</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="glass-card stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="stat-card__header">
              <span className="stat-card__icon">{stat.icon}</span>
              {stat.trend && <span className={`badge badge-${stat.color}`}>{stat.trend}</span>}
            </div>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="glass-card section-card dashboard-activity">
          <h3>⚡ Recent Activity</h3>
          <div className="activity-list">
            {RECENT_ACTIVITIES.map((a, i) => (
              <div className="activity-item" key={i}>
                <span className="activity-icon">{a.icon}</span>
                <div className="activity-content">
                  <p>{a.text}</p>
                  <span className="activity-time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="glass-card section-card dashboard-upcoming">
          <h3>📅 Upcoming</h3>
          <div className="upcoming-list">
            {UPCOMING.map((item, i) => (
              <div className="upcoming-item" key={i}>
                <div className={`upcoming-dot upcoming-dot--${item.color}`}></div>
                <div className="upcoming-content">
                  <p className="upcoming-title">{item.title}</p>
                  <span className="upcoming-time">{item.time}</span>
                </div>
                <span className={`badge badge-${item.color}`}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card section-card dashboard-actions">
          <h3>🚀 Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">📋 Mark Attendance</button>
            <button className="quick-action-btn">📄 Request Document</button>
            <button className="quick-action-btn">🌿 Apply Leave</button>
            <button className="quick-action-btn">✉️ Compose Mail</button>
            <button className="quick-action-btn">🎉 Browse Events</button>
            <button className="quick-action-btn">📚 Search Library</button>
          </div>
        </div>
      </div>
    </div>
  );
}
