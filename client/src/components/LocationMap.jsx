export default function LocationMap({ building }) {
  const buildings = {
    'Main Building':      { coords: [51.4507, -0.3360], description: 'Central administration and main lecture halls' },
    'Library':            { coords: [51.4510, -0.3355], description: 'Main campus library and study spaces' },
    'Sports Centre':      { coords: [51.4515, -0.3370], description: 'Gym, sports hall and fitness facilities' },
    'Student Union':      { coords: [51.4505, -0.3358], description: 'Student services, cafe and social spaces' },
    'Science Block':      { coords: [51.4508, -0.3365], description: 'Science laboratories and research facilities' },
    'Engineering Block':  { coords: [51.4503, -0.3362], description: 'Engineering labs and workshops' },
    'Arts Centre':        { coords: [51.4512, -0.3368], description: 'Arts studios, theatre and creative spaces' },
    'Admin Building':     { coords: [51.4506, -0.3356], description: 'University administration and finance' },
    'Halls of Residence': { coords: [51.4500, -0.3372], description: 'Student accommodation and common rooms' },
    'Car Park':           { coords: [51.4498, -0.3350], description: 'Main campus car parking area' },
  };

  const place = buildings[building] || { coords: [51.4507, -0.3360], description: 'Campus location' };
  const coords = place.coords;
  const zoom = 17;

  const bbox = [
    coords[1] - 0.008,
    coords[0] - 0.005,
    coords[1] + 0.008,
    coords[0] + 0.005
  ];

  const mapUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox[0] + '%2C' + bbox[1] + '%2C' + bbox[2] + '%2C' + bbox[3] + '&layer=mapnik&marker=' + coords[0] + '%2C' + coords[1];
  const fullMapUrl = 'https://www.openstreetmap.org/?mlat=' + coords[0] + '&mlon=' + coords[1] + '#map=' + zoom + '/' + coords[0] + '/' + coords[1];

  return (
    <div>
      {building && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          borderRadius: '8px 8px 0 0',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(233,69,96,0.2)',
            border: '1px solid rgba(233,69,96,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0
          }}>
            📍
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>
              {building}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>
              {place.description}
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <iframe
          width="100%"
          height="260"
          style={{
            border: 'none',
            borderRadius: building ? '0' : '8px',
            display: 'block'
          }}
          src={mapUrl}
          title="Building Location Map"
          scrolling="no"
        />
      </div>

      <div style={{
        background: '#f8fafc',
        borderRadius: '0 0 8px 8px',
        padding: '0.6rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #e2e8f0'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          St Mary's University, Twickenham
        </span>
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#e94560',
            fontWeight: 600,
            fontSize: '0.75rem',
            textDecoration: 'none',
            background: 'rgba(233,69,96,0.08)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px',
            border: '1px solid rgba(233,69,96,0.2)'
          }}
        >
          Open full map
        </a>
      </div>
    </div>
  );
}
