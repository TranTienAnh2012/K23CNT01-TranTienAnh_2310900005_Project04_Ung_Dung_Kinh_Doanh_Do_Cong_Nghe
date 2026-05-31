import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/admin/sanpham-thue': { title: 'Sản phẩm thuê', sub: 'Quản lý kho sản phẩm cho thuê' },
  '/admin/donhang-thue': { title: 'Đơn hàng thuê', sub: 'Quản lý đơn đặt thuê của khách hàng' },
  '/admin/chitiet-thue': { title: 'Chi tiết đơn hàng thuê', sub: 'Nhật ký chi tiết các giao dịch thuê' },
  '/admin/lichsu-thue': { title: 'Lịch sử thuê', sub: 'Lịch sử thuê sản phẩm công nghệ' },
  '/admin/dichvu-tuvan': { title: 'Dịch vụ tư vấn', sub: 'Danh sách các gói dịch vụ tư vấn công nghệ' },
  '/admin/lich-tuvan': { title: 'Lịch tư vấn', sub: 'Lịch hẹn tư vấn của khách hàng' },
};

const navGroups = [
  {
    title: 'THUÊ SẢN PHẨM',
    items: [
      { to: '/admin/sanpham-thue', icon: 'event_available', label: 'Sản phẩm thuê' },
      { to: '/admin/donhang-thue', icon: 'shopping_bag', label: 'Đơn hàng thuê' },
      { to: '/admin/chitiet-thue', icon: 'receipt', label: 'Chi tiết đơn hàng thuê' },
      { to: '/admin/lichsu-thue', icon: 'history', label: 'Lịch sử thuê' },
    ]
  },
  {
    title: 'DỊCH VỤ & TƯ VẤN',
    items: [
      { to: '/admin/dichvu-tuvan', icon: 'support_agent', label: 'Dịch vụ tư vấn' },
      { to: '/admin/lich-tuvan', icon: 'calendar_month', label: 'Lịch tư vấn' },
    ]
  }
];

export default function NhanvienLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const pageInfo = pageTitles[currentPath] || { title: 'Nhân viên', sub: 'Trang tác vụ nhân viên Zenith Ztore' };

  const [theme, setTheme] = useState(() => localStorage.getItem('tta_admin_theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
    localStorage.setItem('tta_admin_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-200'} min-h-screen font-['Inter'] transition-colors duration-300`}>
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full flex flex-col ${theme === 'light' ? 'bg-white border-slate-200 shadow-lg' : 'bg-slate-900 border-slate-800'} text-sm tracking-tight w-64 border-r transition-all duration-300 z-50 font-['Space_Grotesk'] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-white">badge</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Zenith Ztore</h1>
              <p className={`text-[10px] uppercase tracking-widest ${theme === 'light' ? 'text-emerald-600 font-bold' : 'text-emerald-400 font-bold'}`}>Staff Console</p>
            </div>
          </div>
          
          <nav className="space-y-6">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="text-[10px] font-bold text-slate-500 mb-2 px-4 tracking-widest uppercase">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink 
                      key={item.to} 
                      to={item.to} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-2.5 font-semibold transition-all duration-200 rounded-lg ${
                          isActive 
                            ? 'bg-emerald-600/10 text-emerald-400 border-r-2 border-emerald-500' 
                            : `${theme === 'light' ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`
                        }`
                      }
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        <div className={`mt-auto p-6 border-t ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all duration-200 font-bold active:scale-95 shadow-md shadow-rose-600/10">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className={`sticky top-0 z-40 flex justify-between items-center px-6 py-3 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-900/80 border-slate-800'} backdrop-blur-md border-b font-['Space_Grotesk'] antialiased`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
          <h2 className={`text-lg font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Zenith Ztore</h2>
          <div className="h-6 w-[1px] bg-slate-700"></div>
          <span className="text-slate-400 font-medium">{pageInfo.title}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">search</span>
            <input className={`${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-white'} border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder-slate-500 outline-none`} placeholder="Tìm tác vụ, đơn hàng..." type="text"/>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="hover:text-emerald-400 transition-colors"
              title="Chuyển đổi giao diện"
            >
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            <button className="hover:text-emerald-400 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
            <div className="text-right">
              <p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-none`}>
                {user?.email || 'Nhanvien G5'}
              </p>
              <p className="text-[10px] text-slate-500">
                Nhân viên hệ thống
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {(user?.email || 'N').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} p-6`}>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold font-['Space_Grotesk'] tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {pageInfo.title}
          </h1>
          <p className="text-sm text-slate-500">
            {pageInfo.sub}
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
