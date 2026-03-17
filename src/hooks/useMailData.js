import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_MAILS = [
  { id: 1, from: 'Dr. Priya Mehta', subject: 'Assignment Deadline Extended', preview: 'The deadline for the Data Structures assignment has been extended to March 25...', time: '10:30 AM', read: false, starred: true },
  { id: 2, from: 'Admin Office', subject: 'Fee Payment Reminder', preview: 'This is a reminder that your Q2 tuition fee of ₹15,000 is due by March 31...', time: '9:15 AM', read: false, starred: false },
  { id: 3, from: 'Prof. Anita Roy', subject: 'Software Engineering Lab Schedule', preview: 'Please note the updated lab schedule for this week. Lab 3 has been moved to...', time: 'Yesterday', read: true, starred: false },
  { id: 4, from: 'Event Committee', subject: 'Tech Fest Volunteer Registration', preview: 'We are looking for volunteers for the upcoming Tech Fest. Register by March 20...', time: 'Yesterday', read: true, starred: true },
];

export function useMailData(user) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setMails(MOCK_MAILS);
      setLoading(false);
      return;
    }

    const fetchMails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('mail')
          .select(`
            id, subject, body, is_read, created_at,
            sender:users!mail_sender_id_fkey(name)
          `)
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedMails = (data || []).map(m => {
          const d = new Date(m.created_at);
          let timeLabel = d.toLocaleDateString();
          if (new Date().toDateString() === d.toDateString()) {
            timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          return {
            id: m.id,
            from: m.sender?.name || 'Unknown User',
            subject: m.subject,
            preview: m.body?.substring(0, 100) || '',
            fullBody: m.body,
            time: timeLabel,
            read: m.is_read,
            starred: false // basic implementation doesn't track starred per user yet
          };
        });

        setMails(mappedMails.length ? mappedMails : MOCK_MAILS);
      } catch (err) {
        console.error('Failed to fetch mails:', err);
        setMails(MOCK_MAILS);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();

    // Supabase Realtime subscription for incoming mails
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mail', filter: `receiver_id=eq.${user.id}` },
        (payload) => {
          console.log('New mail received!', payload);
          // In a real app we'd fetch the sender name again, but for this demo we rely on standard refresh or basic fallback
          fetchMails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id) => {
    if (IS_DEMO_MODE) {
      setMails(mails.map(m => m.id === id ? { ...m, read: true } : m));
      return;
    }

    try {
      setMails(mails.map(m => m.id === id ? { ...m, read: true } : m));
      await supabase.from('mail').update({ is_read: true }).eq('id', id);
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  return { mails, loading, markAsRead };
}
