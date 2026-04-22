import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [deadline, setDeadline] = useState(7);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const notifs = [];
        const now = new Date();

        res.data.forEach(r => {
          const createdAt = new Date(r.createdAt);
          const daysOld = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
          const daysLeft = deadline - daysOld;

          if (daysLeft < 0 && r.status !== 'Resolved' && r.status !== 'Closed') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" is overdue by ${Math.abs(daysLeft)} day(s)!`,
              type: 'overdue',
              time: r.createdAt
            });
          } else if (daysLeft <= 2 && daysLeft >= 0 && r.status !== 'Resolved' && r.status !== 'Closed') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" deadline in ${daysLeft} day(s)!`,
              type: 'warning',
              time: r.createdAt
            });
          }
          if (r.priority === 'Critical' && r.status === 'New') {
            notifs.push({
              id: r._id,
              message: `CRITICAL: "${r.title}" needs immediate attention!`,
              type: 'critical',
              time: r.createdAt
            });
          }
          if (r.status === 'In Progress') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" is now In Progress`,
              type: 'info',
              time: r.updatedAt
            });
          }
          if (r.status === 'Resolved') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" has been Resolved!`,
              type: 'success',
              time: r.updatedAt
            });
          }
        });

        notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(notifs.slice(0, 15));
        setLastUpdated(new Date());
      } catch {}
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, deadline]);

  const typeStyles = {
    overdue:  { bg: '#fff1f2', border: '#fecdd3', color: '#991b1b', icon: '🚨', label: 'Overdue' },
    warning:  { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: '⏰', label: 'Due Soon' },
    critical: { bg: '#fff1f2', border: '#fecdd3', color: '#991b1b', icon: '🔴', label: 'Critical' },
    success:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#065f46', icon: '✅', label: 'Resolved' },
    info:     { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af', icon: 'ℹ️', label: 'Update' },
  };

  const unread = notifications.filter(n =>
    n.type === 'overdue' || n.type === 'warning' || n.type === 'critical'
  ).length;

  const deadlineLabels = { 7: '7 days', 14: '14 days', 30: '30 days' };

  return (
    <div style={{ position: 'relative' }}>

      <button
        onClick={() => setShow(!show)}
        style={{
          background: show ? 'rgba(233,69,96,0.15)' : 'rgba(255,255,255,0.06)',
          border: show ? '1px solid rgba(233,69,96,0.4)' : '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.4rem 0.6rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🔔</span>
        {unread > 0 && (
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#e94560',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            border: '2px solid #0f172a'
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {show && (
        <div style={{
          position: 'absolute',
          right: '0',
          top: 'calc(100% + 8px)',
          width: '360px',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          zIndex: 1000,
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}>

          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
            background: 'white',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#0f172a' }}>
                  Notifications
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0.15rem 0 0' }}>
                  Today: {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setShow(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  color: '#64748b',
                  fontWeight: 700
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {[
                { label: 'Urgent', count: notifications.filter(n => n.type === 'overdue' || n.type === 'critical').length, color: '#ef4444', bg: '#fee2e2' },
                { label: 'Due Soon', count: notifications.filter(n => n.type === 'warning').length, color: '#f59e0b', bg: '#fef3c7' },
                { label: 'Updates', count: notifications.filter(n => n.type === 'info' || n.type === 'success').length, color: '#10b981', bg: '#d1fae5' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, background: s.bg, borderRadius: '8px',
                  padding: '0.4rem 0.6rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: '0.65rem', color: s.color, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', flexShrink: 0 }}>Deadline:</span>
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDeadline(d)}
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: deadline === d ? '#e94560' : '#f1f5f9',
                    color: deadline === d ? 'white' : '#64748b',
                    transition: 'all 0.15s'
                  }}
                >
                  {deadlineLabels[d]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#64748b' }}>All caught up!</div>
                <div style={{ fontSize: '0.8rem' }}>No urgent notifications right now</div>
              </div>
            ) : (
              notifications.map((n, i) => {
                const s = typeStyles[n.type] || typeStyles.info;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderBottom: '1px solid #f8fafc',
                      background: s.bg,
                      borderLeft: `3px solid ${s.border}`,
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }}>{s.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 700, color: s.color,
                            background: s.border, padding: '0.1rem 0.4rem',
                            borderRadius: '4px', textTransform: 'uppercase'
                          }}>
                            {s.label}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {new Date(n.time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#0f172a', lineHeight: 1.4 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          {new Date(n.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          {lastUpdated && (
            <div style={{
              padding: '0.6rem 1.25rem',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.7rem',
              color: '#94a3b8',
              textAlign: 'center',
              background: '#fafafa',
              flexShrink: 0
            }}>
              Last updated: {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · Auto-refreshes every 30s
            </div>
          )}
        </div>
      )}
    </div>
  );
}