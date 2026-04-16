import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_COLORS = {
  'New': '#3b82f6',
  'In Progress': '#f59e0b',
  'Resolved': '#10b981',
  'Closed': '#6b7280'
};

const PRIORITY_COLORS = {
  'Low': '#10b981',
  'Medium': '#f59e0b',
  'High': '#ef4444',
  'Critical': '#7f1d1d'
};

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    axios.get('/api/reports', {
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

  const recent = reports.slice(0, 6);

  const statusChartData = [
    { name: 'New', value: stats.new, color: '#3b82f6' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Resolved', value: stats.resolved, color: '#10b981' },
    { name: 'Closed', value: stats.closed, color: '#6b7280' },
  ].filter(d => d.value > 0);

  const categoryData = Object.entries(
    reports.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const priorityData = Object.entries(
    reports.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <div>Loading dashboard...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* TOP BAR */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              Welcome back, <strong>{user?.name}</strong> — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link to="/reports/new" style={{
            background: '#e94560', color: 'white', padding: '0.6rem 1.25rem',
            borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            + New Report
          </Link>
        </div>

        {/* CRITICAL ALERT */}
        {stats.critical > 0 && (
          <div style={{
            background: '#fff1f2', border: '1px solid #fecdd3',
            borderLeft: '4px solid #ef4444', color: '#991b1b',
            padding: '0.85rem 1.25rem', borderRadius: '8px',
            marginBottom: '1.5rem', display: 'flex',
            alignItems: 'center', gap: '0.6rem', fontWeight: 500,
            fontSize: '0.9rem'
          }}>
            ⚠️ {stats.critical} critical {stats.critical === 1 ? 'issue requires' : 'issues require'} immediate attention
            <Link to="/reports" style={{ marginLeft: 'auto', color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
              View →
            </Link>
          </div>
        )}

        {/* STAT CARDS */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem', marginBottom: '1.5rem'
        }}>
          {[
            { label: 'Total Reports', value: stats.total, icon: '📋', color: '#6366f1', bg: '#eef2ff' },
            { label: 'New', value: stats.new, icon: '🆕', color: '#3b82f6', bg: '#eff6ff' },
            { label: 'In Progress', value: stats.inProgress, icon: '🔧', color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Resolved', value: stats.resolved, icon: '✅', color: '#10b981', bg: '#f0fdf4' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: s.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECOND ROW — RECENT + PIE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* RECENT REPORTS TABLE */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Reports</h2>
              <Link to="/reports" style={{ fontSize: '0.8rem', color: '#e94560', textDecoration: 'none', fontWeight: 600 }}>
                View all →
              </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Title', 'Category', 'Priority', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      <Link to={`/reports/${r._id}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 500, fontSize: '0.875rem' }}>
                        {r.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>{r.category}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: 600,
                        background: PRIORITY_COLORS[r.priority] + '20',
                        color: PRIORITY_COLORS[r.priority]
                      }}>
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: 600,
                        background: STATUS_COLORS[r.status] + '20',
                        color: STATUS_COLORS[r.status]
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No reports yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* STATUS PIE */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Status Breakdown
            </h2>
            {statusChartData.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusChartData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {statusChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* THIRD ROW — BAR + ADMIN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* CATEGORY BAR */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Reports by Category
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                <Bar dataKey="count" fill="#e94560" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ADMIN STATS */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Performance Summary
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#10b981', desc: 'of all reports resolved' },
                { label: 'Critical Issues', value: stats.critical, color: '#ef4444', desc: 'need immediate action' },
                { label: 'High Priority', value: stats.high, color: '#f59e0b', desc: 'awaiting resolution' },
                { label: 'Total Closed', value: stats.closed, color: '#6b7280', desc: 'reports completed' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: item.color + '15', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: item.color, fontSize: '1rem', flexShrink: 0
                  }}>
                    {item.value}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{item.label}</div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}