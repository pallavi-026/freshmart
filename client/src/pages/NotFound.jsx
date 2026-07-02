import { Link } from 'react-router-dom';

const NotFound = () => (
  <div
    style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8F9FA',
      padding: '20px',
    }}
  >
    <div
      className="fade-up"
      style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}
    >
      {/* Illustration */}
      <div
        style={{
          width: '120px',
          height: '120px',
          background: '#f0fdf4',
          border: '2px solid #dcfce7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '52px',
        }}
      >
        🛒
      </div>

      {/* Error Code */}
      <p
        style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#22c55e',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '12px',
        }}
      >
        404 — Page Not Found
      </p>

      <h1
        style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#111827',
          letterSpacing: '-0.5px',
          marginBottom: '12px',
          lineHeight: 1.25,
        }}
      >
        Oops! This aisle doesn't exist.
      </h1>

      <p
        style={{
          fontSize: '15px',
          color: '#6B7280',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}
      >
        The page you're looking for has been moved, deleted, or never existed.
        Let's get you back to fresh groceries.
      </p>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/"
          className="btn-primary"
          style={{ padding: '12px 32px', fontSize: '15px', borderRadius: '10px' }}
        >
          Back to Home
        </Link>
        <Link
          to="/products"
          className="btn-outline-green"
          style={{ padding: '12px 32px', fontSize: '15px', borderRadius: '10px' }}
        >
          Browse Products
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
