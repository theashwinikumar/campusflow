import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AppLayout.css';

export default function AppLayout() {
  // const { isAuthenticated, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)'
      }}>
        <div className="loader">Verifying session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <div className="app-layout__main">
        <Navbar onMenuToggle={() => setSidebarCollapsed(c => !c)} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
