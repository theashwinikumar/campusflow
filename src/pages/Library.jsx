import { useState } from 'react';

const BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '978-0262033848', copies: 5, available: 2, category: 'CS' },
  { id: 2, title: 'Operating System Concepts', author: 'Silberschatz, Galvin', isbn: '978-1119800361', copies: 4, available: 1, category: 'CS' },
  { id: 3, title: 'Database System Concepts', author: 'Korth, Sudarshan', isbn: '978-0078022159', copies: 3, available: 3, category: 'CS' },
  { id: 4, title: 'Computer Networking', author: 'Kurose, Ross', isbn: '978-0133594140', copies: 4, available: 0, category: 'CS' },
  { id: 5, title: 'Discrete Mathematics', author: 'Rosen', isbn: '978-0073383095', copies: 6, available: 4, category: 'Math' },
  { id: 6, title: 'Engineering Physics', author: 'Gaur, Gupta', isbn: '978-8177091888', copies: 3, available: 2, category: 'Physics' },
  { id: 7, title: 'Linear Algebra', author: 'Gilbert Strang', isbn: '978-0980232714', copies: 3, available: 1, category: 'Math' },
  { id: 8, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', copies: 2, available: 0, category: 'CS' },
];

const ISSUED = [
  { book: 'Introduction to Algorithms', issueDate: '2026-03-01', dueDate: '2026-03-19', fine: 0 },
  { book: 'Clean Code', issueDate: '2026-02-15', dueDate: '2026-03-15', fine: 20 },
  { book: 'Discrete Mathematics', issueDate: '2026-03-10', dueDate: '2026-03-24', fine: 0 },
];

export default function Library() {
  const [search, setSearch] = useState('');
  const filtered = BOOKS.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Library</h1>
        <p>Search books, manage issues, and track returns</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card"><div className="stat-card__icon">📖</div><div className="stat-card__value">{BOOKS.length}</div><div className="stat-card__label">Total Titles</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">✅</div><div className="stat-card__value">{BOOKS.reduce((a, b) => a + b.available, 0)}</div><div className="stat-card__label">Available</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">📕</div><div className="stat-card__value">{ISSUED.length}</div><div className="stat-card__label">Your Issued</div></div>
        <div className="glass-card stat-card"><div className="stat-card__icon">⚠️</div><div className="stat-card__value">₹{ISSUED.reduce((a, b) => a + b.fine, 0)}</div><div className="stat-card__label">Pending Fines</div></div>
      </div>

      {/* My Issued Books */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3>📕 My Issued Books</h3>
        <table className="data-table">
          <thead><tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Fine</th><th>Action</th></tr></thead>
          <tbody>
            {ISSUED.map((ib, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ib.book}</td>
                <td>{new Date(ib.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{new Date(ib.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>{ib.fine > 0 ? <span className="badge badge-red">₹{ib.fine}</span> : <span className="badge badge-green">No fine</span>}</td>
                <td><button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Renew</button></td>
              </tr>
            ))}
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
                    ? <button className="btn btn-primary" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Reserve</button>
                    : <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>Waitlist</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
