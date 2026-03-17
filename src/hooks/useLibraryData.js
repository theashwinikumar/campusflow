import { useState, useEffect } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';

const MOCK_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '978-0262033848', copies: 5, available: 2, category: 'CS' },
  { id: 2, title: 'Operating System Concepts', author: 'Silberschatz, Galvin', isbn: '978-1119800361', copies: 4, available: 1, category: 'CS' },
  { id: 3, title: 'Database System Concepts', author: 'Korth, Sudarshan', isbn: '978-0078022159', copies: 3, available: 3, category: 'CS' },
  { id: 4, title: 'Computer Networking', author: 'Kurose, Ross', isbn: '978-0133594140', copies: 4, available: 0, category: 'CS' },
  { id: 5, title: 'Discrete Mathematics', author: 'Rosen', isbn: '978-0073383095', copies: 6, available: 4, category: 'Math' },
  { id: 6, title: 'Engineering Physics', author: 'Gaur, Gupta', isbn: '978-8177091888', copies: 3, available: 2, category: 'Physics' },
  { id: 7, title: 'Linear Algebra', author: 'Gilbert Strang', isbn: '978-0980232714', copies: 3, available: 1, category: 'Math' },
  { id: 8, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', copies: 2, available: 0, category: 'CS' },
];

const MOCK_ISSUED = [
  { id: 101, book: 'Introduction to Algorithms', issueDate: '2026-03-01', dueDate: '2026-03-19', fine: 0 },
  { id: 102, book: 'Clean Code', issueDate: '2026-02-15', dueDate: '2026-03-15', fine: 20 },
  { id: 103, book: 'Discrete Mathematics', issueDate: '2026-03-10', dueDate: '2026-03-24', fine: 0 },
];

export function useLibraryData(user) {
  const [books, setBooks] = useState([]);
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (IS_DEMO_MODE) {
      setBooks(MOCK_BOOKS);
      setIssued(MOCK_ISSUED);
      setLoading(false);
      return;
    }

    const fetchLibraryData = async () => {
      setLoading(true);
      try {
        const { data: booksData, error: bError } = await supabase
          .from('library_books')
          .select('*')
          .order('title', { ascending: true });

        if (bError) throw bError;

        const { data: issuesData, error: iError } = await supabase
          .from('library_issues')
          .select(`
            *,
            book:library_books(title)
          `)
          .eq('student_id', user.id)
          .eq('status', 'issued');

        if (iError) throw iError;

        setBooks(booksData?.length ? booksData : MOCK_BOOKS);

        const today = new Date();
        const mappedIssues = (issuesData || []).map(i => {
          let fine = Number(i.fine_amount);
          const dueDate = new Date(i.due_date);
          if (today > dueDate && fine === 0) {
            const diffTime = Math.abs(today - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * 5; // 5 rupees per day fine mock
          }
          return {
            id: i.id,
            book: i.book?.title || 'Unknown Book',
            issueDate: i.issue_date,
            dueDate: i.due_date,
            fine
          };
        });

        setIssued(mappedIssues.length ? mappedIssues : MOCK_ISSUED);
      } catch (err) {
        console.error('Failed to fetch library data:', err);
        setBooks(MOCK_BOOKS);
        setIssued(MOCK_ISSUED);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [user]);

  const reserveBook = async (bookId) => {
    setBooks(books.map(b => b.id === bookId ? { ...b, available: Math.max(0, b.available - 1) } : b));
    if (!IS_DEMO_MODE) {
      try {
        const book = books.find(b => b.id === bookId);
        if (book && book.available > 0) {
          await supabase.from('library_books').update({ available: book.available - 1 }).eq('id', bookId);
          await supabase.from('library_issues').insert([{
            student_id: user.id,
            book_id: bookId,
            issue_date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'issued'
          }]);
          
          // Re-fetch could be done here, we just mock the append for snappiess
          const newIssue = {
            id: Date.now(),
            book: book.title,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            fine: 0
          };
          setIssued([...issued, newIssue]);
        }
      } catch (err) {
        console.error('Error reserving book:', err);
      }
    } else {
       const book = books.find(b => b.id === bookId);
       if(book) {
          const newIssue = {
            id: Date.now(),
            book: book.title,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            fine: 0
          };
          setIssued([...issued, newIssue]);
       }
    }
  };

  const renewBook = async (issueId) => {
    const issueToRenew = issued.find(i => i.id === issueId);
    if (!issueToRenew) return;

    const newDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (IS_DEMO_MODE) {
      setIssued(issued.map(i => i.id === issueId ? { ...i, dueDate: newDueDate } : i));
      return;
    }

    try {
      setIssued(issued.map(i => i.id === issueId ? { ...i, dueDate: newDueDate } : i));
      await supabase.from('library_issues').update({ due_date: newDueDate }).eq('id', issueId);
    } catch (err) {
      console.error('Failed to renew book:', err);
    }
  };

  return { books, issued, reserveBook, renewBook, loading };
}
