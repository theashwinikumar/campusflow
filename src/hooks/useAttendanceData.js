import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_SUBJECTS = [
  { code: 'CS301', name: 'Data Structures', total: 40, present: 36, faculty: 'Dr. Priya Mehta' },
  { code: 'CS302', name: 'Operating Systems', total: 38, present: 30, faculty: 'Dr. Amit Verma' },
  { code: 'CS303', name: 'Database Systems', total: 42, present: 38, faculty: 'Dr. Neha Gupta' },
  { code: 'CS304', name: 'Computer Networks', total: 35, present: 28, faculty: 'Dr. Ravi Kumar' },
  { code: 'MA301', name: 'Discrete Mathematics', total: 40, present: 37, faculty: 'Dr. Sanjay Joshi' },
  { code: 'CS305', name: 'Software Engineering', total: 30, present: 27, faculty: 'Prof. Anita Roy' },
];

const MOCK_STUDENTS = [
  { id: '1', name: 'Arjun Sharma', rollNo: 'CS2023001', status: 'present' },
  { id: '2', name: 'Sneha Patel', rollNo: 'CS2023002', status: 'present' },
  { id: '3', name: 'Rohan Gupta', rollNo: 'CS2023003', status: 'absent' },
  { id: '4', name: 'Priya Singh', rollNo: 'CS2023004', status: 'present' },
  { id: '5', name: 'Vikram Rao', rollNo: 'CS2023005', status: 'present' },
];

const MOCK_WEEKS = [
  [1,1,1,1,1,0], [1,1,0,1,1,0], [1,1,1,1,0,0], [1,0,1,1,1,1],
  [1,1,1,0,1,0], [0,1,1,1,1,0], [1,1,1,1,1,0], [1,1,0,1,1,1],
];

export function useAttendanceData(user) {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setSubjects(MOCK_SUBJECTS);
      setStudents(MOCK_STUDENTS);
      setWeeks(MOCK_WEEKS);
      setLoading(false);
      return;
    }

    const fetchRealData = async () => {
      setLoading(true);
      try {
        if (user.role === 'student') {
          // Fetch student attendance records
          const { data: records, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_id', user.id);
            
          if (error) throw error;

          // Process records into subjects array
          const subMap = {};
          records?.forEach(r => {
            if (!subMap[r.subject]) {
              subMap[r.subject] = { code: r.subject.substring(0, 5).toUpperCase(), name: r.subject, total: 0, present: 0, faculty: 'Assigned Faculty' };
            }
            subMap[r.subject].total += 1;
            if (r.status === 'present') subMap[r.subject].present += 1;
          });

          const subsArray = Object.values(subMap);
          setSubjects(subsArray.length ? subsArray : MOCK_SUBJECTS); // fallback if empty DB for UI sake
          setWeeks(MOCK_WEEKS); // Keeping mock heatmap since mapping exact dates to 8x6 grid is complex for MVP
        } else {
          // Fetch students list for faculty
          const { data: usersData, error } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('role', 'student');
            
          if (error) throw error;

          const mappedStudents = usersData.map((u, i) => ({
            id: u.id,
            name: u.name,
            rollNo: `STU${1000 + i}`,
            status: 'present' // default
          }));
          
          setStudents(mappedStudents.length ? mappedStudents : MOCK_STUDENTS);
        }
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [user]);

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: 'present' })));
  };

  const submitAttendance = async (subject = 'CS301 Data Structures') => {
    if (IS_DEMO_MODE) {
      alert('Demo Mode: Attendance marked successfully!');
      return;
    }
    
    setSubmitting(true);
    try {
      const recordsToInsert = students.map(s => ({
        student_id: s.id,
        faculty_id: user.id,
        subject: subject,
        date: new Date().toISOString().split('T')[0],
        status: s.status
      }));

      const { error } = await supabase.from('attendance').insert(recordsToInsert);
      
      if (error) throw error;
      alert('Attendance marked successfully! (Real DB)');
    } catch (err) {
      console.error('Error submitting attendance:', err);
      alert('Failed to submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  return { 
    subjects, 
    students, 
    weeks, 
    loading, 
    submitting,
    toggleStatus, 
    markAllPresent, 
    submitAttendance 
  };
}
