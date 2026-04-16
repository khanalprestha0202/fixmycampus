import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Guidance() {
  const [guidance, setGuidance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    axios.get('/api/guidance', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setGuidance(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const icons = { 'Reporting Tips':'💡', 'Required Information':'📋', 'Safety':'🚨', 'Photos':'📷', 'Tracking':'🔍', 'Privacy':'🔒' };

  if (loading) return <div className="loading">Loading guidance...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Reporting Guidance</h1>
      <p className="page-subtitle">Everything you need to know about submitting and tracking maintenance reports</p>

      <div className="grid-2" style={{ marginBottom:'2rem' }}>
        {guidance.map(g => (
          <div key={g.id} className="card" style={{ borderLeft:'4px solid #e94560' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
              <span style={{ fontSize:'1.5rem' }}>{icons[g.category] || '📌'}</span>
              <div>
                <h3 style={{ fontWeight:'700', fontSize:'1rem' }}>{g.title}</h3>
                <span className="badge" style={{ background:'#fef3c7', color:'#92400e', fontSize:'0.75rem' }}>{g.category}</span>
              </div>
            </div>
            <p style={{ color:'#555', lineHeight:'1.6', fontSize:'0.95rem' }}>{g.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}