import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Notifications from './Notifications';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: isActive(path) ? 700 : 500,
    color: isActive(path) ? '#e94560' : '#cbd5e1',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    background: isActive(path) ? 'rgba(233,69,96,0.1)' : 'transparent',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  });

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>

      <Link to="/" style={{
        textDecoration: 'none',
        fontSize: '1.2rem',
        fontWeight: 800,
        color: '#e94560',
        letterSpacing: '-0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        🔧 FixMyCampus
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <Link to="/" style={linkStyle('/')}>Dashboard</Link>
        <Link to="/reports" style={linkStyle('/reports')}>Reports</Link>
        <Link to="/reports/new" style={linkStyle('/reports/new')}>New Report</Link>
        <Link to="/analytics" style={linkStyle('/analytics')}>Analytics</Link>
        <Link to="/guidance" style={linkStyle('/guidance')}>Guidance</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        <Notifications />

        <Link to="/profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          transition: 'all 0.2s'
        }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#e94560',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1 }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1, marginTop: '0.15rem' }}>
              {user?.role === 'admin' ? 'Admin' : 'Staff'}
            </div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(233,69,96,0.15)',
            border: '1px solid rgba(233,69,96,0.3)',
            color: '#e94560',
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}