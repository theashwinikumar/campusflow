const CLUBS = [
  { id: 1, name: 'CodeCraft', category: 'Technical', members: 87, lead: 'Arjun Sharma', desc: 'Competitive programming, hackathons, and coding workshops.', logo: '💻' },
  { id: 2, name: 'Shutterbug', category: 'Cultural', members: 54, lead: 'Priya Singh', desc: 'Photography club — photo walks, exhibitions, and contests.', logo: '📸' },
  { id: 3, name: 'Nrityam', category: 'Cultural', members: 42, lead: 'Sneha Patel', desc: 'Classical and contemporary dance performances.', logo: '💃' },
  { id: 4, name: 'ByteForce', category: 'Technical', members: 65, lead: 'Rohan Gupta', desc: 'Robotics, IoT, and hardware projects club.', logo: '🤖' },
  { id: 5, name: 'Sportshood', category: 'Sports', members: 110, lead: 'Vikram Rao', desc: 'All indoor and outdoor sports activities.', logo: '⚽' },
  { id: 6, name: 'Quill & Ink', category: 'Literary', members: 38, lead: 'Ananya Das', desc: 'Creative writing, debates, and literature appreciation.', logo: '✍️' },
  { id: 7, name: 'Green Campus', category: 'Social', members: 29, lead: 'Divya Menon', desc: 'Environmental awareness, tree plantation, and sustainability.', logo: '🌱' },
  { id: 8, name: 'Enactus', category: 'Social', members: 48, lead: 'Karthik Nair', desc: 'Entrepreneurial action for social impact.', logo: '🌍' },
];

const CAT_COLORS = { Technical: 'blue', Cultural: 'purple', Sports: 'green', Literary: 'amber', Social: 'cyan' };

export default function Clubs() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎭 Clubs</h1>
        <p>Explore student clubs and communities</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
        {CLUBS.map((club, i) => (
          <div key={club.id} className="glass-card" style={{ padding: 'var(--space-lg)', animation: `fadeIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {club.logo}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 0 }}>{club.name}</h3>
                <span className={`badge badge-${CAT_COLORS[club.category]}`}>{club.category}</span>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>{club.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span>👥 {club.members} members</span>
              <span>👑 {club.lead}</span>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>View Club</button>
          </div>
        ))}
      </div>
    </div>
  );
}
