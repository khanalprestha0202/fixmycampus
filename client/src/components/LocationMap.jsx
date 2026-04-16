export default function LocationMap({ building }) {
  const buildings = {
    'Main Building':        [51.4507, -0.3360],
    'Library':              [51.4510, -0.3355],
    'Sports Centre':        [51.4515, -0.3370],
    'Student Union':        [51.4505, -0.3358],
    'Science Block':        [51.4508, -0.3365],
    'Engineering Block':    [51.4503, -0.3362],
    'Arts Centre':          [51.4512, -0.3368],
    'Admin Building':       [51.4506, -0.3356],
    'Halls of Residence':   [51.4500, -0.3372],
    'Car Park':             [51.4498, -0.3350],
  };

  const coords = buildings[building] || [51.4507, -0.3360];
  const zoom = 16; // zoom out from 18 to 16 so less zoomed in by default

  // Wider bbox = more of the campus visible = less zoomable feel
  const bbox = [
    coords[1] - 0.008,  // was 0.002 — now 4x wider horizontally
    coords[0] - 0.005,  // was 0.001 — now 5x wider vertically
    coords[1] + 0.008,
    coords[0] + 0.005
  ];

  return (
    <div>
      <iframe
        width="100%"
        height="280"
        style={{ borderRadius: '8px', border: 'none' }}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox[0]}%2C${bbox[1]}%2C${bbox[2]}%2C${bbox[3]}&layer=mapnik&marker=${coords[0]}%2C${coords[1]}`}
        title="Building Location Map"
        // scrolling="no" prevents scroll-to-zoom inside the iframe
        scrolling="no"
      />
      <div style={{
        background: '#eff6ff', borderRadius: '6px',
        padding: '0.5rem 0.75rem', marginTop: '0.5rem',
        fontSize: '0.8rem', color: '#1e40af',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span>📍 St Mary's University, Twickenham — {building}</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}#map=${zoom}/${coords[0]}/${coords[1]}`}
          target="_blank" rel="noreferrer"
          style={{ color: '#e94560', fontWeight: 600, fontSize: '0.78rem' }}
        >
          Open full map ↗
        </a>
      </div>
    </div>
  );
}
