import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NnhAdminSidebar from '../pages/admin/components/NnhAdminSidebar';
import { useAuth } from '../context/AuthContext';

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
  '/admin/danh-gia': { title: 'Đánh giá', sub: 'Phản hồi khách hàng' },
  '/admin/voucher': { title: 'Voucher', sub: 'Khuyến mãi & Ưu đãi' },
};

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const pageInfo = pageTitles[currentPath] || { title: 'Hệ thống Quản trị', sub: 'Zenith Ztore Admin' };

  // --- STATE CÀI ĐẶT ---
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('tta_admin_theme') || 'dark');
  const [visibleLinks, setVisibleLinks] = useState(() => {
    const saved = localStorage.getItem('tta_admin_visible_links');
    return saved ? JSON.parse(saved) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Mặc định hiển thị tất cả
  });

  // Áp dụng Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      // Mặc định (System)
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
    localStorage.setItem('tta_admin_theme', theme);
  }, [theme]);

  // Lưu link hiển thị
  useEffect(() => {
    localStorage.setItem('tta_admin_visible_links', JSON.stringify(visibleLinks));
    // Phát sự kiện để dashboard nhận biết thay đổi ngay lập tức
    window.dispatchEvent(new Event('tta_settings_updated'));
  }, [visibleLinks]);

  const toggleLinkVisibility = (id) => {
    setVisibleLinks(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const moveLink = (index, direction) => {
    const newLinks = [...visibleLinks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setVisibleLinks(newLinks);
  };

  const quickLinkDefinitions = [
    { id: 1, title: 'Sản Phẩm' },
    { id: 2, title: 'Đơn Hàng' },
    { id: 3, title: 'Người Dùng' },
    { id: 4, title: 'Voucher' },
    { id: 5, title: 'Danh Mục' },
    { id: 6, title: 'Thông Số' },
    { id: 7, title: 'Thuộc Tính' },
    { id: 8, title: 'Chi Tiết ĐH' },
    { id: 9, title: 'Đánh Giá' },
    { id: 10, title: 'DM Thuộc Tính' },
  ];

  return (
    <div className={`${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-200'} min-h-screen font-['Inter'] transition-colors duration-300`}>
      <NnhAdminSidebar />
      
      {/* TopNavBar */}
      <header className={`sticky top-0 z-40 flex justify-between items-center px-6 py-3 ml-64 ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-900/80 border-slate-800'} backdrop-blur-md border-b font-['Space_Grotesk'] antialiased`}>
        <div className="flex items-center gap-4">
          <h2 className={`text-lg font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Zenith Ztore</h2>
          <div className="h-6 w-[1px] bg-slate-700"></div>
          <span className="text-slate-400 font-medium">{pageInfo.title}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">search</span>
            <input className={`${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-white'} border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-500 outline-none`} placeholder="Tìm kiếm dữ liệu..." type="text"/>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            {/* Nút Cài đặt */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`hover:text-blue-400 transition-colors ${showSettings ? 'text-blue-400' : ''}`}
              >
                <span className="material-symbols-outlined">settings</span>
              </button>

              {/* Dropdown Cài đặt */}
              {showSettings && (
                <div className={`absolute right-0 mt-3 w-72 ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-800 shadow-2xl'} border rounded-xl p-4 z-50 text-left`}>
                  <h6 className="font-bold text-sm mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">settings</span>
                    Cấu Hình Hệ Thống
                  </h6>
                  
                  {/* Chọn Giao Diện */}
                  <div className="mb-6">
                    <p className="text-[11px] font-bold text-slate-500 uppercase mb-3">Chế độ giao diện</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined text-xl">dark_mode</span>
                        <span className="text-[10px]">Đen</span>
                      </button>
                      <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined text-xl">light_mode</span>
                        <span className="text-[10px]">Trắng</span>
                      </button>
                      <button onClick={() => setTheme('system')} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${theme === 'system' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined text-xl">desktop_windows</span>
                        <span className="text-[10px]">Mặc định</span>
                      </button>
                    </div>
                  </div>

                  {/* Quản lý hiển thị & Thứ tự Quản Lý Nhanh */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase mb-3 flex justify-between items-center">
                      <span>Hiện & Thứ tự Quản Lý Nhanh</span>
                      <span className="text-[9px] lowercase font-medium opacity-60 italic">Kéo thả hoặc dùng mũi tên</span>
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                      {visibleLinks.map((linkId, index) => {
                        const linkDef = quickLinkDefinitions.find(l => l.id === linkId);
                        if (!linkDef) return null;
                        return (
                          <div key={linkId} className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-800/40 border-slate-700/50'}`}>
                            <div className="flex items-center gap-2 overflow-hidden">
                              <button 
                                onClick={() => toggleLinkVisibility(linkId)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">check_box</span>
                              </button>
                              <span className="text-[11px] font-bold truncate">{linkDef.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => moveLink(index, -1)}
                                disabled={index === 0}
                                className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
                              >
                                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                              </button>
                              <button 
                                onClick={() => moveLink(index, 1)}
                                disabled={index === visibleLinks.length - 1}
                                className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
                              >
                                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Các link chưa hiển thị */}
                      {quickLinkDefinitions.filter(l => !visibleLinks.includes(l.id)).map(link => (
                        <button 
                          key={link.id}
                          onClick={() => toggleLinkVisibility(link.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-400'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">check_box_outline_blank</span>
                          <span className="text-[11px] font-bold">{link.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
              <p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-none`}>
                {user?.email || 'Admin G5'}
              </p>
              <p className="text-[10px] text-slate-500">
                {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'nhanvien' ? 'Nhân viên' : 'Người dùng'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {(user?.email || 'G5').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64">
        {/* <Outlet /> chính là "vùng trống" chờ nội dung.
            Khi người dùng truy cập một URL (vd: /admin/san-pham), React Router sẽ lấy component
            tương ứng (NnhSanPhamList) và bơm (inject) vào đúng vị trí này để hiển thị. */}
        <Outlet />
      </main>
      
      {/* Overlay đóng dropdown khi click ra ngoài */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowSettings(false)}
        ></div>
      )}
    </div>
  );
}
