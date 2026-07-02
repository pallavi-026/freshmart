import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const offers = [
  {
    id: 1,
    title: 'Free Delivery',
    subtitle: 'For your first 10 orders',
    code: 'FREEDEL10',
    description: 'No minimum order amount required. Valid on all categories. Applied automatically for new users.',
    color: '#f0fdf4',
    textColor: '#15803d',
    badge: 'NEW USER SPECIAL',
    icon: '🛵'
  },
  {
    id: 2,
    title: '15% OFF on Fruits',
    subtitle: 'Save big on fresh produce',
    code: 'FRESH15',
    description: 'Valid on orders above $20. Max discount $10. Applicable only on Fresh Fruits category.',
    color: '#fff7ed',
    textColor: '#c2410c',
    badge: 'LIMITED TIME',
    icon: '🍎'
  },
  {
    id: 3,
    title: 'Flat $5 OFF',
    subtitle: 'On Dairy & Bakery',
    code: 'DAIRY5',
    description: 'Valid on orders above $30. Save instantly on milk, bread, cheese, and more.',
    color: '#eff6ff',
    textColor: '#1d4ed8',
    badge: 'TODAY ONLY',
    icon: '🥛'
  },
  {
    id: 4,
    title: 'Buy 1 Get 1 Free',
    subtitle: 'On selected Snacks',
    code: 'BOGO',
    description: 'Add two eligible snacks to cart. The item with the lower price will be completely free.',
    color: '#fdf2f8',
    textColor: '#be185d',
    badge: 'POPULAR',
    icon: '🍿'
  },
  {
    id: 5,
    title: 'Super Saver Weekend',
    subtitle: '20% OFF Everything',
    code: 'WEEKEND20',
    description: 'Stock up for the week! Valid strictly on Saturday and Sunday. Max discount $25.',
    color: '#f5f3ff',
    textColor: '#6d28d9',
    badge: 'WEEKEND DEAL',
    icon: '🎉'
  },
  {
    id: 6,
    title: 'Cashback on Organic',
    subtitle: 'Get 10% back to wallet',
    code: 'ORGANIC10',
    description: 'Valid on all organic certified products. Cashback credited within 24 hours of delivery.',
    color: '#f0fdfa',
    textColor: '#0f766e',
    badge: 'HEALTHY CHOICE',
    icon: '🥬'
  }
];

const Offers = () => {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!', { icon: '✂️' });
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: '60px' }}>
      <div className="app-container fade-up" style={{ paddingTop: '40px', maxWidth: '1000px' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Special Offers</h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>
            Exclusive deals and discounts available for FreshMart customers.
          </p>
          {/* Informational note */}
          <div style={{ marginTop: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5, margin: 0 }}>
              To redeem an offer code, please <a href="/contact" style={{ color: '#b45309', fontWeight: 700, textDecoration: 'underline' }}>contact our support team</a> or mention your code when placing your order. Online coupon input is coming soon.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {offers.map(offer => (
            <div key={offer.id} style={{ 
              background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', 
              overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              display: 'flex', flexDirection: 'column'
            }}>
              
              {/* Header */}
              <div style={{ background: offer.color, padding: '24px', position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', top: '16px', right: '16px', 
                  fontSize: '10px', fontWeight: 800, color: offer.textColor, 
                  background: 'rgba(255,255,255,0.8)', padding: '4px 8px', 
                  borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' 
                }}>
                  {offer.badge}
                </span>
                
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{offer.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{offer.title}</h3>
                <p style={{ fontSize: '14px', fontWeight: 600, color: offer.textColor }}>{offer.subtitle}</p>
              </div>

              {/* Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: '24px' }}>
                  {offer.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>Use Code</span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827', border: '1px dashed #D1D5DB', padding: '6px 12px', borderRadius: '8px', background: '#F9FAFB', display: 'inline-block' }}>
                      {offer.code}
                    </span>
                  </div>
                  <button onClick={() => handleCopy(offer.code)} 
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                  >
                    Copy
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Offers;
