import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  'New': { bg: '#dbeafe', color: '#1d4ed8' },
  'In Progress': { bg: '#fef3c7', color: '#92400e' },
  'Resolved': { bg: '#d1fae5', color: '#065f46' },
  'Closed': { bg: '#f3f4f6', color: '#374151' }
};

const PRIORITY_COLORS = {
  'Low': { bg: '#d1fae5', color: '#065f46' },
  'Medium': { bg: '#fef3c7', color: '#92400e' },
  'High': { bg: '#fee2e2', color: '#991b1b' },
  'Critical': { bg: '#7f1d1d', color: 'white' }
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

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const thisWeek = reports.filter(r => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const recent = reports.slice(0, 8);

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

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'
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

        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '1.5rem', marginBottom: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔧</span>
                <span style={{ fontSize: '0.75rem', color: '#e94560', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  St Mary's University — Campus Maintenance
                </span>
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                Keeping our campus safe, clean and functional
              </h2>
              <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0, lineHeight: 1.7, maxWidth: '520px' }}>
                FixMyCampus makes it easy to report maintenance issues across all university buildings.
                Whether it's a broken light, a leaking pipe, or a safety hazard — submit a report in seconds
                and our facilities team will take care of it. Track progress, get email updates, and help
                make St Mary's a better place for everyone.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {[
                  { text: '📋 Submit a Report', link: '/reports/new', bg: '#e94560', color: 'white' },
                  { text: '📖 How it works', link: '/guidance', bg: '#f1f5f9', color: '#475569' },
                ].map((b, i) => (
                  <Link key={i} to={b.link} style={{
                    padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.8rem',
                    fontWeight: 600, textDecoration: 'none', background: b.bg, color: b.color
                  }}>
                    {b.text}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Reports This Week', value: thisWeek, color: '#6366f1', bg: '#eef2ff', icon: '📅' },
                { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#10b981', bg: '#f0fdf4', icon: '✅' },
                { label: 'Open Issues', value: stats.new + stats.inProgress, color: '#f59e0b', bg: '#fffbeb', icon: '🔓' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.bg, borderRadius: '10px',
                  padding: '0.85rem 1.1rem', textAlign: 'center', minWidth: '90px'
                }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {stats.critical > 0 && (
          <div style={{
            background: '#fff1f2', border: '1px solid #fecdd3',
            borderLeft: '4px solid #ef4444', color: '#991b1b',
            padding: '0.85rem 1.25rem', borderRadius: '8px',
            marginBottom: '1.5rem', display: 'flex',
            alignItems: 'center', gap: '0.6rem', fontWeight: 500, fontSize: '0.9rem'
          }}>
            ⚠️ {stats.critical} critical {stats.critical === 1 ? 'issue requires' : 'issues require'} immediate attention
            <Link to="/reports" style={{ marginLeft: 'auto', color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
              View →
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Reports', value: stats.total, icon: '📋', color: '#6366f1', bg: '#eef2ff', link: '/reports' },
            { label: 'New', value: stats.new, icon: '🆕', color: '#3b82f6', bg: '#eff6ff', link: '/reports' },
            { label: 'In Progress', value: stats.inProgress, icon: '🔧', color: '#f59e0b', bg: '#fffbeb', link: '/reports' },
            { label: 'Resolved', value: stats.resolved, icon: '✅', color: '#10b981', bg: '#f0fdf4', link: '/reports' },
          ].map((s, i) => (
            <Link key={i} to={s.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', borderRadius: '12px', padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'}
              >
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
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

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
                  {['Title', 'Building', 'Priority', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r._id}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      <Link to={`/reports/${r._id}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 500, fontSize: '0.85rem' }}>
                        {r.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>{r.building}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
                        background: PRIORITY_COLORS[r.priority]?.bg,
                        color: PRIORITY_COLORS[r.priority]?.color
                      }}>
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
                        background: STATUS_COLORS[r.status]?.bg,
                        color: STATUS_COLORS[r.status]?.color
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { label: '+ Submit New Report', link: '/reports/new', bg: '#e94560', color: 'white' },
                  { label: '📋 View All Reports', link: '/reports', bg: '#eff6ff', color: '#1d4ed8' },
                  { label: '📊 View Analytics', link: '/analytics', bg: '#f0fdf4', color: '#065f46' },
                  { label: '📖 Reporting Guidance', link: '/guidance', bg: '#fffbeb', color: '#92400e' },
                ].map((a, i) => (
                  <Link key={i} to={a.link} style={{
                    display: 'block', padding: '0.65rem 1rem', borderRadius: '8px',
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                    background: a.bg, color: a.color, transition: 'opacity 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Performance
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#10b981', desc: 'of all reports resolved' },
                  { label: 'Critical Issues', value: stats.critical, color: '#ef4444', desc: 'need immediate action' },
                  { label: 'High Priority', value: stats.high, color: '#f59e0b', desc: 'awaiting resolution' },
                  { label: 'Total Closed', value: stats.closed, color: '#6b7280', desc: 'reports completed' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                      background: item.color + '15', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 700, color: item.color, fontSize: '0.9rem'
                    }}>
                      {item.value}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }}>{item.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}