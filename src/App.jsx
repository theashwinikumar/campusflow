import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Documents from './pages/Documents';
import Leave from './pages/Leave';
import Hostel from './pages/Hostel';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import Mail from './pages/Mail';
import Fees from './pages/Fees';
import Library from './pages/Library';
import Timetable from './pages/Timetable';
import Exams from './pages/Exams';
import Noticeboard from './pages/Noticeboard';
import Grievances from './pages/Grievances';
import Notes from './pages/Notes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — wrapped in AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/hostel" element={<Hostel />} />
            <Route path="/events" element={<Events />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/mail" element={<Mail />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/library" element={<Library />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/noticeboard" element={<Noticeboard />} />
            <Route path="/grievances" element={<Grievances />} />
            <Route path="/notes" element={<Notes />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
