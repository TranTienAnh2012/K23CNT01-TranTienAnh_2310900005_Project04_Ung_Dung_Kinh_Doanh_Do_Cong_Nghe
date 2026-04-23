import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NnhAdminSidebar from '../pages/admin/components/NnhAdminSidebar';

const pageTitles = {
  '/admin/dashboard': { title: 'Tổng quan', sub: 'Hệ sinh thái đang hoạt động ổn định' },
  '/admin/danh-muc': { title: 'Danh mục', sub: 'Quản lý danh mục sản phẩm' },
  '/admin/san-pham': { title: 'Sản phẩm', sub: 'Quản lý kho sản phẩm' },
  '/admin/user': { title: 'Người dùng', sub: 'Quản lý tài khoản người dùng' },
  '/admin/don-hang': { title: 'Đơn hàng', sub: 'Quản lý vận đơn và thanh toán' },
  '/admin/chi-tiet': { title: 'Chi tiết đơn hàng', sub: 'Nhật ký chi tiết các giao dịch' },
  '/admin/thuoc-tinh': { title: 'Thuộc tính', sub: 'Quản lý thuộc tính hệ thống' },
  '/admin/danhmuc-thuoctinh': { title: 'Thông số danh mục', sub: 'Bản đồ thuộc tính' },
  '/admin/giatri-thuoctinh': { title: 'Giá trị thuộc tính', sub: 'Cấu hình chi tiết' },
};

export default function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageInfo = pageTitles[currentPath] || { title: 'Hệ thống Quản trị', sub: 'Zenith Ztore Admin' };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-['Inter']">
      <NnhAdminSidebar />
      
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-3 ml-64 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 font-['Space_Grotesk'] antialiased">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black text-white">Zenith Ztore</h2>
          <div className="h-6 w-[1px] bg-slate-700"></div>
          <span className="text-slate-400 font-medium">{pageInfo.title}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">search</span>
            <input className="bg-slate-800 border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-500 outline-none" placeholder="Tìm kiếm dữ liệu..." type="text"/>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-blue-400 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <button className="hover:text-blue-400 transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </button>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-none">Admin G5</p>
              <p className="text-[10px] text-slate-500">Super Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">G5</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
}
