import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#e94560', '#3b82f6', '#10b981', '#f59e0b'];

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
    high: reports.filter(r => r.priority === 'High').length,
  };

  const recent = reports.slice(0, 5);
  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const statusChartData = [
    { name: 'New', value: stats.new },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved },
    { name: 'Closed', value: reports.filter(r => r.status === 'Closed').length },
  ].filter(d => d.value > 0);

  const categoryData = Object.entries(
    reports.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {})
  ).map(([name, count]) => ({ name, count })).slice(0, 5);

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
      <div style={{ background:'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius:'16px', padding:'2rem', marginBottom:'2rem', color:'white' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', fontWeight:'700', marginBottom:'0.5rem' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color:'#aaa', fontSize:'0.95rem' }}>
              {new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
            <p style={{ color:'#ccc', marginTop:'0.5rem', fontSize:'0.9rem' }}>
              You have <strong style={{ color:'#e94560' }}>{stats.new} new</strong> and <strong style={{ color:'#f59e0b' }}>{stats.inProgress} in-progress</strong> reports requiring attention.
            </p>
          </div>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <Link to="/reports/new" className="btn btn-primary" style={{ textDecoration:'none' }}>+ New Report</Link>
            <Link to="/reports" className="btn btn-outline" style={{ textDecoration:'none' }}>View All</Link>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom:'2rem' }}>
        <div className="stat-card" style={{ borderColor:'#3b82f6' }}>
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-number" style={{ color:'#3b82f6' }}>{stats.total}</div>
            <div className="stat-label">Total Reports</div>
            <div style={{ fontSize:'0.75rem', color:'#999', marginTop:'0.25rem' }}>All time</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderColor:'#f59e0b' }}>
          <div className="stat-icon">🆕</div>
          <div>
            <div className="stat-number" style={{ color:'#f59e0b' }}>{stats.new}</div>
            <div className="stat-label">New Reports</div>
            <div style={{ fontSize:'0.75rem', color:'#999', marginTop:'0.25rem' }}>Awaiting action</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderColor:'#8b5cf6' }}>
          <div className="stat-icon">⚙️</div>
          <div>
            <div className="stat-number" style={{ color:'#8b5cf6' }}>{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
            <div style={{ fontSize:'0.75rem', color:'#999', marginTop:'0.25rem' }}>Being resolved</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderColor:'#10b981' }}>
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-number" style={{ color:'#10b981' }}>{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
            <div style={{ fontSize:'0.75rem', color:'#999', marginTop:'0.25rem' }}>{resolutionRate}% rate</div>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div style={{ background:'linear-gradient(135deg, #1a1a2e, #16213e)', color:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'2rem' }}>
          <h2 style={{ fontWeight:'700', marginBottom:'1rem', fontSize:'1.2rem' }}>🛡️ Admin Overview</h2>
          <div className="grid-3">
            <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:'700', color:'#e94560' }}>{stats.critical}</div>
              <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Critical Issues</div>
              <div style={{ fontSize:'0.75rem', color:'#666', marginTop:'0.25rem' }}>Immediate action needed</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:'700', color:'#f59e0b' }}>{stats.high}</div>
              <div style={{ fontSize:'0.85rem', color:'#aaa' }}>High Priority</div>
              <div style={{ fontSize:'0.75rem', color:'#666', marginTop:'0.25rem' }}>Action required soon</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:'700', color:'#10b981' }}>{resolutionRate}%</div>
              <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Resolution Rate</div>
              <div style={{ fontSize:'0.75rem', color:'#666', marginTop:'0.25rem' }}>Overall performance</div>
            </div>
          </div>
        </div>
      )}

      {stats.critical > 0 && (
        <div style={{ background:'#7f1d1d', color:'white', padding:'1rem 1.5rem', borderRadius:'12px', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontSize:'1.5rem' }}>🚨</span>
          <div>
            <strong>{stats.critical} Critical issue(s)</strong> require immediate attention!
            <Link to="/reports?priority=Critical" style={{ color:'#fca5a5', marginLeft:'0.5rem', textDecoration:'none' }}>View now →</Link>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom:'2rem' }}>
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:'700' }}>📋 Recent Reports</h2>
            <Link to="/reports" style={{ color:'#e94560', fontSize:'0.85rem', textDecoration:'none' }}>View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <h3>No reports yet</h3>
              <p>Submit the first maintenance report!</p>
              <Link to="/reports/new" className="btn btn-primary" style={{ marginTop:'1rem', display:'inline-block', textDecoration:'none' }}>Submit Report</Link>
            </div>
          ) : (
            recent.map(r => (
              <Link to={`/reports/${r._id}`} key={r._id} style={{ textDecoration:'none', color:'inherit' }}>
                <div style={{ padding:'0.75rem', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f9f9f9'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div>
                    <div style={{ fontWeight:'600', fontSize:'0.95rem' }}>{r.title}</div>
                    <div style={{ color:'#666', fontSize:'0.8rem', marginTop:'0.2rem' }}>
                      📍 {r.building} • 🏷️ {r.category}
                    </div>
                    <div style={{ color:'#999', fontSize:'0.75rem', marginTop:'0.1rem' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-GB')}
                    </div>
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

        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div className="card">
            <h2 style={{ fontSize:'1.1rem', fontWeight:'700', marginBottom:'1rem' }}>🎯 Status Overview</h2>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                    {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No data yet</p></div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize:'1.1rem', fontWeight:'700', marginBottom:'1rem' }}>📊 Top Categories</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize:10 }} angle={-20} textAnchor="end" height={40} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#e94560" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No data yet</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ borderLeft:'4px solid #3b82f6', textAlign:'center', padding:'1.5rem' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🔧</div>
          <h3 style={{ fontWeight:'700', marginBottom:'0.5rem' }}>Submit Report</h3>
          <p style={{ color:'#666', fontSize:'0.85rem', marginBottom:'1rem' }}>Report a new maintenance issue on campus</p>
          <Link to="/reports/new" className="btn btn-primary" style={{ textDecoration:'none', display:'block' }}>Submit Now</Link>
        </div>
        <div className="card" style={{ borderLeft:'4px solid #10b981', textAlign:'center', padding:'1.5rem' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>📊</div>
          <h3 style={{ fontWeight:'700', marginBottom:'0.5rem' }}>Analytics</h3>
          <p style={{ color:'#666', fontSize:'0.85rem', marginBottom:'1rem' }}>View trends and insights on maintenance data</p>
          <Link to="/analytics" className="btn btn-success" style={{ textDecoration:'none', display:'block' }}>View Analytics</Link>
        </div>
        <div className="card" style={{ borderLeft:'4px solid #f59e0b', textAlign:'center', padding:'1.5rem' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>📖</div>
          <h3 style={{ fontWeight:'700', marginBottom:'0.5rem' }}>Guidance</h3>
          <p style={{ color:'#666', fontSize:'0.85rem', marginBottom:'1rem' }}>Learn how to report issues correctly</p>
          <Link to="/guidance" className="btn btn-warning" style={{ textDecoration:'none', display:'block' }}>View Guide</Link>
        </div>
      </div>
    </div>
  );
}