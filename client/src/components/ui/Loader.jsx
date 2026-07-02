const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
    <div style={{ width: '32px', height: '32px', border: '3px solid #E5E7EB', borderTop: '3px solid #22C55E', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
export default Loader;
