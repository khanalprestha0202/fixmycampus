import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setReports(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === 'New').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    critical: reports.filter(r => r.priority === 'Critical').length,
  };

  const recent = reports.slice(0, 5);

  const getBadgeClass = (status) => {
    if (status === 'New') return 'badge badge-new';
    if (status === 'In Progress') return 'badge badge-progress';
    if (status === 'Resolved') return 'badge badge-resolved';
    return 'badge badge-closed';
  };

  const getPriorityClass = (priority) => {
    if (priority === 'Low') return 'badge badge-low';
    if (priority === 'Medium') return 'badge badge-medium';
    if (priority === 'High') return 'badge badge-high';
    return 'badge badge-critical';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name}!</h1>
          <p className="page-subtitle">Here is an overview of campus maintenance reports</p>
        </div>
        <Link to="/reports/new" className="btn btn-primary">+ Submit New Report</Link>
      </div>

      <div className="grid-4" style={{ marginBottom:'2rem' }}>
        <div className="stat-card" style={{ borderColor:'#3b82f6' }}>
          <div className="stat-icon">📋</div>
          <div><div className="stat-number" style={{ color:'#3b82f6' }}>{stats.total}</div><div className="stat-label">Total Reports</div></div>
        </div>
        <div className="stat-card" style={{ borderColor:'#f59e0b' }}>
          <div className="stat-icon">🆕</div>
          <div><div className="stat-number" style={{ color:'#f59e0b' }}>{stats.new}</div><div className="stat-label">New Reports</div></div>
        </div>
        <div className="stat-card" style={{ borderColor:'#8b5cf6' }}>
          <div className="stat-icon">⚙️</div>
          <div><div className="stat-number" style={{ color:'#8b5cf6' }}>{stats.inProgress}</div><div className="stat-label">In Progress</div></div>
        </div>
        <div className="stat-card" style={{ borderColor:'#10b981' }}>
          <div className="stat-icon">✅</div>
          <div><div className="stat-number" style={{ color:'#10b981' }}>{stats.resolved}</div><div className="stat-label">Resolved</div></div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div style={{ background:'linear-gradient(135deg, #1a1a2e, #16213e)', color:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'2rem' }}>
          <h2 style={{ fontWeight:'700', marginBottom:'1rem', fontSize:'1.2rem' }}>Admin Panel</h2>
          <div className="grid-3">
            <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:'700', color:'#e94560' }}>{stats.critical}</div>
              <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Critical Issues</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:'700', color:'#f59e0b' }}>{stats.new}</div>
              <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Awaiting Action</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:'700', color:'#10b981' }}>{stats.total > 0 ? Math.round((stats.resolved/stats.total)*100) : 0}%</div>
              <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Resolution Rate</div>
            </div>
          </div>
        </div>
      )}

      {stats.critical > 0 && (
        <div style={{ background:'#7f1d1d', color:'white', padding:'1rem 1.5rem', borderRadius:'12px', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontSize:'1.5rem' }}>🚨</span>
          <div><strong>{stats.critical} Critical issue(s)</strong> require immediate attention!</div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:'700' }}>Recent Reports</h2>
            <Link to="/reports" style={{ color:'#e94560', fontSize:'0.9rem', textDecoration:'none' }}>View all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state"><h3>No reports yet</h3><p>Submit the first maintenance report!</p></div>
          ) : (
            recent.map(r => (
              <Link to={`/reports/${r._id}`} key={r._id} style={{ textDecoration:'none', color:'inherit' }}>
                <div style={{ padding:'0.75rem', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:'600', fontSize:'0.95rem' }}>{r.title}</div>
                    <div style={{ color:'#666', fontSize:'0.8rem' }}>{r.building} - {r.category}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.3rem' }}>
                    <span className={getBadgeClass(r.status)}>{r.status}</span>
                    <span className={getPriorityClass(r.priority)}>{r.priority}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize:'1.2rem', fontWeight:'700', marginBottom:'1rem' }}>Quick Actions</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            <Link to="/reports/new" className="btn btn-primary" style={{ textAlign:'center', textDecoration:'none' }}>Submit New Report</Link>
            <Link to="/reports" className="btn btn-outline" style={{ textAlign:'center', textDecoration:'none' }}>View All Reports</Link>
            <Link to="/analytics" className="btn btn-secondary" style={{ textAlign:'center', textDecoration:'none', background:'#8b5cf6' }}>View Analytics</Link>
            <Link to="/guidance" className="btn btn-secondary" style={{ textAlign:'center', textDecoration:'none' }}>Reporting Guidance</Link>
          </div>
          <div style={{ marginTop:'1.5rem', background:'#f0fdf4', padding:'1rem', borderRadius:'8px' }}>
            <h3 style={{ fontSize:'0.95rem', fontWeight:'600', color:'#065f46', marginBottom:'0.5rem' }}>Status Summary</h3>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'0.3rem' }}>
              <span>New</span><span style={{ fontWeight:'600', color:'#1d4ed8' }}>{stats.new}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'0.3rem' }}>
              <span>In Progress</span><span style={{ fontWeight:'600', color:'#92400e' }}>{stats.inProgress}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem' }}>
              <span>Resolved</span><span style={{ fontWeight:'600', color:'#065f46' }}>{stats.resolved}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}