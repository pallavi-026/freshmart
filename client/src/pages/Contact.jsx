import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: '60px' }}>
      <div className="app-container fade-up" style={{ paddingTop: '40px', maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
            We're here to help! Reach out to us for any questions regarding your orders or fresh groceries.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="md:grid-cols-2">
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  👤
                </div>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Store Manager</h3>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Sayeed</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  ✉️
                </div>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Email Support</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <a href="mailto:freshmart@gmail.com" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', textDecoration: 'none' }}>freshmart@gmail.com</a>
                    <a href="mailto:sayeedmd4730@gmail.com" style={{ fontSize: '15px', color: '#4B5563', textDecoration: 'none' }}>sayeedmd4730@gmail.com</a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  📍
                </div>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Our Location</h3>
                  <p style={{ fontSize: '16px', fontWeight: 500, color: '#111827', lineHeight: 1.5 }}>
                    Shamshabad<br />
                    Hyderabad, Telangana<br />
                    501218
                  </p>
                </div>
              </div>
            </div>

            {/* Visual/Map Area */}
            <div style={{ background: '#F8F9FA', borderRadius: '16px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '240px' }}>
              <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>🏪</span>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>FreshMart Superstore</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
