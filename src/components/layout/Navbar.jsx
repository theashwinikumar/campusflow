import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../lib/utils';
import './Navbar.css';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuToggle} aria-label="Menu">
          ☰
        </button>
        <div className="navbar__greeting">
          <span className="navbar__greeting-text">{getGreeting()},</span>
          <span className="navbar__greeting-name">{user?.name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>
      <div className="navbar__right">
        <button className="navbar__icon-btn" title="Notifications">
          🔔
          <span className="navbar__badge">3</span>
        </button>
        <button className="navbar__icon-btn" title="Search">
          🔍
        </button>
        <div className="navbar__avatar">
          {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
        </div>
      </div>
    </header>
  );
}
