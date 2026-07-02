import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/layout/Layout';
import Loader from './components/ui/Loader';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ui/ChatBot';

// Route-based code splitting — reduces initial bundle size
const Home        = lazy(() => import('./pages/Home'));
const Products    = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login       = lazy(() => import('./pages/Login'));
const Register    = lazy(() => import('./pages/Register'));
const Cart        = lazy(() => import('./pages/Cart'));
const Checkout    = lazy(() => import('./pages/Checkout'));
const Orders      = lazy(() => import('./pages/Orders'));
const Profile     = lazy(() => import('./pages/Profile'));
const Contact     = lazy(() => import('./pages/Contact'));
const Offers      = lazy(() => import('./pages/Offers'));
const Admin       = lazy(() => import('./pages/admin/Admin'));
const NotFound    = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Toaster position="top-center" toastOptions={{
              duration: 2000,
              style: { background: '#fff', color: '#1E293B', border: '1px solid #E2E8F0', fontSize: '14px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
            }} />
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}><Loader /></div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="orders/:id" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  {/* Catch-all 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
            <ChatBot />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
