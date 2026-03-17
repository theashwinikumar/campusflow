import { createContext, useState, useContext, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        setUser({ ...data }); 
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginWithSupabase = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  const loginDemo = async (role) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setUser(DEMO_USERS[role] || DEMO_USERS.student);
    setLoading(false);
  };

  const login = async (roleOrEmail, password) => {
    if (IS_DEMO_MODE) {
      return loginDemo(roleOrEmail);
    } else {
      return loginWithSupabase(roleOrEmail, password);
    }
  };

  const logout = async () => {
    if (!IS_DEMO_MODE) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
