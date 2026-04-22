import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status:'', category:'', priority:'', search:'' });

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);

      const res = await axios.get(`/api/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data = res.data;
      if (filters.search) {
        data = data.filter(r =>
          r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.building.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      setReports(data);
    } catch { toast.error('Failed to load reports'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const exportCSV = () => {
    const headers = ['Title','Category','Building','Location','Status','Priority','Reported By','Date'];
    const rows = reports.map(r => [r.title, r.category, r.building, r.location, r.status, r.priority, r.reportedBy, new Date(r.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fixmycampus-reports.csv'; a.click();
    toast.success('Reports exported!');
  };

  const getBadge = (status) => {
    const map = { 'New':'badge-new', 'In Progress':'badge-progress', 'Resolved':'badge-resolved', 'Closed':'badge-closed' };
    return `badge ${map[status] || 'badge-closed'}`;
  };

  const getPriority = (p) => {
    const map = { 'Low':'badge-low', 'Medium':'badge-medium', 'High':'badge-high', 'Critical':'badge-critical' };
    return `badge ${map[p] || 'badge-medium'}`;
  };

  return (
    <div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 className="page-title">All Reports</h1>
          <p className="page-subtitle">{reports.length} report(s) found</p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button className="btn btn-success" onClick={exportCSV}>Export CSV</button>
          <Link to="/reports/new" className="btn btn-primary">+ New Report</Link>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search reports..."
          value={filters.search}
          onChange={e => setFilters({...filters, search:e.target.value})}
          style={{ flex:1, minWidth:'200px' }}
        />
        <select value={filters.status} onChange={e => setFilters({...filters, status:e.target.value})}>
          <option value="">All Statuses</option>
          <option>New</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
        </select>
        <select value={filters.category} onChange={e => setFilters({...filters, category:e.target.value})}>
          <option value="">All Categories</option>
          {['Electrical','Plumbing','Heating','Structural','Cleaning','IT Equipment','Safety Hazard','Other'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters({...filters, priority:e.target.value})}>
          <option value="">All Priorities</option>
          <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
        </select>
        <button className="btn btn-secondary" onClick={() => setFilters({ status:'', category:'', priority:'', search:'' })}>Clear</button>
      </div>

      {loading ? <div className="loading">Loading reports...</div> : (
        reports.length === 0 ? (
          <div className="card empty-state">
            <h3>No reports found</h3>
            <p>Try changing your filters or submit a new report</p>
            <Link to="/reports/new" className="btn btn-primary" style={{ marginTop:'1rem', display:'inline-block', textDecoration:'none' }}>Submit Report</Link>
          </div>
        ) : (
          <div className="card table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Category</th><th>Building</th>
                  <th>Status</th><th>Priority</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id}>
                    <td>
                      <Link to={`/reports/${r._id}`} style={{ color:'#e94560', textDecoration:'none', fontWeight:'600' }}>
                        {r.title}
                      </Link>
                    </td>
                    <td>{r.category}</td>
                    <td>{r.building}</td>
                    <td><span className={getBadge(r.status)}>{r.status}</span></td>
                    <td><span className={getPriority(r.priority)}>{r.priority}</span></td>
                    <td style={{ fontSize:'0.85rem', color:'#666' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <button
                          className="btn btn-warning"
                          style={{ padding:'0.3rem 0.75rem', fontSize:'0.8rem' }}
                          onClick={() => navigate(`/reports/${r._id}`)}
                        >
                          View
                        </button>

                        {user?.role === 'admin' && (
                          <button
                            className="btn btn-danger"
                            style={{ padding:'0.3rem 0.75rem', fontSize:'0.8rem' }}
                            onClick={() => handleDelete(r._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
