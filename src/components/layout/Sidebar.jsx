import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['student', 'faculty', 'admin', 'warden'] },
  { path: '/attendance', label: 'Attendance', icon: '📋', roles: ['student', 'faculty', 'admin'] },
  { path: '/documents', label: 'Documents', icon: '📄', roles: ['student', 'faculty', 'admin'] },
  { path: '/leave', label: 'Leave', icon: '🌿', roles: ['student', 'faculty', 'admin'] },
  { path: '/hostel', label: 'Hostel', icon: '🏠', roles: ['student', 'admin', 'warden'] },
  { path: '/events', label: 'Events', icon: '🎉', roles: ['student', 'faculty', 'admin'] },
  { path: '/clubs', label: 'Clubs', icon: '🎭', roles: ['student', 'faculty', 'admin'] },
  { path: '/mail', label: 'Mail', icon: '✉️', roles: ['student', 'faculty', 'admin', 'warden'] },
  { path: '/fees', label: 'Fees', icon: '💰', roles: ['student', 'admin'] },
  { path: '/library', label: 'Library', icon: '📚', roles: ['student', 'faculty', 'admin'] },
  { path: '/timetable', label: 'Timetable', icon: '🕐', roles: ['student', 'faculty', 'admin'] },
  { path: '/exams', label: 'Exams', icon: '📝', roles: ['student', 'faculty', 'admin'] },
  { path: '/noticeboard', label: 'Noticeboard', icon: '📢', roles: ['student', 'faculty', 'admin', 'warden'] },
  { path: '/grievances', label: 'Grievances', icon: '🛡️', roles: ['student', 'faculty', 'admin', 'warden'] },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || 'student';

  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">🎓</span>
          {!collapsed && <span className="sidebar__logo-text">Campus<span className="gradient-text">Flow</span></span>}
        </div>
        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {filteredItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            title={item.label}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {!collapsed && user && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user.name.split(' ').map(n => n[0]).join('')}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user.name}</div>
              <div className="sidebar__user-role">{user.role}</div>
            </div>
          </div>
        )}
        <button className="sidebar__logout" onClick={logout} title="Logout">
          {collapsed ? '🚪' : '🚪 Logout'}
        </button>
      </div>
    </aside>
  );
}
