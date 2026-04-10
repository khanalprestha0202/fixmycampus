import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#e94560', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/reports/stats/analytics', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/reports', { headers: { Authorization: `Bearer ${token}` } })
    ]).then(([statsRes, reportsRes]) => {
      setStats(statsRes.data);
      setReports(reportsRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!stats) return <div className="loading">No data available</div>;

  const statusData = stats.byStatus.map(s => ({ name: s._id, value: s.count }));
  const categoryData = stats.byCategory.map(s => ({ name: s._id, count: s.count }));
  const buildingData = stats.byBuilding.map(s => ({ name: s._id, count: s.count }));
  const priorityData = stats.byPriority.map(s => ({ name: s._id, value: s.count }));

  const trendData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-GB', { day:'2-digit', month:'short' });
      const count = reports.filter(r => {
        const reportDate = new Date(r.createdAt);
        return reportDate.toDateString() === date.toDateString();
      }).length;
      last7Days.push({ date: dateStr, reports: count });
    }
    return last7Days;
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.byStatus.find(s => s._id === 'Resolved')?.count || 0) / stats.total * 100) : 0;
  const criticalCount = stats.byPriority.find(s => s._id === 'Critical')?.count || 0;
  const avgResolutionTime = reports.filter(r => r.resolvedAt).reduce((acc, r) => {
    const days = Math.round((new Date(r.resolvedAt) - new Date(r.createdAt)) / (1000 * 60 * 60 * 24));
    return acc + days;
  }, 0) / (reports.filter(r => r.resolvedAt).length || 1);

  return (
    <div className="container">
      <h1 className="page-title">Analytics Dashboard</h1>
      <p className="page-subtitle">Comprehensive insights and trends from campus maintenance reports</p>

      <div className="grid-4" style={{ marginBottom:'2rem' }}>
        <div className="stat-card" style={{ borderColor:'#3b82f6' }}>
          <div className="stat-icon">📋</div>
          <div><div className="stat-number" style={{ color:'#3b82f6' }}>{stats.total}</div><div className="stat-label">Total Reports</div></div>
        </div>
        <div className="stat-card" style={{ borderColor:'#10b981' }}>
          <div className="stat-icon">✅</div>
          <div><div className="stat-number" style={{ color:'#10b981' }}>{resolutionRate}%</div><div className="stat-label">Resolution Rate</div></div>
        </div>
        <div className="stat-card" style={{ borderColor:'#f59e0b' }}>
          <div className="stat-icon">⏱️</div>
          <div><div className="stat-number" style={{ color:'#f59e0b' }}>{avgResolutionTime.toFixed(1)}</div><div className="stat-label">Avg Days to Resolve</div></div>
        </div>
        <div className="stat-card" style={{ borderColor:'#e94560' }}>
          <div className="stat-icon">🚨</div>
          <div><div className="stat-number" style={{ color:'#e94560' }}>{criticalCount}</div><div className="stat-label">Critical Issues</div></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom:'2rem' }}>
        <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>📈 Report Submissions - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize:12 }} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="reports" stroke="#e94560" fill="#fee2e2" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2" style={{ marginBottom:'2rem' }}>
        <div className="card">
          <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>📊 Reports by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize:11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#e94560" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>🎯 Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,value}) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom:'2rem' }}>
        <div className="card">
          <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>🏢 Hotspot Buildings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={buildingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize:11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>⚡ Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,value}) => `${name}: ${value}`}>
                {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ background:'linear-gradient(135deg, #1a1a2e, #16213e)', color:'white' }}>
        <h3 style={{ fontWeight:'700', marginBottom:'1rem', fontSize:'1.2rem' }}>📊 Performance Summary</h3>
        <div className="grid-3">
          <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
            <div style={{ fontSize:'1.5rem', fontWeight:'700', color:'#10b981' }}>{stats.byStatus.find(s=>s._id==='Resolved')?.count || 0}</div>
            <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Reports Resolved</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
            <div style={{ fontSize:'1.5rem', fontWeight:'700', color:'#f59e0b' }}>{stats.byStatus.find(s=>s._id==='In Progress')?.count || 0}</div>
            <div style={{ fontSize:'0.85rem', color:'#aaa' }}>In Progress</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'8px', textAlign:'center' }}>
            <div style={{ fontSize:'1.5rem', fontWeight:'700', color:'#3b82f6' }}>{stats.byCategory.length}</div>
            <div style={{ fontSize:'0.85rem', color:'#aaa' }}>Categories Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}