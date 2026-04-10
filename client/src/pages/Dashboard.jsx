import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#e94560', '#3b82f6', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // 📊 Stats
  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === 'New').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    closed: reports.filter(r => r.status === 'Closed').length,
    critical: reports.filter(r => r.priority === 'Critical').length,
    high: reports.filter(r => r.priority === 'High').length,
  };

  const resolutionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const recent = reports.slice(0, 5);

  // 📊 Charts
  const statusChartData = [
    { name: 'New', value: stats.new },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved },
    { name: 'Closed', value: stats.closed },
  ].filter(d => d.value > 0);

  const categoryData = Object.entries(
    reports.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  // 🎨 Badge styles
  const getBadgeClass = (status) => {
    if (status === 'New') return 'badge badge-new';
    if (status === 'In Progress') return 'badge badge-progress';
    if (status === 'Resolved') return 'badge badge-resolved';
    return 'badge badge-closed';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '18px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: '#bbb', margin: 0 }}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* STATS */}
      <div className="grid-4" style={{ gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total', value: stats.total },
          { label: 'New', value: stats.new },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Resolved', value: stats.resolved }
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{
            padding: '1.5rem',
            borderRadius: '14px',
            background: '#fff',
            boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{s.value}</h2>
            <p style={{ margin: 0, color: '#666' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ALERT */}
      {stats.critical > 0 && (
        <div style={{
          background: '#7f1d1d',
          color: 'white',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          🚨 {stats.critical} critical issues need immediate attention
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>

        {/* RECENT REPORTS */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Recent Reports</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recent.map(r => (
              <Link
                key={r._id}
                to={`/reports/${r._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.9rem',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  background: '#fafafa'
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#777' }}>
                      {r.category}
                    </div>
                  </div>

                  <span className={getBadgeClass(r.status)}>
                    {r.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Status Overview</h2>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value" outerRadius={80}>
                {statusChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADMIN PANEL */}
      {user?.role === 'admin' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '14px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Admin Overview</h2>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div>
              <h2>{stats.critical}</h2>
              <p>Critical Issues</p>
            </div>

            <div>
              <h2>{stats.high}</h2>
              <p>High Priority</p>
            </div>

            <div>
              <h2>{resolutionRate}%</h2>
              <p>Resolution Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* BAR CHART */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Top Categories</h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#e94560" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}