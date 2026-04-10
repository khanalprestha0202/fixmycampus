import { useState, useEffect } from 'react';

function PrivacyConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('privacyConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyConsent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e293b', color: '#f1f5f9', padding: '16px 24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 -2px 10px rgba(0,0,0,0.3)' }}>
      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
        <strong>Privacy Notice:</strong> FixMyCampus collects your name, email, and maintenance report data to help manage campus issues. Your data is stored securely and used only for this purpose. We do not share your personal information with third parties. By using this platform you agree to our data handling practices. Location data from the map is sourced from OpenStreetMap and is not stored against your account.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleAccept} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          I Accept
        </button>
        <a href="/guidance" style={{ color: '#93c5fd', fontSize: '13px', alignSelf: 'center', textDecoration: 'underline' }}>
          Learn more about how we use your data
        </a>
      </div>
    </div>
  );
}

export default PrivacyConsent;