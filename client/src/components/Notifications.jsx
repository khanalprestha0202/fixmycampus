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
        res.data.forEach(r => {
          if (r.priority === 'Critical' && r.status === 'New') {
            notifs.push({ id: r._id, message: `CRITICAL: "${r.title}" needs immediate attention!`, type: 'critical', time: r.createdAt });
          }
          if (r.status === 'In Progress') {
            notifs.push({ id: r._id, message: `"${r.title}" is now In Progress`, type: 'info', time: r.updatedAt });
          }
          if (r.status === 'Resolved') {
            notifs.push({ id: r._id, message: `"${r.title}" has been Resolved!`, type: 'success', time: r.updatedAt });
          }
        });
        setNotifications(notifs.slice(0, 10));
      } catch {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const unread = notifications.length;

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setShow(!show)} style={{ background:'none', border:'none', cursor:'pointer', position:'relative', padding:'0.5rem' }}>
        <span style={{ fontSize:'1.3rem' }}>🔔</span>
        {unread > 0 && (
          <span style={{ position:'absolute', top:'0', right:'0', background:'#e94560', color:'white', borderRadius:'50%', width:'18px', height:'18px', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {show && (
        <div style={{ position:'absolute', right:'0', top:'100%', width:'320px', background:'white', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', zIndex:1000, maxHeight:'400px', overflowY:'auto' }}>
          <div style={{ padding:'1rem', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontWeight:'700', fontSize:'1rem' }}>Notifications</h3>
            <button onClick={() => setShow(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem' }}>×</button>
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding:'1.5rem', textAlign:'center', color:'#666' }}>No notifications</div>
          ) : (
            notifications.map((n, i) => (
              <div key={i} style={{ padding:'0.75rem 1rem', borderBottom:'1px solid #f9f9f9', background: n.type === 'critical' ? '#fff5f5' : n.type === 'success' ? '#f0fdf4' : '#eff6ff' }}>
                <div style={{ fontSize:'0.85rem', fontWeight:'500', color: n.type === 'critical' ? '#991b1b' : n.type === 'success' ? '#065f46' : '#1e40af' }}>
                  {n.type === 'critical' ? '🚨' : n.type === 'success' ? '✅' : 'ℹ️'} {n.message}
                </div>
                <div style={{ fontSize:'0.75rem', color:'#999', marginTop:'0.25rem' }}>{new Date(n.time).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}