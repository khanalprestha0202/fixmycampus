import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LocationMap from '../components/LocationMap';
import PDFExport from '../components/PDFExport'; // KEEP THIS ONLY

export default function ReportDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setReport(res.data);
        setEditForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Report not found');
        navigate('/reports');
      });
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/reports/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data);
      toast.success('Status updated to ' + status);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reports/${id}/comments`,
        { text: comment, addedBy: user?.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReport(res.data);
      setComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/reports/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReport(res.data);
      setEditing(false);
      toast.success('Report updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (!report) return null;

  const getBadge = (status) => {
    const map = {
      'New': 'badge-new',
      'In Progress': 'badge-progress',
      'Resolved': 'badge-resolved',
      'Closed': 'badge-closed'
    };
    return `badge ${map[status] || 'badge-closed'}`;
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            Back
          </button>

          <h1 className="page-title">{report.title}</h1>

          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            <span className={getBadge(report.status)}>{report.status}</span>
            <span className={`badge badge-${report.priority.toLowerCase()}`}>{report.priority}</span>
            <span className="badge">{report.category}</span>
          </div>
        </div>

        <div style={{ display:'flex', gap:'0.5rem' }}>
          <button className="btn btn-warning" onClick={() => setEditing(!editing)}>
            Edit
          </button>

          {/* ✅ PDF EXPORT WORKS HERE */}
          <PDFExport report={report} />
        </div>
      </div>

      {/* REST OF YOUR UI (UNCHANGED) */}
      <div className="grid-2" style={{ alignItems:'start' }}>

        <div>
          {editing ? (
            <div className="card">
              <h3>Edit Report</h3>

              <form onSubmit={handleEdit}>
                <input
                  value={editForm.title || ''}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                />

                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />

                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            <div className="card">
              <h3>Report Details</h3>
              <p>{report.description}</p>
            </div>
          )}

          {/* COMMENTS */}
          <div className="card">
            <h3>Comments</h3>

            {report.comments?.map((c, i) => (
              <div key={i}>
                <b>{c.addedBy}</b>: {c.text}
              </div>
            ))}

            <form onSubmit={handleAddComment}>
              <textarea value={comment} onChange={e => setComment(e.target.value)} />
              <button className="btn btn-primary">Add Comment</button>
            </form>
          </div>
        </div>

        {report.emailLogs?.length > 0 && (
  <div className="card" style={{ marginTop: '1rem' }}>
    <h3>Email Notifications</h3>

    {report.emailLogs.map((email, i) => (
      <div key={i} style={{
        padding: '0.75rem',
        background: '#f8f9fa',
        marginBottom: '0.5rem',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold' }}>{email.subject}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          {email.message}
        </div>
      </div>
    ))}
  </div>
)}

        {/* RIGHT SIDE */}
        <div>
          <div className="card">
            <h3>Update Status</h3>

            {['New','In Progress','Resolved','Closed'].map(s => (
              <button key={s} onClick={() => handleStatusChange(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="card">
            <LocationMap building={report.building} />
          </div>
        </div>

      </div>
    </div>
  );
}