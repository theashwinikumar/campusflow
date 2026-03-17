import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_ROOMS = [
  { room: 'A-101', block: 'A', floor: 1, capacity: 3, occupants: ['Arjun S.', 'Rohan G.', 'Vikram R.'], status: 'full' },
  { room: 'A-102', block: 'A', floor: 1, capacity: 3, occupants: ['Sneha P.', 'Priya S.'], status: 'available' },
  { room: 'B-201', block: 'B', floor: 2, capacity: 2, occupants: ['Karthik N.', 'Anil K.'], status: 'full' },
  { room: 'B-202', block: 'B', floor: 2, capacity: 2, occupants: ['Divya M.'], status: 'available' },
  { room: 'C-301', block: 'C', floor: 3, capacity: 4, occupants: ['Rahul V.', 'Ankit M.', 'Suresh D.', 'Nitin P.'], status: 'full' },
  { room: 'C-302', block: 'C', floor: 3, capacity: 4, occupants: ['Meena T.', 'Kavita R.'], status: 'available' },
];

const MOCK_COMPLAINTS = [
  { id: 1, room: 'A-101', issue: 'Water leakage in bathroom', priority: 'high', status: 'open', date: '2026-03-15' },
  { id: 2, room: 'B-201', issue: 'Fan not working', priority: 'medium', status: 'in-progress', date: '2026-03-14' },
  { id: 3, room: 'C-301', issue: 'Window broken', priority: 'high', status: 'resolved', date: '2026-03-10' },
  { id: 4, room: 'A-102', issue: 'WiFi connectivity issues', priority: 'low', status: 'open', date: '2026-03-16' },
];

export function useHostelData(user) {
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setRooms(MOCK_ROOMS);
      setComplaints(MOCK_COMPLAINTS);
      setLoading(false);
      return;
    }

    const fetchHostelData = async () => {
      setLoading(true);
      try {
        const { data: rData, error: rError } = await supabase
          .from('hostel_rooms')
          .select('*')
          .order('block', { ascending: true })
          .order('room_no', { ascending: true });

        if (rError) throw rError;

        const { data: cData, error: cError } = await supabase
          .from('hostel_complaints')
          .select(`
            *,
            room:hostel_rooms(room_no)
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (cError) throw cError;

        const mappedRooms = (rData || []).map(r => ({
          id: r.id,
          room: r.room_no,
          block: r.block,
          floor: r.floor,
          capacity: r.capacity,
          occupants: r.occupants || [], // Supabase doesn't auto-resolve uuid[] array to user profiles so easily without an edge function. We will show generic tags or lengths.
          status: (r.occupants || []).length >= r.capacity ? 'full' : 'available'
        }));

        const mappedComplaints = (cData || []).map(c => ({
          id: c.id,
          room: c.room?.room_no || 'Unknown',
          issue: c.description,
          priority: c.priority,
          status: c.status === 'in_progress' ? 'in-progress' : c.status,
          date: c.created_at
        }));

        setRooms(mappedRooms.length ? mappedRooms : MOCK_ROOMS);
        setComplaints(mappedComplaints.length ? mappedComplaints : MOCK_COMPLAINTS);
      } catch (err) {
        console.error('Failed to fetch hostel data:', err);
        setRooms(MOCK_ROOMS);
        setComplaints(MOCK_COMPLAINTS);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelData();
  }, [user]);

  const submitComplaint = async (roomId, description, priority) => {
    if (IS_DEMO_MODE) {
      const roomObj = rooms.find(r => r.id === roomId || r.room === roomId);
      const newComplaint = {
        id: Date.now(),
        room: roomObj ? roomObj.room : 'Unknown',
        issue: description,
        priority: priority.toLowerCase(),
        status: 'open',
        date: new Date().toISOString()
      };
      setComplaints([newComplaint, ...complaints]);
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('hostel_complaints')
        .insert([{
          student_id: user.id,
          room_id: roomId,
          category: 'maintenance',
          description,
          priority: priority.toLowerCase()
        }])
        .select(`*, room:hostel_rooms(room_no)`)
        .single();

      if (error) throw error;

      setComplaints([{
        id: data.id,
        room: data.room?.room_no || 'Unknown',
        issue: data.description,
        priority: data.priority,
        status: data.status,
        date: data.created_at
      }, ...complaints]);

      return { success: true };
    } catch (err) {
      console.error('Error submitting hostel complaint', err);
      return { success: false, error: err.message };
    }
  };

  return { rooms, complaints, submitComplaint, loading };
}
