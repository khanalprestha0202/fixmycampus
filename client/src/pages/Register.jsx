import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return setError('You must agree to the privacy policy to register.');
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #1a1a2e, #16213e)', padding:'2rem' }}>
      <div className="card" style={{ width:'100%', maxWidth:'460px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem' }}>🔧</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:'700', color:'#1a1a2e' }}>Create Account</h1>
          <p style={{ color:'#666' }}>Join FixMyCampus today</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Smith" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="user">Student / Staff</option>
              <option value="admin">Maintenance Admin</option>
            </select>
          </div>
          <div style={{ background:'#f8f9fa', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.85rem', color:'#555' }}>
            <strong>Privacy Notice:</strong> Your name and email will be stored securely and used only to manage your maintenance reports. Data is never shared with third parties.
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <label htmlFor="consent" style={{ fontSize:'0.9rem', cursor:'pointer' }}>I agree to the privacy policy and consent to data storage</label>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width:'100%', padding:'0.85rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1rem', color:'#666' }}>
          Already have an account? <Link to="/login" style={{ color:'#e94560', fontWeight:'600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}