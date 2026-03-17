import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMailData } from '../hooks/useMailData';

export default function Mail() {
  const { user } = useAuth();
  const { mails, loading, markAsRead } = useMailData(user);
  
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('inbox');
  
  const selectedMail = mails.find(m => m.id === selected);

  useEffect(() => {
    if (selectedMail && !selectedMail.read) {
      markAsRead(selectedMail.id);
    }
  }, [selectedMail, markAsRead]);

  if (loading && !mails.length) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>Loading mail...</div>;
  }

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
            {(tab === 'starred' ? mails.filter(m => m.starred) : mails).map(mail => (
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
            {mails.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No emails found.</div>
            )}
          </div>
        </div>

        {/* Mail Content */}
        <div className="glass-card" style={{ padding: 'var(--space-lg)', overflowY: 'auto' }}>
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
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-lg)', whiteSpace: 'pre-wrap' }}>
                {selectedMail.fullBody ? selectedMail.fullBody : (
                  <>
                    <p>{selectedMail.preview}</p>
                    <br />
                    <p>This is a demo preview of the email content. In the full version, this would display the complete email body with formatting, attachments, and more.</p>
                    <br />
                    <p>Best regards,<br />{selectedMail.from}</p>
                  </>
                )}
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
