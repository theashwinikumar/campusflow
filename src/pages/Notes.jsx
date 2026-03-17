import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = [
  { code: 'CS301', name: 'Data Structures', faculty: 'Dr. Priya Mehta' },
  { code: 'CS302', name: 'Operating Systems', faculty: 'Dr. Amit Verma' },
  { code: 'CS303', name: 'Database Systems', faculty: 'Dr. Neha Gupta' },
  { code: 'CS304', name: 'Computer Networks', faculty: 'Dr. Ravi Kumar' },
  { code: 'MA301', name: 'Discrete Mathematics', faculty: 'Dr. Sanjay Joshi' },
  { code: 'CS305', name: 'Software Engineering', faculty: 'Prof. Anita Roy' },
];

const SUBJECT_COLORS = {
  CS301: 'rgba(59, 130, 246, 0.15)',
  CS302: 'rgba(139, 92, 246, 0.15)',
  CS303: 'rgba(6, 182, 212, 0.15)',
  CS304: 'rgba(34, 197, 94, 0.15)',
  CS305: 'rgba(236, 72, 153, 0.15)',
  MA301: 'rgba(245, 158, 11, 0.15)',
};

const INITIAL_NOTES = [
  { id: 1, fileName: 'DS_Unit1_Arrays_LinkedLists.pdf', type: 'PDF', subject: 'CS301', uploadedBy: 'Dr. Priya Mehta', date: '2026-03-10', size: '2.4 MB' },
  { id: 2, fileName: 'DS_Unit2_Stacks_Queues.pptx', type: 'PPT', subject: 'CS301', uploadedBy: 'Dr. Priya Mehta', date: '2026-03-12', size: '5.1 MB' },
  { id: 3, fileName: 'DS_Trees_Graphs_Handwritten.pdf', type: 'PDF', subject: 'CS301', uploadedBy: 'Arjun Sharma', date: '2026-03-14', size: '1.8 MB' },
  { id: 4, fileName: 'OS_Process_Management.pdf', type: 'PDF', subject: 'CS302', uploadedBy: 'Dr. Amit Verma', date: '2026-03-08', size: '3.2 MB' },
  { id: 5, fileName: 'OS_Memory_Management.pptx', type: 'PPT', subject: 'CS302', uploadedBy: 'Dr. Amit Verma', date: '2026-03-11', size: '4.7 MB' },
  { id: 6, fileName: 'OS_Scheduling_Algorithms_Notes.pdf', type: 'PDF', subject: 'CS302', uploadedBy: 'Sneha Patel', date: '2026-03-15', size: '1.2 MB' },
  { id: 7, fileName: 'DBMS_ER_Model_Normalization.pdf', type: 'PDF', subject: 'CS303', uploadedBy: 'Dr. Neha Gupta', date: '2026-03-09', size: '2.8 MB' },
  { id: 8, fileName: 'DBMS_SQL_Queries_Practice.pptx', type: 'PPT', subject: 'CS303', uploadedBy: 'Dr. Neha Gupta', date: '2026-03-13', size: '3.5 MB' },
  { id: 9, fileName: 'CN_OSI_Model_TCP_IP.pdf', type: 'PDF', subject: 'CS304', uploadedBy: 'Dr. Ravi Kumar', date: '2026-03-07', size: '2.1 MB' },
  { id: 10, fileName: 'CN_Subnetting_Solved_Examples.pdf', type: 'PDF', subject: 'CS304', uploadedBy: 'Vikram Rao', date: '2026-03-16', size: '0.9 MB' },
  { id: 11, fileName: 'DM_Graph_Theory_Combinatorics.pdf', type: 'PDF', subject: 'MA301', uploadedBy: 'Dr. Sanjay Joshi', date: '2026-03-06', size: '4.0 MB' },
  { id: 12, fileName: 'DM_Propositional_Logic.pptx', type: 'PPT', subject: 'MA301', uploadedBy: 'Dr. Sanjay Joshi', date: '2026-03-10', size: '6.2 MB' },
  { id: 13, fileName: 'SE_SDLC_Agile_Waterfall.pdf', type: 'PDF', subject: 'CS305', uploadedBy: 'Prof. Anita Roy', date: '2026-03-05', size: '1.5 MB' },
  { id: 14, fileName: 'SE_UML_Diagrams_Reference.pptx', type: 'PPT', subject: 'CS305', uploadedBy: 'Prof. Anita Roy', date: '2026-03-11', size: '3.8 MB' },
  { id: 15, fileName: 'SE_Testing_Strategies_Summary.pdf', type: 'PDF', subject: 'CS305', uploadedBy: 'Rohan Gupta', date: '2026-03-16', size: '1.1 MB' },
];

