import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_EVENTS = [
  { id: 1, title: 'Annual Tech Fest 2026', date: '2026-03-25', time: '10:00 AM', venue: 'Main Auditorium', category: 'technical', rsvp: 234, desc: 'The biggest technical festival with coding competitions, hackathons, and workshops.' },
  { id: 2, title: 'Cultural Night', date: '2026-03-28', time: '6:00 PM', venue: 'Open Air Theatre', category: 'cultural', rsvp: 156, desc: 'An evening of dance, music, and drama performances by students.' },
  { id: 3, title: 'Inter-College Cricket', date: '2026-04-02', time: '9:00 AM', venue: 'Sports Ground', category: 'sports', rsvp: 89, desc: 'Cricket tournament with teams from 8 colleges.' },
  { id: 4, title: 'AI/ML Workshop', date: '2026-04-05', time: '2:00 PM', venue: 'Seminar Hall B', category: 'academic', rsvp: 67, desc: 'Hands-on workshop on machine learning with Python and TensorFlow.' },
  { id: 5, title: 'Photography Walk', date: '2026-04-08', time: '7:00 AM', venue: 'College Campus', category: 'cultural', rsvp: 45, desc: 'Explore and capture the beauty of our campus.' },
  { id: 6, title: 'Startup Weekend', date: '2026-04-12', time: '10:00 AM', venue: 'Innovation Lab', category: 'technical', rsvp: 112, desc: '54-hour event to launch a startup from scratch.' },
];

export function useEventsData(user) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setEvents(MOCK_EVENTS);
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data: eventsData, error: evError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .gte('date', new Date().toISOString().split('T')[0]); // Upcoming events only

        if (evError) throw evError;

        let rsvpMap = {};
        if (user) {
          const { data: userRsvps } = await supabase
            .from('event_rsvps')
            .select('event_id')
            .eq('user_id', user.id);
            
          (userRsvps || []).forEach(r => {
            rsvpMap[r.event_id] = true;
          });
        }

        const mappedEvents = (eventsData || []).map(ev => ({
          id: ev.id,
          title: ev.title,
          date: ev.date,
          time: String(ev.time).substring(0, 5) + ' (24H)', // basic formatting
          venue: ev.venue,
          category: ev.category,
          rsvp: ev.rsvp_count,
          desc: ev.description,
          hasRSVP: !!rsvpMap[ev.id]
        }));

        setEvents(mappedEvents.length ? mappedEvents : MOCK_EVENTS);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const toggleRSVP = async (event) => {
    if (IS_DEMO_MODE) {
      alert(`Demo Mode: RSVP tracked for ${event.title}`);
      return;
    }

    try {
      if (event.hasRSVP) {
        // Cancel RSVP
        await supabase.from('event_rsvps').delete().match({ event_id: event.id, user_id: user.id });
        await supabase.from('events').update({ rsvp_count: event.rsvp - 1 }).eq('id', event.id);
        
        setEvents(events.map(e => e.id === event.id ? { ...e, hasRSVP: false, rsvp: e.rsvp - 1 } : e));
      } else {
        // Add RSVP
        await supabase.from('event_rsvps').insert({ event_id: event.id, user_id: user.id });
        await supabase.from('events').update({ rsvp_count: event.rsvp + 1 }).eq('id', event.id);
        
        setEvents(events.map(e => e.id === event.id ? { ...e, hasRSVP: true, rsvp: e.rsvp + 1 } : e));
      }
    } catch (err) {
      console.error('RSVP action failed', err);
      alert('Could not update RSVP');
    }
  };

  return { events, loading, toggleRSVP };
}
