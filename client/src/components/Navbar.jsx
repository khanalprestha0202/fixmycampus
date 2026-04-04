import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Notifications from './Notifications';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FixMyCampus</Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        <Link to="/reports" className={isActive('/reports')}>Reports</Link>
        <Link to="/reports/new" className={isActive('/reports/new')}>New Report</Link>
        <Link to="/analytics" className={isActive('/analytics')}>Analytics</Link>
        <Link to="/guidance" className={isActive('/guidance')}>Guidance</Link>
        <Notifications />
        <span style={{color:'#aaa', fontSize:'0.85rem'}}>{user?.name}</span>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}