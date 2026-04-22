import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TtaSidebar from '../components/tta_sidebar';

const pageTitles = {
  '/admin/dashboard': { title: 'Tổng quan', sub: 'Chào mừng trở lại!' },
  '/admin/danh-muc': { title: 'Danh mục', sub: 'Quản lý danh mục sản phẩm' },
  '/admin/san-pham': { title: 'Sản phẩm', sub: 'Quản lý kho sản phẩm' },
  '/admin/user': { title: 'Người dùng', sub: 'Quản lý tài khoản người dùng' },
  '/admin/don-hang': { title: 'Đơn hàng', sub: 'Quản lý vận đơn và thanh toán' },
  '/admin/chi-tiet': { title: 'Chi tiết đơn hàng', sub: 'Nhật ký chi tiết các giao dịch' },
};

export default function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageInfo = pageTitles[currentPath] || { title: 'Admin', sub: 'Hệ thống quản lý' };

  return (
    <div className="admin-layout">
      <TtaSidebar />
      <main className="admin-content">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">{pageInfo.title}</h1>
            <p className="page-subtitle">{pageInfo.sub}</p>
          </div>
          <div className="header-right">
            <div className="system-tag">G5 KD Do Cong Nghe</div>
          </div>
        </header>
        <section className="page-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
