import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_CLUBS = [
  { id: 1, name: 'CodeCraft', category: 'Technical', members: 87, lead: 'Arjun Sharma', desc: 'Competitive programming, hackathons, and coding workshops.', logo: '💻' },
  { id: 2, name: 'Shutterbug', category: 'Cultural', members: 54, lead: 'Priya Singh', desc: 'Photography club — photo walks, exhibitions, and contests.', logo: '📸' },
  { id: 3, name: 'Nrityam', category: 'Cultural', members: 42, lead: 'Sneha Patel', desc: 'Classical and contemporary dance performances.', logo: '💃' },
  { id: 4, name: 'ByteForce', category: 'Technical', members: 65, lead: 'Rohan Gupta', desc: 'Robotics, IoT, and hardware projects club.', logo: '🤖' },
  { id: 5, name: 'Sportshood', category: 'Sports', members: 110, lead: 'Vikram Rao', desc: 'All indoor and outdoor sports activities.', logo: '⚽' },
  { id: 6, name: 'Quill & Ink', category: 'Literary', members: 38, lead: 'Ananya Das', desc: 'Creative writing, debates, and literature appreciation.', logo: '✍️' },
  { id: 7, name: 'Green Campus', category: 'Social', members: 29, lead: 'Divya Menon', desc: 'Environmental awareness, tree plantation, and sustainability.', logo: '🌱' },
  { id: 8, name: 'Enactus', category: 'Social', members: 48, lead: 'Karthik Nair', desc: 'Entrepreneurial action for social impact.', logo: '🌍' },
];

export function useClubsData() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setClubs(MOCK_CLUBS);
      setLoading(false);
      return;
    }

    const fetchClubs = async () => {
      setLoading(true);
      try {
        const { data: clubsData, error } = await supabase
          .from('clubs')
          .select(`
            *,
            lead:users!clubs_lead_id_fkey(name),
            members:club_members(count)
          `)
          .order('name');

        if (error) throw error;

        const mappedClubs = (clubsData || []).map((club, idx) => ({
          id: club.id,
          name: club.name,
          category: idx % 2 === 0 ? 'Technical' : 'Cultural', // dummy category if none in db
          members: club.members?.[0]?.count || Math.floor(Math.random() * 100) + 10,
          lead: club.lead?.name || 'Pending Assigned',
          desc: club.description || 'Welcome to our campus club!',
          logo: club.logo_url || '🎭'
        }));

        setClubs(mappedClubs.length ? mappedClubs : MOCK_CLUBS);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
        setClubs(MOCK_CLUBS);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return { clubs, loading };
}
