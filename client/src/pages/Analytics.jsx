import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#e94560', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const PRIORITY_COLORS = {
  'Critical': '#ef4444', 'High': '#f59e0b', 'Medium': '#3b82f6', 'Low': '#10b981'
};

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendDays, setTrendDays] = useState(7);
  const { token } = useAuth();

  useEffect(() => {
    Promise.all([
      // Using /api/ instead of hardcoded localhost so it works on other devices too
      axios.get('/api/reports/stats/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]).then(([statsRes, reportsRes]) => {
      setStats(statsRes.data);
      setReports(reportsRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <div>Loading analytics...</div>
      </div>
    </div>
  );

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
      No analytics data available yet.
    </div>
  );

  const statusData = stats.byStatus.map(s => ({ name: s._id, value: s.count }));
  const categoryData = stats.byCategory.map(s => ({ name: s._id, count: s.count })).sort((a, b) => b.count - a.count);
  const buildingData = stats.byBuilding.map(s => ({ name: s._id, count: s.count })).sort((a, b) => b.count - a.count);
  const priorityData = stats.byPriority.map(s => ({ name: s._id, value: s.count }));

  const trendData = () => {
    const days = [];
    for (let i = trendDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const count = reports.filter(r => {
        const reportDate = new Date(r.createdAt);
        return reportDate.toDateString() === date.toDateString();
      }).length;
      days.push({ date: dateStr, reports: count });
    }
    return days;
  };

  const resolvedCount = stats.byStatus.find(s => s._id === 'Resolved')?.count || 0;
  const inProgressCount = stats.byStatus.find(s => s._id === 'In Progress')?.count || 0;
  const criticalCount = stats.byPriority.find(s => s._id === 'Critical')?.count || 0;
  const resolutionRate = stats.total > 0 ? Math.round((resolvedCount / stats.total) * 100) : 0;
  const avgResolutionTime = reports.filter(r => r.resolvedAt).reduce((acc, r) => {
    const days = Math.round((new Date(r.resolvedAt) - new Date(r.createdAt)) / (1000 * 60 * 60 * 24));
    return acc + days;
  }, 0) / (reports.filter(r => r.resolvedAt).length || 1);

  const topCategory = categoryData[0]?.name || 'N/A';
  const topBuilding = buildingData[0]?.name || 'N/A';
  const trend = trendData();
  const todayCount = trend[trend.length - 1]?.reports || 0;
  const yesterdayCount = trend[trend.length - 2]?.reports || 0;
  const trendDirection = todayCount >= yesterdayCount ? 'up' : 'down';

  // Label map so buttons show friendly names instead of just numbers
  const trendLabels = { 4: '4 Days', 14: '2 Weeks', 30: '1 Month' };

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', ...style
    }}>
      {children}
    </div>
  );

  const SectionTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>{subtitle}</p>}
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Analytics</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Insights and trends from campus maintenance reports — updated in real time
          </p>
        </div>

        {/* KEY INSIGHT BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          borderRadius: '12px', padding: '1.25rem 1.75rem',
          marginBottom: '1.5rem', color: 'white',
          display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Key Insight
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              {resolutionRate >= 50
                ? `Good progress — ${resolutionRate}% of reports have been resolved. The most active category is ${topCategory}.`
                : `Attention needed — only ${resolutionRate}% of reports resolved. Focus on ${topCategory} issues in ${topBuilding}.`}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Today's submissions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: trendDirection === 'up' ? '#10b981' : '#f59e0b' }}>
              {todayCount} {trendDirection === 'up' ? '↑' : '↓'}
            </div>
          </div>
        </div>

        {/* SUMMARY STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Reports', value: stats.total, sub: 'All time submissions', color: '#6366f1', bg: '#eef2ff', icon: '📋' },
            { label: 'Resolution Rate', value: `${resolutionRate}%`, sub: `${resolvedCount} of ${stats.total} resolved`, color: '#10b981', bg: '#f0fdf4', icon: '✅' },
            { label: 'Avg Days to Resolve', value: avgResolutionTime.toFixed(1), sub: 'Based on closed reports', color: '#f59e0b', bg: '#fffbeb', icon: 'ⱱ' },
            { label: 'Critical Issues', value: criticalCount, sub: 'Require immediate action', color: '#ef4444', bg: '#fff1f2', icon: '🚨' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: s.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.2rem'
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* TREND CHART — 4 Days / 2 Weeks / 1 Month toggle */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <SectionTitle
              title={`Report Submissions — ${trendLabels[trendDays]}`}
              subtitle="Daily volume of new maintenance reports submitted by campus users"
            />
            {/* Date range buttons — 4 Days, 2 Weeks, 1 Month */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[4, 14, 30].map(d => (
                <button key={d} onClick={() => setTrendDays(d)} style={{
                  padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem',
                  fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: trendDays === d ? '#e94560' : '#f1f5f9',
                  color: trendDays === d ? 'white' : '#64748b'
                }}>
                  {trendLabels[d]}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData()}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e94560" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '0.85rem' }} />
              <Area type="monotone" dataKey="reports" stroke="#e94560" strokeWidth={2.5} fill="url(#colorReports)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* CATEGORY + STATUS CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Card>
            <SectionTitle title="Reports by Category" subtitle={`${topCategory} is the most reported issue type on campus`} />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-20} textAnchor="end" height={50} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                <Bar dataKey="count" fill="#e94560" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <SectionTitle title="Status Distribution" subtitle={`${resolutionRate}% resolution rate — ${inProgressCount} reports currently being actioned`} />
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* BUILDINGS + PRIORITY CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Card>
            <SectionTitle title="Hotspot Buildings" subtitle={`${topBuilding} has the highest number of reported issues`} />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={buildingData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <SectionTitle title="Priority Breakdown" subtitle={`${criticalCount} critical ${criticalCount === 1 ? 'issue requires' : 'issues require'} immediate attention`} />
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {priorityData.map((entry, i) => <Cell key={i} fill={PRIORITY_COLORS[entry.name] || COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* PERFORMANCE SUMMARY */}
        <Card>
          <SectionTitle title="Performance Summary" subtitle="Overall health of the campus maintenance reporting system" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Reports Resolved', value: resolvedCount, color: '#10b981', desc: 'Successfully closed' },
              { label: 'In Progress', value: inProgressCount, color: '#f59e0b', desc: 'Currently being handled' },
              { label: 'Categories Active', value: stats.byCategory.length, color: '#3b82f6', desc: 'Issue types reported' },
              { label: 'Buildings Affected', value: stats.byBuilding.length, color: '#8b5cf6', desc: 'Campus locations' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#f8fafc', borderRadius: '10px',
                padding: '1.25rem', borderLeft: `4px solid ${item.color}`
              }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
