import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_FEES = [
  { id: 1, type: 'Tuition Fee', amount: 45000, dueDate: '2026-03-31', status: 'pending' },
  { id: 2, type: 'Hostel Fee', amount: 25000, dueDate: '2026-03-31', status: 'pending' },
  { id: 3, type: 'Exam Fee', amount: 3000, dueDate: '2026-04-15', status: 'upcoming' },
  { id: 4, type: 'Library Fee', amount: 1500, dueDate: '2026-02-28', status: 'paid' },
  { id: 5, type: 'Lab Fee', amount: 5000, dueDate: '2026-01-31', status: 'paid' },
  { id: 6, type: 'Sports Fee', amount: 2000, dueDate: '2026-01-31', status: 'paid' },
];

export function useFeesData(user) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setFees(MOCK_FEES);
      setLoading(false);
      return;
    }

    const fetchFees = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('fees')
          .select('*')
          .eq('student_id', user.id)
          .order('due_date', { ascending: true });

        if (error) throw error;

        const today = new Date();
        const mappedFees = (data || []).map(f => {
          let status = f.paid ? 'paid' : 'pending';
          if (!f.paid) {
            const dueDate = new Date(f.due_date);
            if (dueDate < today) status = 'overdue';
            else if (dueDate > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) status = 'upcoming'; // More than 30 days away
          }
          return {
            id: f.id,
            type: f.type,
            amount: f.amount,
            dueDate: f.due_date,
            status: status
          };
        });

        setFees(mappedFees.length ? mappedFees : MOCK_FEES);
      } catch (err) {
        console.error('Failed to fetch fees:', err);
        setFees(MOCK_FEES);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [user]);

  // Handle mock payment action
  const payFee = async (feeId) => {
    if (IS_DEMO_MODE) {
      setFees(fees.map(f => f.id === feeId ? { ...f, status: 'paid' } : f));
      return;
    }

    try {
      setFees(fees.map(f => f.id === feeId ? { ...f, status: 'paid' } : f));
      await supabase.from('fees').update({ paid: true }).eq('id', feeId);
    } catch (err) {
      console.error('Failed to pay fee:', err);
    }
  };

  return { fees, payFee, loading };
}
