import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

// Mock data mapping
const MOCK_STATS = {
  student: [
    { label: 'Attendance', value: '87%', icon: '📋', color: 'blue', trend: '+2%' },
    { label: 'Pending Docs', value: '2', icon: '📄', color: 'amber', trend: '' },
    { label: 'Leave Balance', value: '12', icon: '🌿', color: 'green', trend: '-1' },
    { label: 'Upcoming Events', value: '5', icon: '🎉', color: 'purple', trend: '' },
    { label: 'Due Fees', value: '₹15,000', icon: '💰', color: 'red', trend: '' },
    { label: 'Library Books', value: '3', icon: '📚', color: 'cyan', trend: '' },
  ],
  faculty: [
    { label: 'Classes Today', value: '4', icon: '📊', color: 'blue', trend: '' },
    { label: 'Pending Approvals', value: '8', icon: '📄', color: 'amber', trend: '+3' },
    { label: 'Students', value: '142', icon: '🎓', color: 'green', trend: '' },
    { label: 'Events Created', value: '3', icon: '🎉', color: 'purple', trend: '' },
  ]
};

const MOCK_ACTIVITIES = [
  { text: 'Attendance marked for CS301 - Data Structures', time: '10 min ago', icon: '📋' },
  { text: 'Leave request approved by Dr. Mehta', time: '1 hour ago', icon: '✅' },
  { text: 'New event: Annual Tech Fest 2026', time: '2 hours ago', icon: '🎉' },
  { text: 'Document request: Bonafide Certificate', time: '3 hours ago', icon: '📄' },
];

const MOCK_UPCOMING = [
  { title: 'Data Structures Lab', time: '2:00 PM', type: 'class', color: 'blue' },
  { title: 'Leave Approval Meeting', time: '3:30 PM', type: 'meeting', color: 'amber' },
  { title: 'Club Rehearsal', time: '5:00 PM', type: 'event', color: 'purple' },
];

export function useDashboardData(user) {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setStats(user.role === 'faculty' ? MOCK_STATS.faculty : MOCK_STATS.student);
      setActivities(MOCK_ACTIVITIES);
      setUpcoming(MOCK_UPCOMING);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (user.role === 'student') {
          // Fetch real data from DB
          const [
            { count: docsCount }, 
            { count: eventsCount },
            { data: attendance },
            { data: leave }
          ] = await Promise.all([
            supabase.from('documents').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'pending'),
            supabase.from('events').select('*', { count: 'exact', head: true }).gte('date', new Date().toISOString().split('T')[0]),
            supabase.from('attendance').select('status').eq('student_id', user.id),
            supabase.from('leave_requests').select('status').eq('user_id', user.id)
          ]);

          const totalAttendance = attendance?.length || 1;
          const present = attendance?.filter(a => a.status === 'present').length || 0;
          const attPerc = Math.round((present / totalAttendance) * 100) || 100;

          setStats([
            { label: 'Attendance', value: `${attPerc}%`, icon: '📋', color: 'blue', trend: '' },
            { label: 'Pending Docs', value: (docsCount || 0).toString(), icon: '📄', color: 'amber', trend: '' },
            { label: 'Leave Balance', value: (15 - (leave?.length || 0)).toString(), icon: '🌿', color: 'green', trend: '' },
            { label: 'Upcoming Events', value: (eventsCount || 0).toString(), icon: '🎉', color: 'purple', trend: '' },
            { label: 'Due Fees', value: '₹0', icon: '💰', color: 'red', trend: '' },
            { label: 'Library Books', value: '0', icon: '📚', color: 'cyan', trend: '' },
          ]);

          // Dummy activities and upcoming for now when not demo (ideally fetched as well)
          setActivities(MOCK_ACTIVITIES);
          setUpcoming(MOCK_UPCOMING);

        } else if (user.role === 'faculty') {
          const [
            { count: pendingLeaves },
            { count: eventsCount }
          ] = await Promise.all([
            supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('approver_id', user.id).eq('status', 'pending'),
            supabase.from('events').select('*', { count: 'exact', head: true }).eq('created_by', user.id)
          ]);

          setStats([
            { label: 'Classes Today', value: '4', icon: '📊', color: 'blue', trend: '' },
            { label: 'Pending Approvals', value: (pendingLeaves || 0).toString(), icon: '📄', color: 'amber', trend: '' },
            { label: 'Students', value: '142', icon: '🎓', color: 'green', trend: '' },
            { label: 'Events Created', value: (eventsCount || 0).toString(), icon: '🎉', color: 'purple', trend: '' },
          ]);
          setActivities(MOCK_ACTIVITIES);
          setUpcoming(MOCK_UPCOMING);
        } else {
          setStats(MOCK_STATS.student);
          setActivities(MOCK_ACTIVITIES);
          setUpcoming(MOCK_UPCOMING);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { stats, activities, upcoming, loading };
}
