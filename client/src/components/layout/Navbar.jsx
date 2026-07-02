import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { label: 'All Categories', path: '/products' },
  { label: 'Fruits', path: '/products?category=Fruits' },
  { label: 'Vegetables', path: '/products?category=Vegetables' },
  { label: 'Dairy', path: '/products?category=Dairy' },
  { label: 'Bakery', path: '/products?category=Bakery' },
  { label: 'Beverages', path: '/products?category=Beverages' },
  { label: 'Snacks', path: '/products?category=Snacks' },
  { label: 'Meat', path: '/products?category=Meat' },
  { label: 'Frozen', path: '/products?category=Frozen' },
  { label: 'Organic', path: '/products?category=Organic' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Select your location');
  const dropRef = useRef(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    toast.loading("Detecting location...", { id: 'loc-toast' });
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown City';
        const pincode = data.address.postcode || '';
        
        setDeliveryLocation(`${city}${pincode ? `, ${pincode}` : ''}`);
        toast.success("Location updated!", { id: 'loc-toast' });
      } catch (error) {
        console.error("Geocoding error:", error);
        toast.error("Could not fetch address details", { id: 'loc-toast' });
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      toast.error("Location access denied", { id: 'loc-toast' });
    });
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  const currentCategory = new URLSearchParams(location.search).get('category');
  const isAllActive = location.pathname === '/products' && !currentCategory;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ borderBottom: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      {/* Main bar */}
      <div className="app-container">
        <div style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '24px' }}>

          {/* Logo & Delivery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexShrink: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <span style={{ fontSize: '28px', color: '#22c55e' }}>🛒</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                Fresh<span style={{ color: '#22c55e' }}>Mart</span>
              </span>
            </Link>

            <div className="hidden lg:flex" onClick={handleGetLocation} style={{ flexDirection: 'column', gap: '2px', cursor: 'pointer' }} title="Click to detect your location">
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery to</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px', color: '#111827', fontWeight: 700, maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deliveryLocation}</span>
                <svg style={{ width: '14px', height: '14px', color: '#22c55e', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '700px', display: 'flex' }} className="hidden md:flex">
            <div style={{ position: 'relative', width: '100%' }}>
              <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for groceries, fruits, vegetables..."
                style={{ width: '100%', padding: '14px 16px 14px 44px', fontSize: '15px', background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}
                onFocus={e => { e.target.style.borderColor = '#22c55e'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F8F9FA'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </form>

          {/* Spacer for mobile */}
          <div style={{ flex: 1 }} className="md:hidden" />

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>

            {/* Quick Links */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '24px' }}>
              <Link to="/offers" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#4B5563', textDecoration: 'none' }}>
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4.28a2 2 0 011.897 1.368L13 10m0 0l2.76 5.52A2 2 0 0017.553 17H21a2 2 0 002-2v-4a2 2 0 00-2-2h-3.447M13 10L9.84 4.316" /></svg>
                Offers
              </Link>
              <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#4B5563', textDecoration: 'none' }}>
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Help
              </Link>
            </div>

            {/* Cart */}
            <Link to="/cart" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px', borderRadius: '12px',
              background: '#22c55e', color: 'white',
              textDecoration: 'none', transition: 'all 0.15s'
            }}>
              <div style={{ position: 'relative' }}>
                <svg style={{ width: '22px', height: '22px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#FF4500', color: '#fff', fontSize: '10px', fontWeight: 800, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col" style={{ lineHeight: 1.1 }}>
                <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>My Cart</span>
                <span style={{ fontSize: '14px', fontWeight: 800 }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </Link>

            {/* User */}
            {user ? (
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px', borderRadius: '50%',
                    background: '#F3F4F6', border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=E5E7EB&color=374151`} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                </button>

                {dropOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                    minWidth: '220px', background: '#fff',
                    border: '1px solid #E5E7EB', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    overflow: 'hidden', zIndex: 100
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Hi, {user.name}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{user.email}</div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <Link to="/profile" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        👤 My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        📦 My Orders
                      </Link>
                      {user.isAdmin && (
                        <Link to="/admin" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          ⚙️ Admin Panel
                        </Link>
                      )}
                    </div>
                    <div style={{ borderTop: '1px solid #F3F4F6', padding: '8px' }}>
                      <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
                        color: '#EF4444', background: 'transparent', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{
                  padding: '10px 20px', fontSize: '14px', fontWeight: 600,
                  color: '#374151', background: '#fff', border: '1px solid #E5E7EB',
                  borderRadius: '999px', textDecoration: 'none', transition: 'all 0.15s'
                }}>Login</Link>
                <Link to="/register" style={{
                  padding: '10px 20px', fontSize: '14px', fontWeight: 600,
                  color: '#fff', background: '#22c55e', border: '1px solid #22c55e',
                  borderRadius: '999px', textDecoration: 'none', transition: 'background 0.15s'
                }}>Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(v => !v)}
              style={{ padding: '8px', background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', color: '#374151' }}
            >
              {mobileMenuOpen ? (
                <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden" style={{ paddingBottom: '12px' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groceries..."
              style={{ width: '100%', padding: '12px 16px 12px 40px', fontSize: '15px', background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </form>

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid #F3F4F6', paddingBottom: '12px', paddingTop: '8px' }}>
            {/* Location selector — accessible on mobile */}
            <div
              onClick={() => { handleGetLocation(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid #F9FAFB' }}
            >
              <svg style={{ width: '16px', height: '16px', color: '#22c55e', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Delivery to</span>
                <span style={{ fontSize: '13px', color: '#111827', fontWeight: 700 }}>{deliveryLocation}</span>
              </div>
            </div>
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/offers', label: 'Offers' },
              ...(user ? [
                { to: '/profile', label: 'My Profile' },
                { to: '/orders', label: 'My Orders' }
              ] : []),
              ...(user?.isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
            ].map(item => (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '12px 0', fontSize: '15px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #F9FAFB' }}>
                {item.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', fontSize: '15px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                Logout
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Category nav strip */}
      <div style={{ borderTop: '1px solid #F0F0F0', background: '#ffffff', padding: '12px 0' }}>
        <div className="app-container">
          <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATEGORIES.map(item => {
              let isActive = false;
              if (item.label === 'All Categories') {
                isActive = isAllActive;
              } else {
                isActive = currentCategory === item.path.split('=')[1];
              }

              return (
                <Link key={item.label} to={item.path}
                  style={{
                    display: 'inline-flex', alignItems: 'center', padding: '8px 20px',
                    fontSize: '14px', fontWeight: 600, borderRadius: '999px',
                    border: isActive ? '1px solid #22c55e' : '1px solid #E5E7EB',
                    whiteSpace: 'nowrap', transition: 'all 0.2s', textDecoration: 'none',
                    background: isActive ? '#f0fdf4' : '#ffffff',
                    color: isActive ? '#15803d' : '#4B5563',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) { e.currentTarget.style.background = '#F8F9FA'; }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) { e.currentTarget.style.background = '#ffffff'; }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

