import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiX, HiTrash } from 'react-icons/hi';

const Profile = () => {
  const { user, logout } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ street: '', city: '', state: '', zip: '', phone: '' });

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      if (data.success) {
        setAddresses(data.data.addresses || []);
      }
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/address', newAddr);
      if (data.success) {
        toast.success('Address added!');
        setAddresses(data.data.addresses);
        setShowForm(false);
        setNewAddr({ street: '', city: '', state: '', zip: '', phone: '' });
      }
    } catch (err) { toast.error('Failed to add address'); }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!confirm('Delete this address?')) return;
    try {
      const { data } = await API.delete(`/auth/address/${addrId}`);
      if (data.success) {
        toast.success('Deleted');
        setAddresses(data.data.addresses);
      }
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (!user) return null;

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: '40px' }}>
      <div className="app-container fade-up" style={{ paddingTop: '28px' }}>
        
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>My Account</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="md:grid-cols-3">
          
          {/* Sidebar */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', overflow: 'hidden', height: 'fit-content' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=E5E7EB&color=374151&size=64`} alt="Profile" style={{ borderRadius: '50%' }} />
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{user.name}</h2>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>{user.email}</p>
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <Link to="/profile" style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', background: '#f0fdf4', color: '#15803d', fontWeight: 700, textDecoration: 'none' }}>
                👤 Profile Info
              </Link>
              <Link to="/orders" style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                📦 My Orders
              </Link>
              <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', color: '#EF4444', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="md:col-span-2">
            
            {/* Account Details */}
            <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Account Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{user.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{user.email}</p>
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Saved Addresses
                <button onClick={() => setShowForm(!showForm)} className="btn-outline-green" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {showForm ? <><HiX/> Cancel</> : <><HiPlus/> Add New</>}
                </button>
              </h3>

              {showForm && (
                <form onSubmit={handleAddAddress} style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input placeholder="Street Address" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} className="input-base" style={{ fontSize: '14px' }} required />
                  </div>
                  <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="input-base" style={{ fontSize: '14px' }} required />
                  <input placeholder="State" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} className="input-base" style={{ fontSize: '14px' }} required />
                  <input placeholder="Zip" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} className="input-base" style={{ fontSize: '14px' }} required />
                  <input placeholder="Phone" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} className="input-base" style={{ fontSize: '14px' }} required />
                  <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '10px' }}>Save Address</button>
                </form>
              )}
              
              {addresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {addresses.map((addr) => (
                    <div key={addr._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #F0F0F0', borderRadius: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{addr.street}</p>
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>{addr.city}, {addr.state} - {addr.zip}</p>
                        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>📞 {addr.phone}</p>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                        <HiTrash style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ border: '1px dashed #E5E7EB', borderRadius: '12px', padding: '32px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px', opacity: 0.5 }}>📍</span>
                  <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>No saved addresses yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
