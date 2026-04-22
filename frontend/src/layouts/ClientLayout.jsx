import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div className="client-layout">
      <header style={{ padding: '20px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>G5 TECH STORE</h1>
        <nav>
          <Link to="/" style={{ color: '#fff', marginRight: '20px' }}>Trang chủ</Link>
          <Link to="/products" style={{ color: '#fff', marginRight: '20px' }}>Sản phẩm</Link>
          <Link to="/login" style={{ color: '#fff' }}>Đăng nhập</Link>
        </nav>
      </header>
      
      <main style={{ padding: '20px', minHeight: '80vh' }}>
        <Outlet />
      </main>
      
      <footer style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5' }}>
        <p>&copy; 2026 G5 Tech Store. Thiết kế bởi Antigravity.</p>
      </footer>
    </div>
  );
};

export default ClientLayout;
