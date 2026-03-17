import { useClubsData } from '../hooks/useClubsData';

const CAT_COLORS = { Technical: 'blue', Cultural: 'purple', Sports: 'green', Literary: 'amber', Social: 'cyan' };

export default function Clubs() {
  const { clubs, loading } = useClubsData();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading clubs...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎭 Clubs</h1>
        <p>Explore student clubs and communities</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
        {clubs.map((club, i) => (
          <div key={club.id} className="glass-card" style={{ padding: 'var(--space-lg)', animation: `fadeIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {club.logo}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 0 }}>{club.name}</h3>
                <span className={`badge badge-${CAT_COLORS[club.category] || 'purple'}`}>{club.category}</span>
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
