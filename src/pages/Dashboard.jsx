import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../lib/utils';
import { useDashboardData } from '../hooks/useDashboardData';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, activities, upcoming, loading } = useDashboardData(user);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
        <p>Here's what's happening on your campus today</p>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading your dashboard...</div>
      ) : (
        <>
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
                {activities.map((a, i) => (
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
                {upcoming.map((item, i) => (
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
        </>
      )}
    </div>
  );
}
