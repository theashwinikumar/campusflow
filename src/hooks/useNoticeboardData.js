import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_NOTICES = [
  { id: 1, title: 'Mid-Semester Exam Schedule Released', body: 'The mid-semester examination schedule for all departments has been published. Please check the Exams section for detailed timetable.', category: 'academic', urgent: true, pinned: true, author: 'Examination Cell', date: '2026-03-17' },
  { id: 2, title: 'Campus WiFi Maintenance — March 20', body: 'Campus WiFi will be under maintenance from 10 PM to 6 AM on March 20. Please plan accordingly.', category: 'general', urgent: false, pinned: true, author: 'IT Department', date: '2026-03-16' },
  { id: 3, title: 'Tech Fest 2026 Registrations Open', body: 'Register for the Annual Tech Fest 2026! Over 20 events including hackathons, coding contests, and workshops. Last date: March 22.', category: 'events', urgent: false, pinned: false, author: 'Event Committee', date: '2026-03-15' },
  { id: 4, title: 'Library Hours Extended During Exams', body: 'The central library will remain open until 11 PM from April 10 to April 30 to support exam preparation.', category: 'academic', urgent: false, pinned: false, author: 'Library', date: '2026-03-14' },
  { id: 5, title: 'Anti-Ragging Awareness Week', body: 'Anti-ragging awareness sessions will be held from March 24-28. Attendance is mandatory for all first-year students.', category: 'general', urgent: true, pinned: false, author: 'Dean of Students', date: '2026-03-13' },
  { id: 6, title: 'Semester Fee Last Date: March 31', body: 'Students are reminded that the last date for paying semester fees without late charges is March 31, 2026.', category: 'finance', urgent: true, pinned: false, author: 'Accounts Department', date: '2026-03-12' },
];

export function useNoticeboardData() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setNotices(MOCK_NOTICES);
      setLoading(false);
      return;
    }

    const fetchNotices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notices')
          .select(`
            *,
            author:users!notices_author_id_fkey(name)
          `)
          .order('pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedNotices = (data || []).map(n => ({
          id: n.id,
          title: n.title,
          body: n.content,
          category: n.category,
          urgent: n.title.toLowerCase().includes('urgent') || n.title.toLowerCase().includes('last date'),
          pinned: n.is_pinned,
          author: n.author?.name || 'Admin',
          date: n.created_at
        }));

        setNotices(mappedNotices.length ? mappedNotices : MOCK_NOTICES);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
        setNotices(MOCK_NOTICES);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return { notices, loading };
}
