import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_LEAVE_REQUESTS = [
  { id: 1, type: 'Casual', from: '2026-03-20', to: '2026-03-21', reason: 'Family function', status: 'approved', approver: 'Dr. Priya Mehta' },
  { id: 2, type: 'Medical', from: '2026-03-18', to: '2026-03-19', reason: 'Doctor appointment', status: 'pending', approver: 'Dr. Amit Verma' },
  { id: 3, type: 'Academic', from: '2026-03-25', to: '2026-03-26', reason: 'Conference at IIT Delhi', status: 'pending', approver: 'Dr. Priya Mehta' },
  { id: 4, type: 'Casual', from: '2026-03-01', to: '2026-03-01', reason: 'Personal work', status: 'rejected', approver: 'Dr. Neha Gupta' },
];

const MOCK_LEAVE_BALANCE = [
  { type: 'Casual', total: 12, used: 3, color: 'blue' },
  { type: 'Medical', total: 10, used: 1, color: 'green' },
  { type: 'Academic', total: 5, used: 0, color: 'purple' },
];

export function useLeaveData(user) {
  const [requests, setRequests] = useState([]);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setRequests(MOCK_LEAVE_REQUESTS);
      setBalance(MOCK_LEAVE_BALANCE);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leave_requests')
          .select(`
            *,
            approver:users!leave_requests_approver_id_fkey(name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        let casualUsed = 0;
        let medicalUsed = 0;
        let academicUsed = 0;

        const mappedReqs = (data || []).map(r => {
          if (r.status === 'approved') {
            const days = Math.max(1, Math.ceil((new Date(r.end_date) - new Date(r.start_date)) / (1000 * 60 * 60 * 24)));
            if (r.type === 'casual') casualUsed += days;
            if (r.type === 'medical') medicalUsed += days;
            if (r.type === 'academic') academicUsed += days;
          }

          return {
            id: r.id,
            type: r.type.charAt(0).toUpperCase() + r.type.slice(1),
            from: r.start_date,
            to: r.end_date,
            reason: r.reason,
            status: r.status,
            approver: r.approver?.name || 'Pending Assignment'
          };
        });

        setRequests(mappedReqs.length ? mappedReqs : []);
        setBalance([
          { type: 'Casual', total: 12, used: casualUsed, color: 'blue' },
          { type: 'Medical', total: 10, used: medicalUsed, color: 'green' },
          { type: 'Academic', total: 5, used: academicUsed, color: 'purple' },
        ]);
      } catch (err) {
        console.error('Failed to fetch leave data:', err);
        setRequests(MOCK_LEAVE_REQUESTS);
        setBalance(MOCK_LEAVE_BALANCE);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const submitLeave = async (type, from, to, reason) => {
    if (IS_DEMO_MODE) {
      alert('Demo Mode: Leave submitted.');
      return true;
    }

    setSubmitting(true);
    try {
      // Find an admin/faculty to act as approver (picking the first admin for demo purposes)
      const { data: admin } = await supabase.from('users').select('id').in('role', ['admin', 'faculty']).limit(1).single();
      
      const { data, error } = await supabase.from('leave_requests').insert({
        user_id: user.id,
        approver_id: admin?.id || null, // Might be null if no admin exists
        type: type.toLowerCase(),
        start_date: from,
        end_date: to,
        reason: reason,
        status: 'pending'
      }).select(`*, approver:users!leave_requests_approver_id_fkey(name)`);

      if (error) throw error;

      const newReq = {
        id: data[0].id,
        type: data[0].type.charAt(0).toUpperCase() + data[0].type.slice(1),
        from: data[0].start_date,
        to: data[0].end_date,
        reason: data[0].reason,
        status: data[0].status,
        approver: data[0].approver?.name || 'Pending Assignment'
      };

      setRequests([newReq, ...requests]);
      return true;
    } catch (err) {
      console.error('Error submitting leave:', err);
      alert('Failed to submit leave.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { requests, balance, loading, submitting, submitLeave };
}
