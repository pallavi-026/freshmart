import { useEffect, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPlus, HiX } from 'react-icons/hi';

const Admin = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Fruits', image: '', stock: 100, unit: 'piece' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([API.get('/products?limit=100'), API.get('/admin/orders')]);
      if (pRes.data.success) setProducts(pRes.data.data);
      if (oRes.data.success) setOrders(oRes.data.data);
    } catch (err) {
      console.warn('[Admin] fetchData error:', err?.message);
      toast.error('Failed to load admin data. Please refresh.');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) { await API.put(`/products/${editProduct._id}`, { ...form, price: Number(form.price), stock: Number(form.stock) }); toast.success('Updated'); }
      else { await API.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) }); toast.success('Added'); }
      setShowForm(false); setEditProduct(null); setForm({ name: '', description: '', price: '', category: 'Fruits', image: '', stock: 100, unit: 'piece' }); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (p) => { setEditProduct(p); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock, unit: p.unit }); setShowForm(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/products/${id}`); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); } };
  const updateStatus = async (id, status) => { try { await API.put(`/admin/orders/${id}`, { status }); toast.success('Updated'); fetchData(); } catch { toast.error('Failed'); } };

  if (loading) return <Loader />;

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: '60px' }}>
      <div className="app-container fade-up" style={{ paddingTop: '40px', maxWidth: '1000px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Admin Dashboard</h1>
            <p style={{ fontSize: '15px', color: '#6B7280' }}>Manage products and track all customer orders.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '6px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            {['products', 'orders'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: '8px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
                  textTransform: 'capitalize', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: tab === t ? '#f0fdf4' : 'transparent',
                  color: tab === t ? '#15803d' : '#6B7280',
                }}>
                {t} <span style={{ marginLeft: '4px', background: tab === t ? '#dcfce7' : '#F3F4F6', color: tab === t ? '#15803d' : '#9CA3AF', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{t === 'products' ? products.length : orders.length}</span>
              </button>
            ))}
          </div>
        </div>

        {tab === 'products' && (
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Product Inventory</h2>
              <button onClick={() => { setEditProduct(null); setForm({ name: '', description: '', price: '', category: 'Fruits', image: '', stock: 100, unit: 'piece' }); setShowForm(true); }}
                style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <HiPlus style={{ width: '16px', height: '16px' }} /> Add Product
              </button>
            </div>

            {showForm && (
              <div style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>{editProduct ? 'Edit' : 'Add'} Product</h3>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><HiX style={{ width: '20px', height: '20px' }} /></button>
                </div>
                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Product Name</label>
                    <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="input-base" style={{ fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Price ($)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required className="input-base" style={{ fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label>
                    <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-base" style={{ fontSize: '14px' }}>
                      {['Fruits','Vegetables','Dairy','Bakery','Beverages','Snacks','Grains','Meat','Frozen','Organic'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Unit</label>
                      <select value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} className="input-base" style={{ fontSize: '14px' }}>
                        {['kg','liter','piece','pack','dozen','gram','ml'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Stock</label>
                      <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="input-base" style={{ fontSize: '14px' }} />
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Image URL</label>
                    <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="input-base" style={{ fontSize: '14px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required className="input-base" style={{ fontSize: '14px', resize: 'vertical', minHeight: '80px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                      {editProduct ? 'Save Changes' : 'Publish Product'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map((p) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px' }}>
                  <img src={p.image} alt="" style={{ width: '64px', height: '64px', objectFit: 'contain', background: '#F8F9FA', borderRadius: '8px', padding: '4px' }} onError={e => { e.target.src = 'https://placehold.co/200x200/F8F9FA/9CA3AF?text=FM'; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      {p.stock < 10 && <span style={{ background: '#fef2f2', color: '#ef4444', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>LOW STOCK</span>}
                    </div>
                    <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
                      <span style={{ color: '#22c55e', fontWeight: 700 }}>${p.price.toFixed(2)}</span> • {p.category} • {p.stock} {p.unit}s left
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(p)} style={{ padding: '8px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><HiPencil style={{ width: '16px', height: '16px' }} /></button>
                    <button onClick={() => handleDelete(p._id)} style={{ padding: '8px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><HiTrash style={{ width: '16px', height: '16px' }} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>All Orders</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((o) => (
                <div key={o._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#F8F9FA', border: '1px solid #EBEBEB', borderRadius: '12px' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Order #{o._id.slice(-8)}</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>{o.user?.name} <span style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '14px' }}>({o.user?.email})</span></p>
                    <p style={{ fontSize: '14px', color: '#4B5563' }}>{o.items.length} items • <span style={{ color: '#15803d', fontWeight: 700 }}>${o.totalAmount.toFixed(2)}</span></p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Status:</span>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} 
                      style={{ 
                        padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', outline: 'none', cursor: 'pointer',
                        background: o.status === 'Delivered' ? '#dcfce7' : o.status === 'Pending' ? '#fef9c3' : o.status === 'Cancelled' ? '#fee2e2' : '#e0e7ff',
                        color: o.status === 'Delivered' ? '#15803d' : o.status === 'Pending' ? '#a16207' : o.status === 'Cancelled' ? '#b91c1c' : '#4338ca'
                      }}>
                      {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
