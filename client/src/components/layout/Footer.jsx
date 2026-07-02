import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#F8F9FA', color: '#4B5563', marginTop: 'auto', borderTop: '1px solid #EBEBEB' }}>
    <div className="app-container" style={{ padding: '60px 20px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '32px', marginBottom: '48px' }} className="footer-grid">
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🥬</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Fresh<span style={{ color: '#00A651' }}>Mart</span></span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '240px', color: '#6B7280', marginBottom: '24px' }}>
            Your one-stop shop for fresh groceries, delivered fast to your doorstep.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
              <span key={i} style={{ fontSize: '18px', cursor: 'pointer', filter: 'grayscale(100%)', opacity: 0.6, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.opacity = 0.6; }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Shop</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { to: '/products', label: 'All Products' },
              { to: '/products?category=Fruits', label: 'Fruits' },
              { to: '/products?category=Vegetables', label: 'Vegetables' },
              { to: '/products?category=Dairy', label: 'Dairy' },
              { to: '/products?category=Bakery', label: 'Bakery' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00A651'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
              >{item.label}</Link>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Account</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { to: '/orders', label: 'My Orders' },
              { to: '/cart', label: 'My Cart' },
              { to: '/profile', label: 'Profile' },
              { to: '/profile', label: 'Addresses' },
            ].map(item => (
              <Link key={item.label} to={item.to} style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#22c55e'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
              >{item.label}</Link>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Support</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { to: '/contact', label: 'Help Center' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/contact', label: 'Privacy Policy' },
            ].map(item => (
              <Link key={item.label} to={item.to} style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#22c55e'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
              >{item.label}</Link>
            ))}
          </div>
        </div>

        {/* App */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Get the App</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ height: '40px', cursor: 'pointer' }} />
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" style={{ height: '40px', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
          © {new Date().getFullYear()} FreshMart. All rights reserved.
        </p>
      </div>
    </div>
    <style>{`
      @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; } }
      @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
      @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
    `}</style>
  </footer>
);

export default Footer;
