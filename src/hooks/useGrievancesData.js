import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_GRIEVANCES = [
  { id: 1, subject: 'WiFi issue in Block C', category: 'infrastructure', status: 'open', date: '2026-03-16', anonymous: false },
  { id: 2, subject: 'Canteen food quality', category: 'hostel', status: 'in-progress', date: '2026-03-14', anonymous: true },
  { id: 3, subject: 'Lab computers not updated', category: 'academic', status: 'resolved', date: '2026-03-10', anonymous: false },
  { id: 4, subject: 'Harassment incident report', category: 'ragging', status: 'in-progress', date: '2026-03-12', anonymous: true },
  { id: 5, subject: 'Broken chairs in Room 201', category: 'infrastructure', status: 'open', date: '2026-03-15', anonymous: false },
];

export function useGrievancesData(user) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setGrievances(MOCK_GRIEVANCES);
      setLoading(false);
      return;
    }

    const fetchGrievances = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('grievances')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedData = (data || []).map(g => ({
          id: g.id,
          subject: g.subject,
          category: g.category,
          status: g.status,
          date: g.created_at,
          anonymous: g.is_anonymous
        }));

        setGrievances(mappedData.length ? mappedData : MOCK_GRIEVANCES);
      } catch (err) {
        console.error('Failed to fetch grievances:', err);
        setGrievances(MOCK_GRIEVANCES);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [user]);

  const submitGrievance = async (formData) => {
    const newGrievance = {
      id: Date.now(),
      subject: formData.subject,
      category: formData.category.toLowerCase(),
      status: 'open',
      date: new Date().toISOString(),
      anonymous: formData.anonymous
    };

    if (IS_DEMO_MODE) {
      setGrievances([newGrievance, ...grievances]);
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('grievances')
        .insert([{
          student_id: formData.anonymous ? null : user.id,
          subject: formData.subject,
          description: formData.description,
          category: formData.category.toLowerCase(),
          is_anonymous: formData.anonymous
        }])
        .select()
        .single();

      if (error) throw error;

      setGrievances([{
        id: data.id,
        subject: data.subject,
        category: data.category,
        status: data.status,
        date: data.created_at,
        anonymous: data.is_anonymous
      }, ...grievances]);

      return { success: true };
    } catch (err) {
      console.error('Failed to submit grievance:', err);
      return { success: false, error: err.message };
    }
  };

  return { grievances, submitGrievance, loading };
}
