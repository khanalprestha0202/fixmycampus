import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
      <div className="card" style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem' }}>🔧</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:'700', color:'#1a1a2e' }}>FixMyCampus</h1>
          <p style={{ color:'#666', marginTop:'0.5rem' }}>Campus Maintenance Reporting Platform</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width:'100%', padding:'0.85rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1rem', color:'#666' }}>
          Don't have an account? <Link to="/register" style={{ color:'#e94560', fontWeight:'600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}