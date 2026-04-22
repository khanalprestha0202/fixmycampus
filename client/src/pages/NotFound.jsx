import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', textAlign:'center' }}>
      <div style={{ fontSize:'5rem' }}>🔧</div>
      <h1 style={{ fontSize:'3rem', fontWeight:'700', color:'#e94560' }}>404</h1>
      <h2 style={{ fontSize:'1.5rem', color:'#333' }}>Page Not Found</h2>
      <p style={{ color:'#666', maxWidth:'400px' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration:'none', marginTop:'1rem' }}>Go to Dashboard</Link>
    </div>
  );
}