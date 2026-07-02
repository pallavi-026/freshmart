import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, cartTotal, cartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', phone: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isManual, setIsManual] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const selectSavedAddress = (addr) => {
    setAddress({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      phone: addr.phone || ''
    });
    setSelectedId(addr._id);
    setIsManual(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        if (data.success && data.data.addresses?.length > 0) {
          setSavedAddresses(data.data.addresses);
          selectSavedAddress(data.data.addresses[0]);
        } else {
          setIsManual(true);
        }
      } catch (err) { setIsManual(true); }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zip || !address.phone) {
      toast.error('Please fill out all delivery details');
      return;
    }
    if (!/^[0-9]{10}$/.test(address.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post('/orders', {
        shippingAddress: address,
        paymentMethod: paymentMethod
      });
      if (data.success) {
        await fetchCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cart.items?.length) navigate('/cart');
  }, [cart.items]);

  if (!cart.items?.length) return null;

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh' }}>
      <div className="app-container fade-up" style={{ paddingTop: '28px', paddingBottom: '40px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
          <Link to="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/cart" style={{ color: '#6B7280', textDecoration: 'none' }}>Cart</Link>
          <span>›</span>
          <span style={{ color: '#111827' }}>Checkout</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }} className="cart-layout">
          
          {/* Left Column - Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Delivery Address */}
            <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Delivery Address</h2>
                {savedAddresses.length > 0 && (
                  <button onClick={() => { setIsManual(!isManual); if(!isManual) setSelectedId(null); }} 
                    style={{ background: 'none', border: 'none', color: '#22c55e', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    {isManual ? 'View Saved Addresses' : '+ Use New Address'}
                  </button>
                )}
              </div>
              
              {!isManual && savedAddresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {savedAddresses.map((addr) => (
                    <div key={addr._id} onClick={() => selectSavedAddress(addr)}
                      style={{ 
                        padding: '16px', borderRadius: '12px', border: '2px solid', 
                        borderColor: selectedId === addr._id ? '#22c55e' : '#F0F0F0',
                        background: selectedId === addr._id ? '#f0fdf4' : '#fff',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{addr.street}</p>
                        {selectedId === addr._id && <span style={{ color: '#22c55e', fontSize: '18px' }}>✓</span>}
                      </div>
                      <p style={{ fontSize: '13px', color: '#6B7280' }}>{addr.city}, {addr.state} - {addr.zip}</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>📞 {addr.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Street Address</label>
                    <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="House No, Street, Area" className="input-base" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>City</label>
                    <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="City" className="input-base" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>State / Province</label>
                    <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="State" className="input-base" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>ZIP / Postal Code</label>
                    <input type="text" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} placeholder="Zip Code" className="input-base" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Phone Number</label>
                    <input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="10-digit number" className="input-base" />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Payment Method</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'Credit / Debit Card', icon: '💳' },
                  { id: 'UPI', icon: '📱' },
                  { id: 'PayPal', icon: '🅿️' },
                  { id: 'Cash on Delivery', icon: '💵' }
                ].map((method) => (
                  <label key={method.id} style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                    border: paymentMethod === method.id ? '1px solid #22c55e' : '1px solid #E5E7EB', 
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    background: paymentMethod === method.id ? '#f0fdf4' : '#fff'
                  }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method.id} 
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: '#22c55e', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '18px' }}>{method.icon}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{method.id}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '8px' }} className="no-scrollbar">
              {cart.items.map((item) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F8F9FA', borderRadius: '8px', padding: '4px', flexShrink: 0 }}>
                    <img src={item.product?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.src = 'https://placehold.co/200x200/F8F9FA/9CA3AF?text=FM'; }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                    ${(item.product?.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', borderTop: '1px dashed #E5E7EB', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                <span>You Saved</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>$4.99</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>${(cartTotal > 0 ? cartTotal : 0).toFixed(2)}</span>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '15px' }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure & Safe Payments
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Checkout;
