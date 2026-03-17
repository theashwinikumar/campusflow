import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const ROLES = [
  { key: 'student', label: 'Student', icon: '🎓', desc: 'Access attendance, documents, events & more' },
  { key: 'faculty', label: 'Faculty', icon: '👩‍🏫', desc: 'Manage classes, approve requests, post notices' },
  { key: 'admin', label: 'Admin', icon: '⚙️', desc: 'Full platform control & analytics' },
  { key: 'warden', label: 'Warden', icon: '🏠', desc: 'Hostel management & complaints' },
];

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = async () => {
    if (!selectedRole) return;
    await login(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="login-bg-shape login-bg-shape--1"></div>
        <div className="login-bg-shape login-bg-shape--2"></div>
        <div className="login-bg-shape login-bg-shape--3"></div>
      </div>

      <div className="login-card glass">
        <div className="login-header">
          <span className="login-logo">🎓</span>
          <h1>Campus<span className="gradient-text">Flow</span></h1>
          <p>Your unified college platform</p>
        </div>

        <div className="login-form">
          <div className="login-field">
            <label>Email</label>
            <input type="email" className="input-field" placeholder="you@campus.edu" />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>

          <div className="login-roles">
            <label>Select your role</label>
            <div className="login-roles-grid">
              {ROLES.map(r => (
                <button
                  key={r.key}
                  className={`login-role-card ${selectedRole === r.key ? 'login-role-card--active' : ''}`}
                  onClick={() => setSelectedRole(r.key)}
                >
                  <span className="login-role-icon">{r.icon}</span>
                  <span className="login-role-label">{r.label}</span>
                  <span className="login-role-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary login-submit"
            onClick={handleLogin}
            disabled={!selectedRole || loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login-demo-note">
            🔬 Demo Mode — select a role and click Sign In
          </p>
        </div>
      </div>
    </div>
  );
}
