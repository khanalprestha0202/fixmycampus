import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// New report form - triggers email notifications on submission and status changes

export default function NewReport() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', building: '', location: '',
    description: '', priority: 'Medium', photoUrl: '',
    reportedBy: user?.name || '', email: user?.email || ''
  });

  const buildings = ['Main Building', 'Library', 'Sports Centre', 'Student Union', 'Science Block', 'Engineering Block', 'Arts Centre', 'Admin Building', 'Halls of Residence', 'Car Park'];
  const categories = ['Electrical', 'Plumbing', 'Heating', 'Structural', 'Cleaning', 'IT Equipment', 'Safety Hazard', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return toast.error('Please give consent to submit a report');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reports', { ...form, consentGiven: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Report submitted successfully!');
      navigate('/reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Submit Maintenance Report</h1>
      <p className="page-subtitle">Please provide as much detail as possible to help us resolve the issue quickly.</p>

      <div className="grid-2" style={{ alignItems:'start' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Report Title *</label>
              <input type="text" placeholder="e.g. Broken heating in Room 204" value={form.title}
                onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority *</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Building *</label>
                <select value={form.building} onChange={e => setForm({...form, building: e.target.value})} required>
                  <option value="">Select building</option>
                  {buildings.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Specific Location *</label>
                <input type="text" placeholder="e.g. Room 204, Floor 2" value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea placeholder="Describe the issue in detail. When did it start? Is it a safety risk?" value={form.description}
                onChange={e => setForm({...form, description: e.target.value})} required rows={4} />
            </div>
            <div className="form-group">
              <label>Photo URL (optional)</label>
              <input type="url" placeholder="https://imgur.com/your-photo" value={form.photoUrl}
                onChange={e => setForm({...form, photoUrl: e.target.value})} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" value={form.reportedBy}
                  onChange={e => setForm({...form, reportedBy: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Your Email *</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div style={{ background:'#eff6ff', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.85rem', color:'#1e40af' }}>
              <strong>Data Privacy:</strong> Your personal details are stored securely and used only to process this report and send you updates. We do not share your data with third parties.
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem' }}>
              <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <label htmlFor="consent" style={{ fontSize:'0.9rem', cursor:'pointer' }}>I consent to my data being stored to process this report</label>
            </div>
            <div style={{ display:'flex', gap:'1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:1 }}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/reports')}>Cancel</button>
            </div>
          </form>
        </div>

        <div>
          <div className="card" style={{ marginBottom:'1rem', borderLeft:'4px solid #f59e0b' }}>
            <h3 style={{ fontWeight:'700', marginBottom:'0.75rem' }}>Reporting Tips</h3>
            <ul style={{ paddingLeft:'1.2rem', color:'#555', fontSize:'0.9rem', lineHeight:'1.8' }}>
              <li>Be specific about the exact location</li>
              <li>Describe when you first noticed the issue</li>
              <li>Mention any safety risks clearly</li>
              <li>Use Critical priority only for immediate dangers</li>
              <li>Add a photo link if possible</li>
            </ul>
          </div>
          <div className="card" style={{ borderLeft:'4px solid #e94560' }}>
            <h3 style={{ fontWeight:'700', marginBottom:'0.75rem' }}>Emergency?</h3>
            <p style={{ color:'#555', fontSize:'0.9rem', lineHeight:'1.6' }}>
              For immediate safety hazards - call Campus Security: <strong>0800 000 000</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}