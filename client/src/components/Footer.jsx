export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: '#94a3b8',
      padding: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.06)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* TOP ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '2rem',
          marginBottom: '1.5rem'
        }}>

          {/* BRAND */}
          <div>
            <div style={{
              fontSize: '1.2rem', fontWeight: 800,
              color: '#e94560', marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              🔧 FixMyCampus
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: '#64748b', maxWidth: '260px' }}>
              A campus maintenance reporting platform for St Mary's University, Twickenham.
              Submit, track and manage maintenance issues across campus.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f1f5f9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick Links
            </div>
            {[
              { label: 'Dashboard', href: '/' },
              { label: 'All Reports', href: '/reports' },
              { label: 'New Report', href: '/reports/new' },
              { label: 'Analytics', href: '/analytics' },
              { label: 'Guidance', href: '/guidance' },
            ].map((link, i) => (
              <a key={i} href={link.href} style={{
                display: 'block', color: '#64748b', textDecoration: 'none',
                fontSize: '0.82rem', marginBottom: '0.4rem',
                transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#e94560'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f1f5f9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Categories
            </div>
            {['Electrical', 'Plumbing', 'Heating', 'Structural', 'Cleaning', 'IT Equipment'].map((cat, i) => (
              <div key={i} style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.4rem' }}>
                {cat}
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f1f5f9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Emergency
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>Campus Security</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e94560' }}>0800 000 000</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>24/7 Emergency Line</div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>Facilities Team</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e94560' }}>0800 111 222</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>Mon-Fri 8am-6pm</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>Emergency Services</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e94560' }}>999</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>Life threatening only</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            © {year} FixMyCampus — St Mary's University, Twickenham. CPS7005 Web Application Development.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy Policy', 'Data Handling', 'Contact'].map((item, i) => (
              <span key={i} style={{ fontSize: '0.78rem', color: '#475569', cursor: 'pointer' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}