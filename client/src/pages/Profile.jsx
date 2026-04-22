import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="container">
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Manage your account settings and privacy preferences</p>

      <div className="grid-2" style={{ alignItems:'start' }}>
        <div className="card">
          <h2 style={{ fontWeight:'700', marginBottom:'1.5rem', fontSize:'1.2rem' }}>Account Information</h2>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'#e94560', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.5rem', fontWeight:'700' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:'700', fontSize:'1.1rem' }}>{user?.name}</div>
              <div style={{ color:'#666', fontSize:'0.9rem' }}>{user?.email}</div>
              <span className="badge" style={{ background: user?.role === 'admin' ? '#fee2e2' : '#dbeafe', color: user?.role === 'admin' ? '#991b1b' : '#1d4ed8', marginTop:'0.25rem' }}>
                {user?.role === 'admin' ? 'Administrator' : 'Student / Staff'}
              </span>
            </div>
          </div>
          <div style={{ background:'#f8f9fa', padding:'1rem', borderRadius:'8px', marginBottom:'1rem' }}>
            <div style={{ fontWeight:'600', marginBottom:'0.5rem' }}>Account Details</div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'0.3rem' }}>
              <span style={{ color:'#666' }}>Name</span><span style={{ fontWeight:'600' }}>{user?.name}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'0.3rem' }}>
              <span style={{ color:'#666' }}>Email</span><span style={{ fontWeight:'600' }}>{user?.email}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem' }}>
              <span style={{ color:'#666' }}>Role</span><span style={{ fontWeight:'600' }}>{user?.role}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom:'1rem', borderLeft:'4px solid #10b981' }}>
            <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>🔒 Privacy Settings</h3>
            <div style={{ fontSize:'0.9rem', color:'#555', lineHeight:'1.8' }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <span>Data stored securely</span><span style={{ color:'#10b981', fontWeight:'600' }}>✓ Yes</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <span>Third party sharing</span><span style={{ color:'#10b981', fontWeight:'600' }}>✓ Never</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <span>Password encrypted</span><span style={{ color:'#10b981', fontWeight:'600' }}>✓ BCrypt</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0' }}>
                <span>Session secured</span><span style={{ color:'#10b981', fontWeight:'600' }}>✓ JWT</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ borderLeft:'4px solid #e94560' }}>
            <h3 style={{ fontWeight:'700', marginBottom:'1rem' }}>⚠️ Account Actions</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => { logout(); toast.success('Logged out'); }}>
                Logout
              </button>
              <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>
                Request Data Deletion
              </button>
              {showDeleteConfirm && (
                <div style={{ background:'#fee2e2', padding:'1rem', borderRadius:'8px', fontSize:'0.9rem', color:'#991b1b' }}>
                  To request deletion of your data, please contact the campus facilities team at facilities@campus.ac.uk. Your request will be processed within 30 days in accordance with GDPR.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}