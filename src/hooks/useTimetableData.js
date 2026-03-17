import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MOCK_TIMETABLE = {
  Monday:    ['CS301 - DS', 'CS302 - OS', 'MA301 - DM', '— Lunch —', 'CS303 - DBMS', 'CS304 - CN Lab', 'CS304 - CN Lab'],
  Tuesday:   ['CS303 - DBMS', 'CS301 - DS', 'CS305 - SE', '— Lunch —', 'MA301 - DM', 'CS302 - OS Lab', 'CS302 - OS Lab'],
  Wednesday: ['MA301 - DM', 'CS304 - CN', 'CS301 - DS', '— Lunch —', 'CS305 - SE', 'CS301 - DS Lab', 'CS301 - DS Lab'],
  Thursday:  ['CS302 - OS', 'CS303 - DBMS', 'CS304 - CN', '— Lunch —', 'CS301 - DS', 'CS305 - SE Lab', 'CS305 - SE Lab'],
  Friday:    ['CS305 - SE', 'MA301 - DM', 'CS302 - OS', '— Lunch —', 'CS303 - DBMS Lab', 'CS303 - DBMS Lab', '— Free —'],
  Saturday:  ['CS304 - CN', 'MA301 - DM', '— Free —', '— Lunch —', '— Free —', '— Free —', '— Free —'],
};

export function useTimetableData(user) {
  const [timetable, setTimetable] = useState(MOCK_TIMETABLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    if (IS_DEMO_MODE) {
      setTimetable(MOCK_TIMETABLE);
      setLoading(false);
      return;
    }

    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('timetable')
          .select('*')
          .eq('department', user.department || 'Computer Science')
          .eq('year', user.year || '3rd Year')
          .eq('section', user.section || 'A');

        if (error) throw error;

        if (data && data.length > 0) {
          const newTimetable = { ...MOCK_TIMETABLE }; // Fallback foundation
          DAYS.forEach(day => {
            const daySlots = new Array(7).fill('— Free —');
            daySlots[3] = '— Lunch —';
            
            data.filter(d => d.day_of_week === day).forEach(slot => {
              if (slot.slot_index >= 0 && slot.slot_index < 7 && slot.slot_index !== 3) {
                daySlots[slot.slot_index] = slot.subject_details;
              }
            });
            newTimetable[day] = daySlots;
          });
          setTimetable(newTimetable);
        } else {
          setTimetable(MOCK_TIMETABLE);
        }
      } catch (err) {
        console.error('Failed to fetch timetable:', err);
        setTimetable(MOCK_TIMETABLE);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user]);

  return { timetable, loading };
}
