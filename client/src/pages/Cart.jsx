import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, loading, cartTotal, cartCount, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!cart.items?.length) {
    return (
      <div className="app-container" style={{ paddingTop: '40px' }}>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Browse fresh groceries and add them to your cart!"
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      </div>
    );
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh' }}>
      <div className="app-container fade-up" style={{ paddingTop: '28px', paddingBottom: '40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>My Cart</h1>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{cartCount} items</p>
          </div>
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }} className="cart-layout">
          {/* Items */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', overflow: 'hidden' }}>
            {cart.items.map((item, index) => (
              <div key={item._id} className="cart-item" style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: index < cart.items.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                {/* Image */}
                <div style={{ width: '64px', height: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={item.product?.image} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.src = 'https://placehold.co/200x200/F8F9FA/9CA3AF?text=FM'; }} />
                </div>
                {/* Info */}
                <div className="cart-item-info" style={{ flex: 1, minWidth: 0, marginLeft: '16px' }}>
                  <Link to={`/products/${item.product?._id}`} style={{ fontSize: '14px', fontWeight: 700, color: '#111827', textDecoration: 'none', display: 'block' }}>
                    {item.product?.name}
                  </Link>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{item.product?.unit}</div>
                </div>
                {/* Qty counter */}
                <div className="qty-ctrl cart-item-qty" style={{ flexShrink: 0, margin: '0 32px' }}>
                  <button className="qty-ctrl__btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-ctrl__num">{item.quantity}</span>
                  <button className="qty-ctrl__btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                {/* Line total */}
                <div className="cart-item-price" style={{ minWidth: '80px', textAlign: 'right', fontWeight: 800, fontSize: '15px', color: '#111827', flexShrink: 0 }}>
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </div>
                {/* Remove */}
                <button className="cart-item-remove" onClick={() => { removeItem(item._id); toast.success('Removed'); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB', marginLeft: '24px', flexShrink: 0, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}
                >
                  <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary panel */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '20px' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                <span>Subtotal ({cartCount} items)</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                <span>You saved</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>$2.00</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>${(cartTotal > 0 ? cartTotal : 0).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '15px' }}>
              Proceed to Checkout →
            </Link>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { 
          .cart-layout { grid-template-columns: 1fr !important; } 
          .cart-item { flex-wrap: wrap; gap: 12px; padding: 16px !important; }
          .cart-item-info { flex: 1 1 calc(100% - 80px) !important; margin-left: 12px !important; }
          .cart-item-qty { margin: 0 auto 0 0 !important; }
          .cart-item-price { margin-left: auto !important; }
          .cart-item-remove { margin-left: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
