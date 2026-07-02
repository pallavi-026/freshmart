import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        toast.success('Welcome back! 👋');
        navigate('/products');
      } else {
        toast.error(res.message || 'Invalid email or password', { duration: 5000 });
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #EBEBEB', padding: '36px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>🥬</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Fresh<span style={{ color: '#22C55E' }}>Mart</span></span>
            </Link>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>Welcome back</h1>
            <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Sign in to your account</p>
          </div>

          <button type="button" onClick={async () => {
            try {
              setLoading(true);
              const res = await loginWithGoogle();
              if (res.success) {
                toast.success('Welcome back! 👋');
                navigate('/products');
              } else {
                toast.error(res.message || 'Google login failed');
              }
            } catch (err) {
              toast.error('Google login failed');
            } finally { setLoading(false); }
          }} disabled={loading} style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', transition: 'background 0.2s' }}>
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#9CA3AF', fontSize: '13px' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E5E7EB' }} />
            <span style={{ padding: '0 10px' }}>or sign in with email</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E5E7EB' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="input-base" style={{ fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  className="input-base" style={{ fontSize: '14px', paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showPassword ? (
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', marginTop: '4px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#22C55E', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
