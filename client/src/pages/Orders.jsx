import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { HiCheckCircle, HiClock, HiTruck } from 'react-icons/hi';

const statusCfg = {
  Pending: { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: HiClock },
  Processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: HiClock },
  Shipped: { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: HiTruck },
  Delivered: { bg: 'bg-green-50 text-green-700 border-green-200', icon: HiCheckCircle },
  Cancelled: { bg: 'bg-red-50 text-red-700 border-red-200', icon: HiClock },
};

const Orders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true);
        if (id) { const { data } = await API.get(`/orders/${id}`); if (data.success) setOrder(data.data); }
        else { const { data } = await API.get('/orders'); if (data.success) setOrders(data.data); }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;

  if (id && order) {
    const cfg = statusCfg[order.status] || statusCfg.Pending;
    return (
      <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: '40px' }}>
        <div className="app-container fade-up" style={{ paddingTop: '28px', maxWidth: '800px' }}>
          
          <Link to="/orders" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none', display: 'inline-block', marginBottom: '20px', fontWeight: 600 }}>
            ← Back to All Orders
          </Link>
          
          <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '16px', padding: '32px 24px', marginBottom: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🎉</span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>Order Confirmed!</h1>
            <p style={{ fontSize: '14px', color: '#4B5563', marginTop: '4px' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginTop: '16px', background: '#fff', border: '1px solid #E5E7EB', color: '#374151' }}>
              {order.status}
            </span>
          </div>

          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Items Ordered</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: i < order.items.length - 1 ? '16px' : 0, borderBottom: i < order.items.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <div style={{ width: '56px', height: '56px', background: '#F8F9FA', borderRadius: '8px', padding: '4px', flexShrink: 0 }}>
                    <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.src = 'https://placehold.co/200x200/F8F9FA/9CA3AF?text=FM'; }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Qty: {item.quantity} · ${(item.price).toFixed(2)} each</p>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#4B5563' }}>Total Amount</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Delivery Address</h3>
            <div style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: '#111827', display: 'block', marginBottom: '4px' }}>
                {order.shippingAddress?.name || order.user?.name || 'Customer'}
              </span>
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              {order.shippingAddress.phone && (
                <><br /><span style={{ color: '#9CA3AF' }}>📞 {order.shippingAddress.phone}</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders.length) return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingTop: '60px' }}>
      <div className="app-container text-center">
        <EmptyState icon="📦" title="No orders yet" description="Place your first order!" action={<Link to="/products" className="btn-primary">Shop Now</Link>} />
      </div>
    </div>
  );

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: '40px' }}>
      <div className="app-container fade-up" style={{ paddingTop: '28px', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>My Orders</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((o) => {
            const cfg = statusCfg[o.status] || statusCfg.Pending;
            return (
              <Link key={o._id} to={`/orders/${o._id}`} style={{ 
                display: 'block', background: '#fff', border: '1px solid #F0F0F0', 
                borderRadius: '16px', padding: '20px 24px', textDecoration: 'none',
                transition: 'all 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.borderColor = '#22c55e'} onMouseLeave={e => e.currentTarget.style.borderColor = '#F0F0F0'}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Order #{o._id.slice(-8).toUpperCase()}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: o.status === 'Delivered' ? '#dcfce7' : '#fef3c7', color: o.status === 'Delivered' ? '#15803d' : '#b45309' }}>
                        {o.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
                      {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>${o.totalAmount.toFixed(2)}</p>
                    <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}>View Details →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
