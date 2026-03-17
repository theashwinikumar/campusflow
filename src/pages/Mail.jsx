import { useState } from 'react';

const MAILS = [
  { id: 1, from: 'Dr. Priya Mehta', subject: 'Assignment Deadline Extended', preview: 'The deadline for the Data Structures assignment has been extended to March 25...', time: '10:30 AM', read: false, starred: true },
  { id: 2, from: 'Admin Office', subject: 'Fee Payment Reminder', preview: 'This is a reminder that your Q2 tuition fee of ₹15,000 is due by March 31...', time: '9:15 AM', read: false, starred: false },
  { id: 3, from: 'Prof. Anita Roy', subject: 'Software Engineering Lab Schedule', preview: 'Please note the updated lab schedule for this week. Lab 3 has been moved to...', time: 'Yesterday', read: true, starred: false },
  { id: 4, from: 'Event Committee', subject: 'Tech Fest Volunteer Registration', preview: 'We are looking for volunteers for the upcoming Tech Fest. Register by March 20...', time: 'Yesterday', read: true, starred: true },
  { id: 5, from: 'Library', subject: 'Book Return Reminder', preview: 'Your borrowed book "Introduction to Algorithms" is due for return on March 19...', time: '2 days ago', read: true, starred: false },
  { id: 6, from: 'Dr. Amit Verma', subject: 'OS Project Groups Finalized', preview: 'The project groups for Operating Systems have been finalized. Please check...', time: '3 days ago', read: true, starred: false },
  { id: 7, from: 'Hostel Warden', subject: 'Hostel Inspection Notice', preview: 'A routine hostel inspection will be conducted on March 22. Please ensure...', time: '4 days ago', read: true, starred: false },
];

export default function Mail() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('inbox');
  const selectedMail = MAILS.find(m => m.id === selected);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>✉️ Mail</h1>
          <p>Internal campus messaging</p>
        </div>
        <button className="btn btn-primary">✏️ Compose</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-lg)', minHeight: 500 }}>
        {/* Mail List */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
            {['inbox', 'sent', 'starred'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '12px', background: tab === t ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: tab === t ? 'var(--accent-blue)' : 'var(--text-muted)', border: 'none',
                  fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
                  borderBottom: tab === t ? '2px solid var(--accent-blue)' : '2px solid transparent'
                }}>{t}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {(tab === 'starred' ? MAILS.filter(m => m.starred) : MAILS).map(mail => (
              <div key={mail.id} onClick={() => setSelected(mail.id)}
                style={{
                  padding: 'var(--space-md)', borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer', background: selected === mail.id ? 'rgba(59,130,246,0.06)' : mail.read ? 'transparent' : 'rgba(59,130,246,0.03)',
                  transition: 'background 0.15s'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: mail.read ? 400 : 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{mail.from}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mail.time}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: mail.read ? 400 : 600, marginBottom: '2px' }}>{mail.subject}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mail.preview}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mail Content */}
        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
          {selectedMail ? (
            <>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)' }}>{selectedMail.subject}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{selectedMail.from}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginLeft: '8px' }}>{selectedMail.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>⭐</button>
                    <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>↩️ Reply</button>
                    <button className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>🗑️</button>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-lg)' }}>
                <p>{selectedMail.preview}</p>
                <br />
                <p>This is a demo preview of the email content. In the full version, this would display the complete email body with formatting, attachments, and more.</p>
                <br />
                <p>Best regards,<br />{selectedMail.from}</p>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📨</span>
              <p>Select an email to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
