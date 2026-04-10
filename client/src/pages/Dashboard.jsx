import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6b7280'];

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { setReports(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === 'New').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    closed: reports.filter(r => r.status === 'Closed').length,
    critical: reports.filter(r => r.priority === 'Critical').length,
    high: reports.filter(r => r.priority === 'High').length,
  };

  const resolutionRate = stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const recent = reports.slice(0, 5);

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

  const getBadgeClass = (status) => {
    if (status === 'New') return 'badge badge-new';
    if (status === 'In Progress') return 'badge badge-progress';
    if (status === 'Resolved') return 'badge badge-resolved';
    return 'badge badge-closed';
  };

  const statCards = [
    { label: 'Total Reports', value: stats.total, color: '#3b82f6', icon: '📋' },
    { label: 'New', value: stats.new, color: '#f59e0b', icon: '🆕' },
    { label: 'In Progress', value: stats.inProgress, color: '#8b5cf6', icon: '🔧' },
    { label: 'Resolved', value: stats.resolved, color: '#10b981', icon: '✅' },
  ];

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem', fontWeight: 700 }}>
            Welcome back, {user?.name} 👋
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <Link to="/reports/new" className="btn btn-primary" style={{ fontSize: '0.95rem' }}>
          + New Report
        </Link>
      </div>

      {/* CRITICAL ALERT */}
      {stats.critical > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 500
        }}>
          🚨 {stats.critical} critical {stats.critical === 1 ? 'issue needs' : 'issues need'} immediate attention
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 2px 15px rgba(0,0,0,0.07)',
            borderLeft: `5px solid ${s.color}`,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS + RECENT */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>

        {/* RECENT REPORTS */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Reports</h2>
            <Link to="/reports" style={{ color: '#e94560', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recent.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No reports yet</p>
            )}
            {recent.map(r => (
              <Link key={r._id} to={`/reports/${r._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '0.85rem 1rem',
                  border: '1px solid #f1f5f9', borderRadius: '10px',
                  background: '#fafafa', transition: 'background 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      {r.category} • {r.location}
                    </div>
                  </div>
                  <span className={getBadgeClass(r.status)}>{r.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Status Overview
          </h2>
          {statusChartData.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value"
                  outerRadius={85} innerRadius={40}
                  paddingAngle={3}>
                  {statusChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ADMIN PANEL */}
      {user?.role === 'admin' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          color: 'white', padding: '1.75rem',
          borderRadius: '14px', marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Admin Overview
          </h2>
          <div className="grid-3">
            {[
              { label: 'Critical Issues', value: stats.critical, color: '#ef4444' },
              { label: 'High Priority', value: stats.high, color: '#f59e0b' },
              { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#10b981' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '1.25rem',
                borderTop: `3px solid ${item.color}`
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: item.color }}>
                  {item.value}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BAR CHART */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Reports by Category
        </h2>
        {categoryData.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#e94560" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}