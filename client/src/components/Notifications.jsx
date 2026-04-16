import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const notifs = [];
        const now = new Date();

        res.data.forEach(r => {
          const createdAt = new Date(r.createdAt);
          const daysOld = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
          const deadlineDays = 7;
          const daysLeft = deadlineDays - daysOld;

          // OVERDUE
          if (daysLeft < 0 && r.status !== 'Resolved' && r.status !== 'Closed') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" is overdue by ${Math.abs(daysLeft)} day(s)!`,
              type: 'overdue',
              time: r.createdAt
            });
          }
          // DEADLINE WARNING — due within 2 days
          else if (daysLeft <= 2 && daysLeft >= 0 && r.status !== 'Resolved' && r.status !== 'Closed') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" deadline in ${daysLeft} day(s)!`,
              type: 'warning',
              time: r.createdAt
            });
          }
          // CRITICAL
          if (r.priority === 'Critical' && r.status === 'New') {
            notifs.push({
              id: r._id,
              message: `CRITICAL: "${r.title}" needs immediate attention!`,
              type: 'critical',
              time: r.createdAt
            });
          }
          // IN PROGRESS
          if (r.status === 'In Progress') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" is now In Progress`,
              type: 'info',
              time: r.updatedAt
            });
          }
          // RESOLVED
          if (r.status === 'Resolved') {
            notifs.push({
              id: r._id,
              message: `"${r.title}" has been Resolved!`,
              type: 'success',
              time: r.updatedAt
            });
          }
        });

        // Sort by time, newest first
        notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(notifs.slice(0, 15));
      } catch {}
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const typeStyles = {
    overdue:  { bg: '#fff1f2', color: '#991b1b', icon: '🚨' },
    warning:  { bg: '#fffbeb', color: '#92400e', icon: '⏰' },
    critical: { bg: '#fff1f2', color: '#991b1b', icon: '🔴' },
    success:  { bg: '#f0fdf4', color: '#065f46', icon: '✅' },
    info:     { bg: '#eff6ff', color: '#1e40af', icon: 'ℹ️' },
  };

  const unread = notifications.filter(n =>
    n.type === 'overdue' || n.type === 'warning' || n.type === 'critical'
  ).length;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShow(!show)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        position: 'relative', padding: '0.5rem'
      }}>
        <span style={{ fontSize: '1.3rem' }}>🔔</span>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '0', right: '0',
            background: '#e94560', color: 'white',
            borderRadius: '50%', width: '18px', height: '18px',
            fontSize: '0.7rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: '700'
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {show && (
        <div style={{
          position: 'absolute', right: '0', top: '100%',
          width: '340px', background: 'white', borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000,
          maxHeight: '450px', overflowY: 'auto'
        }}>
          <div style={{
            padding: '1rem', borderBottom: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', top: 0, background: 'white'
          }}>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '1rem', margin: 0 }}>Notifications</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Reports have a 7-day resolution deadline
              </p>
            </div>
            <button onClick={() => setShow(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'
            }}>×</button>
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <div>All reports are on track!</div>
            </div>
          ) : (
            notifications.map((n, i) => {
              const style = typeStyles[n.type] || typeStyles.info;
              return (
                <div key={i} style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #f9f9f9',
                  background: style.bg
                }}>
                  <div style={{
                    fontSize: '0.85rem', fontWeight: '500', color: style.color
                  }}>
                    {style.icon} {n.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {new Date(n.time).toLocaleString('en-GB')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}