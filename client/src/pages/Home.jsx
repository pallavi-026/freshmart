import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

const CATEGORIES = [
  { name: 'Fruits',     image: 'https://cdn-icons-png.flaticon.com/512/3194/3194766.png' },
  { name: 'Vegetables', image: 'https://cdn-icons-png.flaticon.com/512/2329/2329903.png' },
  { name: 'Dairy',      image: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png' },
  { name: 'Bakery',     image: 'https://cdn-icons-png.flaticon.com/512/3014/3014524.png' },
  { name: 'Beverages',  image: 'https://cdn-icons-png.flaticon.com/512/2738/2738730.png' },
  { name: 'Snacks',     image: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png' },
  { name: 'Grains',     image: 'https://cdn-icons-png.flaticon.com/512/5029/5029241.png' },
  { name: 'Meat',       image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
  { name: 'Frozen',     image: 'https://cdn-icons-png.flaticon.com/512/4688/4688647.png' },
  { name: 'Organic',    image: 'https://cdn-icons-png.flaticon.com/512/1147/1147942.png' },
];

const Home = () => {
  // Use dedicated featuredProducts state to avoid polluting the catalog state
  const { featuredProducts, fetchFeaturedProducts } = useProducts();

  useEffect(() => {
    fetchFeaturedProducts({ limit: 5, sort: 'name' });
  }, []);

  return (
    <div style={{ background: '#F8F9FA' }}>

      {/* ── Hero Banner ─────────────────────────────── */}
      <section className="app-container" style={{ paddingTop: '24px', paddingBottom: '32px' }}>
        <div className="hero-banner" style={{
          background: 'linear-gradient(to right, #f0fdf4 0%, #e8f5e9 100%)',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          minHeight: '440px',
          border: '1px solid #dcfce7'
        }}>
          {/* Text Content */}
          <div className="hero-content" style={{ padding: '64px', maxWidth: '550px', zIndex: 10 }}>
            <h1 className="hero-title" style={{ 
              fontSize: '52px', 
              fontWeight: 800, 
              color: '#111827', 
              lineHeight: 1.1, 
              letterSpacing: '-1.5px', 
              marginBottom: '20px' 
            }}>
              Fresh groceries,<br />delivered to your door
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#4B5563', 
              marginBottom: '36px', 
              lineHeight: 1.5
            }}>
              Shop from 1000+ products across fresh fruits, vegetables, dairy, and more.
            </p>
            <div>
              <Link to="/products" className="btn-primary" style={{ 
                padding: '16px 40px', 
                fontSize: '16px', 
                borderRadius: '999px', 
                background: '#22c55e', 
                color: 'white', 
                fontWeight: 700, 
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(34, 197, 94, 0.25)'
              }}>
                Shop Now →
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hero-img-container" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '65%', zIndex: 5, pointerEvents: 'none' }}>
            <img 
              className="hero-img"
              src="/assets/products/hero-banner-chatgpt.png" 
              alt="Fresh Groceries" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'right center',
                maskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%)'
              }} 
            />
          </div>
        </div>
      </section>

      {/* ── Delivery promise bar ─────────────────────── */}
      <div className="app-container" style={{ paddingBottom: '32px' }}>
        <div className="features-bar no-scrollbar" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #F0F0F0', display: 'flex', overflowX: 'auto', gap: '0' }}>
          {[
            { icon: '🚚', label: 'Free delivery on $50+', sub: 'No minimum order' },
            { icon: '🛡️', label: '100% Fresh Guarantee', sub: 'Quality you can trust' },
            { icon: '⏱️', label: 'On-time Delivery', sub: 'Fast & reliable' },
            { icon: '↩️', label: 'Easy Returns', sub: 'No questions asked' },
          ].map((item, i) => (
            <div key={i} className="feature-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 32px', flex: 1, borderRight: i < 3 ? '1px solid #F0F0F0' : 'none', minWidth: '240px' }}>
              <span style={{ fontSize: '28px', color: '#22c55e' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ──────────────────────────────── */}
      <section className="app-container" style={{ paddingBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="section-link">See All →</Link>
        </div>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '12px', padding: '20px', minWidth: '130px',
                background: '#ffffff', border: '1px solid #F0F0F0',
                borderRadius: '16px', textDecoration: 'none',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <img src={cat.image} alt={cat.name} style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#374151', textAlign: 'center' }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ────────────────────────────── */}
      <section className="app-container" style={{ paddingBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 className="section-title">Best Sellers</h2>
          <Link to="/products" className="section-link">See All →</Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
        }} className="product-grid">
          {featuredProducts.slice(0, 5).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) { 
          .product-grid { grid-template-columns: repeat(4, 1fr) !important; } 
        }
        @media (max-width: 768px) { 
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; } 
          .hero-banner { flex-direction: column !important; text-align: center; justify-content: center; min-height: auto !important; }
          .hero-content { padding: 40px 24px !important; margin: 0 auto; z-index: 10; }
          .hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
          .hero-img-container { position: relative !important; width: 100% !important; height: 200px !important; }
          .hero-img { object-position: center !important; mask-image: linear-gradient(to top, transparent 0%, black 50%) !important; -webkit-mask-image: linear-gradient(to top, transparent 0%, black 50%) !important; }
          .features-bar { padding: 16px !important; flex-wrap: wrap; justify-content: center; }
          .feature-item { border-right: none !important; min-width: 45% !important; padding: 12px !important; }
        }
        @media (max-width: 480px) { 
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; } 
          .hero-title { font-size: 28px !important; }
          .feature-item { min-width: 100% !important; justify-content: flex-start !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
