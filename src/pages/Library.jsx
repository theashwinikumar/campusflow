import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibraryData } from '../hooks/useLibraryData';

export default function Library() {
  const { user } = useAuth();
  const { books, issued, reserveBook, renewBook, loading } = useLibraryData(user);
  
  const [search, setSearch] = useState('');

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading library catalog...</div>;
  }

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Library</h1>
        <p>Search books, manage issues, and track returns</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card"><div className="stat-card__icon">📖</div><div className="stat-card__value">{books.length}</div><div className="stat-card__label">Total Titles</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">✅</div><div className="stat-card__value">{books.reduce((a, b) => a + (b.available || 0), 0)}</div><div className="stat-card__label">Available</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">📕</div><div className="stat-card__value">{issued.length}</div><div className="stat-card__label">Your Issued</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">⚠️</div><div className="stat-card__value">₹{issued.reduce((a, b) => a + (b.fine || 0), 0)}</div><div className="stat-card__label">Pending Fines</div></div>
      </div>

      {/* My Issued Books */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>📕 My Issued Books</h3>
        <table className="data-table">
          <thead><tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Fine</th><th>Action</th></tr></thead>
          <tbody>
            {issued.map(ib => (
              <tr key={ib.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ib.book}</td>
                <td>{new Date(ib.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{new Date(ib.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{ib.fine > 0 ? <span className="badge badge-red">₹{ib.fine}</span> : <span className="badge badge-green">No fine</span>}</td>
                <td><button className="btn btn-secondary" onClick={() => renewBook(ib.id)} style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Renew</button></td>
              </tr>
            ))}
            {issued.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No books currently issued.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Book Catalog */}
      <div className="glass-card section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h3>📚 Book Catalog</h3>
          <input type="text" className="input-field" placeholder="🔍 Search books..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }} />
        </div>
        <table className="data-table">
          <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Available</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(book => (
              <tr key={book.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book.title}</td>
                <td>{book.author}</td>
                <td><span className="badge badge-blue">{book.category}</span></td>
                <td>
                  <span className={`badge ${book.available > 0 ? 'badge-green' : 'badge-red'}`}>
                    {book.available > 0 ? `${book.available}/${book.copies}` : 'Unavailable'}
                  </span>
                </td>
                <td>
                  {book.available > 0
                    ? <button className="btn btn-primary" onClick={() => reserveBook(book.id)} style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Reserve</button>
                    : <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>Waitlist</button>
                  }
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No books match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
