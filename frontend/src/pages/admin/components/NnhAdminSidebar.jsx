import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: 'dashboard', label: 'Tổng quan' },
  { to: '/admin/danh-muc',  icon: 'folder', label: 'Danh mục' },
  { to: '/admin/san-pham',  icon: 'inventory_2', label: 'Sản phẩm' },
  { to: '/admin/user',      icon: 'group', label: 'Người dùng' },
  { to: '/admin/don-hang',  icon: 'local_shipping', label: 'Đơn hàng' },
  { to: '/admin/chi-tiet',  icon: 'receipt_long', label: 'Chi tiết đơn hàng' },
  { to: '/admin/thuoc-tinh', icon: 'sell', label: 'Thuộc tính' },
  { to: '/admin/danhmuc-thuoctinh', icon: 'link', label: 'Thông số theo danh mục' },
  { to: '/admin/giatri-thuoctinh', icon: 'settings', label: 'Giá trị thuộc tính' },
  { to: '/admin/danh-gia', icon: 'rate_review', label: 'Đánh giá' },
  { to: '/admin/voucher', icon: 'confirmation_number', label: 'Voucher' },
];

export default function NnhAdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col bg-slate-900 text-slate-400 font-['Space_Grotesk'] text-sm tracking-tight w-64 border-r border-slate-800 shadow-2xl shadow-blue-900/20 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white">rocket_launch</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">Zenith Ztore</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Admin Console</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-500 mb-4 px-4 tracking-widest uppercase">MENU</div>
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 space-y-1 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all duration-200 font-bold active:scale-95">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
