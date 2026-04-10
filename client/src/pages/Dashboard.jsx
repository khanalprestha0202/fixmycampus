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
  ).map(([name, count]) => ({ name, count })).slice(0, 5);

  // 🎨 Badge styles
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

      {/* 🔥 HEADER */}
      <div style={{
        background:'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius:'16px',
        padding:'2rem',
        marginBottom:'2rem',
        color:'white'
      }}>
        <h1 style={{ fontSize:'1.8rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color:'#aaa' }}>
          {new Date().toLocaleDateString('en-GB', {
            weekday:'long', year:'numeric', month:'long', day:'numeric'
          })}
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid-4" style={{ marginBottom:'2rem' }}>
        <div className="stat-card"><h2>{stats.total}</h2><p>Total</p></div>
        <div className="stat-card"><h2>{stats.new}</h2><p>New</p></div>
        <div className="stat-card"><h2>{stats.inProgress}</h2><p>In Progress</p></div>
        <div className="stat-card"><h2>{stats.resolved}</h2><p>Resolved</p></div>
      </div>

      {/* 🛡️ ADMIN PANEL */}
      {user?.role === 'admin' && (
        <div style={{
          background:'linear-gradient(135deg, #1a1a2e, #16213e)',
          color:'white',
          padding:'1.5rem',
          borderRadius:'12px',
          marginBottom:'2rem'
        }}>
          <h2>🛡️ Admin Overview</h2>

          <div className="grid-3">
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

      {/* 🚨 ALERT */}
      {stats.critical > 0 && (
        <div style={{ background:'#7f1d1d', color:'white', padding:'1rem', borderRadius:'10px', marginBottom:'1.5rem' }}>
          🚨 {stats.critical} critical issues need attention!
        </div>
      )}

      {/* 📋 RECENT */}
      <div className="grid-2" style={{ marginBottom:'2rem' }}>
        <div className="card">
          <h2>Recent Reports</h2>
          {recent.map(r => (
            <Link key={r._id} to={`/reports/${r._id}`}>
              <div>
                {r.title} - <span className={getBadgeClass(r.status)}>{r.status}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* 📊 PIE CHART */}
        <div className="card">
          <h2>Status Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value">
                {statusChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 BAR CHART */}
      <div className="card">
        <h2>Top Categories</h2>
        <ResponsiveContainer width="100%" height={250}>
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