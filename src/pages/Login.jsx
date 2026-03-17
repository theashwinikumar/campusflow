import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IS_DEMO_MODE } from '../lib/supabase';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    
    try {
      if (IS_DEMO_MODE) {
        if (!selectedRole) return;
        await login(selectedRole);
      } else {
        if (!email || !password) {
          setError('Email and password are required');
          return;
        }
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
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
          {error && <div className="login-error" style={{color: '#ef4444', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%'}}>
            <div className="login-field">
              <label>Email</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="you@campus.edu" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {IS_DEMO_MODE && (
              <div className="login-roles">
                <label>Select your role</label>
                <div className="login-roles-grid">
                  {ROLES.map(r => (
                    <button
                      type="button"
                      key={r.key}
                      className={`login-role-card ${selectedRole === r.key ? 'login-role-card--active' : ''}`}
                      onClick={() => { setSelectedRole(r.key); setEmail(r.key + '@campus.edu'); setPassword('demo'); }}
                    >
                      <span className="login-role-icon">{r.icon}</span>
                      <span className="login-role-label">{r.label}</span>
                      <span className="login-role-desc">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={(IS_DEMO_MODE && !selectedRole) || loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {IS_DEMO_MODE && (
            <p className="login-demo-note">
              🔬 Demo Mode — select a role and click Sign In
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
