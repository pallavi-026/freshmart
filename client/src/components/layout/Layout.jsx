import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Navbar />
    {/* pt accounts for the new 80px main nav + 60px category strip */}
    <main style={{ flex: 1, paddingTop: '140px' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
