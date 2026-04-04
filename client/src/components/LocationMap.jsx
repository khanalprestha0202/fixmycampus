export default function LocationMap({ building }) {
  const buildings = {
    'Main Building': [51.505, -0.09],
    'Library': [51.506, -0.091],
    'Sports Centre': [51.504, -0.088],
    'Student Union': [51.507, -0.092],
    'Science Block': [51.503, -0.089],
    'Engineering Block': [51.508, -0.087],
    'Arts Centre': [51.502, -0.093],
    'Admin Building': [51.506, -0.086],
    'Halls of Residence': [51.509, -0.094],
    'Car Park': [51.501, -0.085],
  };

  const coords = buildings[building] || [51.505, -0.09];

  return (
    <div style={{ marginTop:'1rem' }}>
      <h3 style={{ fontWeight:'700', marginBottom:'0.75rem', color:'#1e40af' }}>Building Location</h3>
      <iframe
        width="100%"
        height="200"
        style={{ borderRadius:'8px', border:'none' }}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords[1]-0.01}%2C${coords[0]-0.01}%2C${coords[1]+0.01}%2C${coords[0]+0.01}&layer=mapnik&marker=${coords[0]}%2C${coords[1]}`}
        title="Building Location Map"
      />
      <p style={{ fontSize:'0.8rem', color:'#666', marginTop:'0.3rem' }}>
        Map data from <a href="https://openstreetmap.org" target="_blank" rel="noreferrer" style={{ color:'#e94560' }}>OpenStreetMap</a>
      </p>
    </div>
  );
}