const labelStyle = { display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' };

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [filterSubject, setFilterSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [uploadForm, setUploadForm] = useState({ fileName: '', subject: '', type: 'PDF', size: '' });

  const filteredNotes = notes.filter(note => {
    const matchesSubject = filterSubject === 'All' || note.subject === filterSubject;
    const matchesSearch = note.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const totalNotes = notes.length;
  const totalPDFs = notes.filter(n => n.type === 'PDF').length;
  const totalPPTs = notes.filter(n => n.type === 'PPT').length;
  const subjectsWithNotes = new Set(notes.map(n => n.subject)).size;

  const handleUpload = () => {
    if (!uploadForm.fileName || !uploadForm.subject) return;
    const newNote = {
      id: Date.now(),
      fileName: uploadForm.fileName,
      type: uploadForm.type,
      subject: uploadForm.subject,
      uploadedBy: user?.name || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      size: uploadForm.size || '1.0 MB',
    };
    setNotes(prev => [newNote, ...prev]);
    setUploadForm({ fileName: '', subject: '', type: 'PDF', size: '' });
    setShowUpload(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>📒 Notes</h1>
          <p>Access and share lecture notes, presentations, and study materials</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? '✕ Close' : '+ Upload Notes'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📄</div>
          <div className="stat-card__value">{totalNotes}</div>
          <div className="stat-card__label">Total Notes</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📕</div>
          <div className="stat-card__value">{totalPDFs}</div>
          <div className="stat-card__label">PDF Files</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📊</div>
          <div className="stat-card__value">{totalPPTs}</div>
          <div className="stat-card__label">Presentations</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📚</div>
          <div className="stat-card__value">{subjectsWithNotes}</div>
          <div className="stat-card__label">Subjects Covered</div>
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeIn 0.3s ease' }}>
          <h3>📤 Upload Notes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <label style={labelStyle}>File Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., DS_Unit3_Trees.pdf"
                value={uploadForm.fileName}
                onChange={e => setUploadForm(prev => ({ ...prev, fileName: e.target.value }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <select
                className="input-field"
                value={uploadForm.subject}
                onChange={e => setUploadForm(prev => ({ ...prev, subject: e.target.value }))}
              >
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>File Type</label>
              <select
                className="input-field"
                value={uploadForm.type}
                onChange={e => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="PDF">PDF</option>
                <option value="PPT">PPT</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>File Size</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., 2.4 MB"
                value={uploadForm.size}
                onChange={e => setUploadForm(prev => ({ ...prev, size: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
            <button className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ maxWidth: 300, flex: 1 }}
          />
          <select
            className="input-field"
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            style={{ maxWidth: 250 }}
          >
            <option value="All">All Subjects</option>
            {SUBJECTS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', marginLeft: 'auto' }}>
            <button
              className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('cards')}
              style={{ padding: '8px 14px', fontSize: 'var(--text-sm)' }}
            >
              Cards
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
              style={{ padding: '8px 14px', fontSize: 'var(--text-sm)' }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && SUBJECTS
        .filter(s => filterSubject === 'All' || s.code === filterSubject)
        .map(subject => {
          const subjectNotes = filteredNotes.filter(n => n.subject === subject.code);
          if (subjectNotes.length === 0) return null;
          return (
            <div key={subject.code} className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block', width: 10, height: 10,
                  borderRadius: 'var(--radius-full)',
                  background: SUBJECT_COLORS[subject.code]?.replace('0.15', '0.8'),
                }}></span>
                {subject.code} — {subject.name}
                <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>
                  {subjectNotes.length} file{subjectNotes.length > 1 ? 's' : ''}
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                {subjectNotes.map(note => (
                  <div key={note.id} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    background: SUBJECT_COLORS[note.subject],
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-fast)',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {note.type === 'PDF' ? '📕' : '📊'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                        {note.fileName}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                        Uploaded by {note.uploadedBy} · {new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {note.size}
                      </div>
                    </div>
                    <span className={`badge ${note.type === 'PDF' ? 'badge-red' : 'badge-amber'}`}>
                      {note.type}
                    </span>
                    <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      }

      {/* Table View */}
      {viewMode === 'table' && filteredNotes.length > 0 && (
        <div className="glass-card section-card">
          <h3>All Notes</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((note, i) => (
                <tr key={note.id}>
                  <td>{i + 1}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    <span style={{ marginRight: '6px' }}>{note.type === 'PDF' ? '📕' : '📊'}</span>
                    {note.fileName}
                  </td>
                  <td>
                    <span className={`badge ${note.type === 'PDF' ? 'badge-red' : 'badge-amber'}`}>
                      {note.type}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      background: SUBJECT_COLORS[note.subject],
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {note.subject}
                    </span>
                  </td>
                  <td>{note.uploadedBy}</td>
                  <td>{new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>{note.size}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="glass-card section-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📭</div>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>No notes found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
