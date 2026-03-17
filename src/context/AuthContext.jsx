import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Demo users for hackathon
const DEMO_USERS = {
  student: { id: '1', name: 'Arjun Sharma', email: 'arjun@campus.edu', role: 'student', department: 'Computer Science', year: '3rd Year', avatar: null },
  faculty: { id: '2', name: 'Dr. Priya Mehta', email: 'priya@campus.edu', role: 'faculty', department: 'Computer Science', avatar: null },
  admin: { id: '3', name: 'Admin User', email: 'admin@campus.edu', role: 'admin', department: 'Administration', avatar: null },
  warden: { id: '4', name: 'Mr. Rajesh Kumar', email: 'rajesh@campus.edu', role: 'warden', department: 'Hostel Management', avatar: null },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (role) => {
    setLoading(true);
    // Demo login — pick user by role
    await new Promise(r => setTimeout(r, 600));
    setUser(DEMO_USERS[role] || DEMO_USERS.student);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
