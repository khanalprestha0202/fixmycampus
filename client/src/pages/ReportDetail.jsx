import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LocationMap from '../components/LocationMap';
import PDFExport from '../components/PDFExport';

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
    axios.get(`/api/reports/${id}`, {
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
    const res = await axios.put(`/api/reports/${id}/status`, { status }, {
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
        `/api/reports/${id}/comments`,
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
        `/api/reports/${id}`,
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

  const statusColors = {
    'New': { bg: '#dbeafe', color: '#1d4ed8' },
    'In Progress': { bg: '#fef3c7', color: '#92400e' },
    'Resolved': { bg: '#d1fae5', color: '#065f46' },
    'Closed': { bg: '#f3f4f6', color: '#374151' },
  };

  const priorityColors = {
    'Low': { bg: '#d1fae5', color: '#065f46' },
    'Medium': { bg: '#fef3c7', color: '#92400e' },
    'High': { bg: '#fee2e2', color: '#991b1b' },
    'Critical': { bg: '#7f1d1d', color: 'white' },
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '1.5rem',
        flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <button
            onClick={() => navigate('/reports')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0
            }}
          >
            ← Back to Reports
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            {report.title}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem',
              fontWeight: 600, ...statusColors[report.status]
            }}>
              {report.status}
            </span>
            <span style={{
              padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem',
              fontWeight: 600, ...priorityColors[report.priority]
            }}>
              {report.priority}
            </span>
            <span style={{
              padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem',
              fontWeight: 600, background: '#f3f4f6', color: '#374151'
            }}>
              {report.category}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="btn btn-warning"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel Edit' : 'Edit'}
          </button>
          <PDFExport report={report} />
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: '1.5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {editing && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                Edit Report
              </h3>
              <form onSubmit={handleEdit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={editForm.title || ''}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
              Report Details
            </h3>
            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Building</div>
                <div style={{ fontWeight: 600 }}>{report.building || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Location</div>
                <div style={{ fontWeight: 600 }}>{report.location || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Reported By</div>
                <div style={{ fontWeight: 600 }}>{report.reportedBy || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Date Submitted</div>
                <div style={{ fontWeight: 600 }}>
                  {new Date(report.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Description</div>
            <div style={{
              background: '#f8fafc', padding: '1rem', borderRadius: '8px',
              lineHeight: 1.6, color: '#374151'
            }}>
              {report.description}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
              Comments ({report.comments?.length || 0})
            </h3>

            {report.comments?.length === 0 && (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                No comments yet
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {report.comments?.map((c, i) => (
                <div key={i} style={{
                  background: '#f8fafc', padding: '0.75rem 1rem',
                  borderRadius: '8px', borderLeft: '3px solid #e94560'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {c.addedBy}
                  </div>
                  <div style={{ color: '#374151', fontSize: '0.9rem' }}>{c.text}</div>
                  {c.addedAt && (
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {new Date(c.addedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  flex: 1, padding: '0.6rem 1rem', border: '2px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '0.9rem'
                }}
              />
              <button type="submit" className="btn btn-primary">Post</button>
            </form>
          </div>

          {report.emailLogs?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                Email Notifications ({report.emailLogs.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {report.emailLogs.map((email, i) => (
                  <div key={i} style={{
                    background: '#f0fdf4', padding: '0.75rem 1rem',
                    borderRadius: '8px', borderLeft: '3px solid #10b981'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      {email.subject}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {email.message}
                    </div>
                    {email.sentAt && (
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        Sent: {new Date(email.sentAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
              Update Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['New', 'In Progress', 'Resolved', 'Closed'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  style={{
                    padding: '0.6rem 1rem',
                    border: `2px solid ${report.status === s ? statusColors[s]?.color : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: report.status === s ? statusColors[s]?.bg : 'white',
                    color: report.status === s ? statusColors[s]?.color : '#374151',
                    fontWeight: report.status === s ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {report.status === s ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
              Building Location
            </h3>
            <LocationMap building={report.building} />
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              Map data from <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>OpenStreetMap</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}