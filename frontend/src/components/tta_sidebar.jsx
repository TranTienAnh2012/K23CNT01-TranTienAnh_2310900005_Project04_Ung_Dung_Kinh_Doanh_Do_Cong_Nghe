import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: 'Tổng quan' },
  { to: '/admin/danh-muc',  icon: '📁', label: 'Danh mục' },
  { to: '/admin/san-pham',  icon: '📦', label: 'Sản phẩm' },
  { to: '/admin/user',      icon: '👥', label: 'Người dùng' },
  { to: '/admin/don-hang',  icon: '🚛', label: 'Đơn hàng' },
  { to: '/admin/chi-tiet',  icon: '📖', label: 'Chi tiết đơn hàng' },
  { to: '/admin/thuoc-tinh', icon: '🏷️', label: 'Thuộc tính' },
  { to: '/admin/danhmuc-thuoctinh', icon: '🔗', label: 'Thông số theo danh mục' },
  { to: '/admin/giatri-thuoctinh', icon: '⚙️', label: 'Giá trị thuộc tính' },
];

export default function TtaSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">⚡</div>
        <div className="brand-text">
          Dien Tu <br />
          <span>Store Admin</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">MENU</div>
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">A</div>
          <div className="user-details">
            <div className="user-name">Admin G5</div>
            <div className="user-role">admin</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
