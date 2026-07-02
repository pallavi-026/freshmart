import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import API from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProduct } = useProducts();
  const { addToCart, getItemQty, getItemId, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const d = await fetchProduct(id);
      setProduct(d);
      setLoading(false);
      // Fetch recommendations
      try {
        const { data } = await API.get(`/products/${id}/recommendations`);
        if (data.success) setRecommendations(data.data);
      } catch { /* silent */ }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return (
    <div className="app-container" style={{ paddingTop: '40px', textAlign: 'center' }}>
      <p style={{ color: '#6B7280', fontSize: '15px' }}>Product not found.</p>
      <Link to="/products" style={{ color: '#22C55E', fontSize: '13px', fontWeight: 600 }}>← Back to Products</Link>
    </div>
  );

  const qty = getItemQty(product._id);
  const itemId = getItemId(product._id);

  const handleAdd = async () => {
    try { await addToCart(product._id, 1, product); toast.success('Added to cart 🛒'); }
    catch { toast.error('Could not add'); }
  };
  const handleInc = async () => {
    try { if (itemId) await updateQuantity(itemId, qty + 1, product._id); else await addToCart(product._id, 1, product); }
    catch { /* silent */ }
  };
  const handleDec = async () => {
    try { if (itemId) await updateQuantity(itemId, qty - 1, product._id); }
    catch (err) { console.warn('[ProductDetail] handleDec error:', err?.message); }
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh' }}>
      <div className="app-container fade-up" style={{ paddingTop: '28px', paddingBottom: '40px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '12px', color: '#9CA3AF' }}>
          <Link to="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} style={{ color: '#9CA3AF', textDecoration: 'none' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: '#374151', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', background: '#fff', border: '1px solid #EBEBEB', borderRadius: '16px', padding: '28px', alignItems: 'start' }} className="pd-layout">
          {/* Image */}
          <div style={{ background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F0F0F0', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              onError={e => { e.target.src = 'https://placehold.co/400x400/F8F9FA/9CA3AF?text=FreshMart'; }}
            />
          </div>

          {/* Details */}
          <div>
            <span style={{ display: 'inline-block', background: '#DCFCE7', color: '#16A34A', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '10px' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', letterSpacing: '-0.4px', marginBottom: '6px', lineHeight: 1.25 }}>{product.name}</h1>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '14px' }}>Per {product.unit}</p>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.65, marginBottom: '20px' }}>{product.description}</p>

            {/* Price + Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>${product.price.toFixed(2)}</span>
              {qty === 0 ? (
                <button className="btn-primary" onClick={handleAdd} disabled={!product.isAvailable} style={{ padding: '11px 32px', fontSize: '15px' }}>
                  {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
              ) : (
                <div>
                  <div className="qty-ctrl" style={{ transform: 'scale(1.15)', transformOrigin: 'left' }}>
                    <button className="qty-ctrl__btn" onClick={handleDec}>−</button>
                    <span className="qty-ctrl__num" style={{ minWidth: '32px' }}>{qty}</span>
                    <button className="qty-ctrl__btn" onClick={handleInc}>+</button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>{qty} in cart — ${(product.price * qty).toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Availability', value: product.isAvailable ? '✓ In Stock' : '✗ Out of Stock', color: product.isAvailable ? '#22C55E' : '#EF4444' },
                { label: 'Stock', value: `${product.stock} ${product.unit}s`, color: '#111827' },
                { label: 'Category', value: product.category, color: '#111827' },
                { label: 'Unit', value: product.unit, color: '#111827' },
              ].map(item => (
                <div key={item.label} style={{ background: '#F9FAFB', border: '1px solid #F0F0F0', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500, marginBottom: '3px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Delivery promises */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
              {[
                { icon: '🚚', text: 'Free delivery on orders above $50' },
                { icon: '⚡', text: 'Delivery in 30–60 minutes' },
                { icon: '🔒', text: '100% fresh quality guarantee' },
              ].map(p => (
                <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                  <span style={{ fontSize: '16px' }}>{p.icon}</span> {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ padding: '32px 0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '20px' }}>✨</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>You Might Also Like</h2>
              <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>AI Powered</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
              {recommendations.map(rec => (
                <div
                  key={rec._id}
                  onClick={() => navigate(`/products/${rec._id}`)}
                  style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: '12px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(34,197,94,0.15)'; e.currentTarget.style.borderColor = '#22C55E'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#EBEBEB'; }}
                >
                  <div style={{ background: '#F9FAFB', borderRadius: '8px', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' }}>
                    <img src={rec.image} alt={rec.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                      onError={e => { e.target.src = 'https://placehold.co/160x160/F8F9FA/9CA3AF?text=FM'; }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', marginBottom: '4px', lineHeight: 1.3 }}>{rec.name}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>{rec.category}</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#22C55E' }}>${rec.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) { .pd-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default ProductDetail;
