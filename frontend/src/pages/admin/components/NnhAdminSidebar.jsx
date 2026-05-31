import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

const navGroups = [
  {
    title: 'QUẢN LÝ CỐT LÕI',
    items: [
      { to: '/admin/dashboard', icon: 'dashboard', label: 'Tổng quan' },
      { to: '/admin/danh-muc',  icon: 'folder', label: 'Danh mục' },
      { to: '/admin/banner',    icon: 'view_carousel', label: 'Banner' },
      { to: '/admin/san-pham',  icon: 'inventory_2', label: 'Sản phẩm' },
      { to: '/admin/user',      icon: 'group', label: 'Người dùng' },
      { to: '/admin/don-hang',  icon: 'local_shipping', label: 'Đơn hàng' },
      { to: '/admin/chi-tiet',  icon: 'receipt_long', label: 'Chi tiết đơn hàng' },
      { to: '/admin/thuoc-tinh', icon: 'sell', label: 'Thuộc tính' },
      { to: '/admin/danhmuc-thuoctinh', icon: 'link', label: 'Thông số theo danh mục' },
      { to: '/admin/giatri-thuoctinh', icon: 'settings', label: 'Giá trị thuộc tính' },
      { to: '/admin/danh-gia', icon: 'rate_review', label: 'Đánh giá' },
      { to: '/admin/voucher', icon: 'confirmation_number', label: 'Voucher' },
    ]
  },
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
  },
  {
    title: 'QUẢN LÝ KHÁC',
    items: [
      { to: '/admin/sanpham-hinhanh', icon: 'imagesmode', label: 'Hình ảnh sản phẩm' },
      { to: '/admin/user-voucher', icon: 'loyalty', label: 'Voucher người dùng' },
      { to: '/admin/giohang-tam', icon: 'shopping_cart', label: 'Giỏ hàng tạm' },
    ]
  }
];

export default function NnhAdminSidebar() {
  const isDark = useAdminTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`fixed left-0 top-0 h-full flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'} text-sm tracking-tight w-64 border-r transition-colors duration-300 z-50 font-['Space_Grotesk']`}>
      <div className="p-6 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white">rocket_launch</span>
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Zenith Ztore</h1>
            <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Admin Console</p>
          </div>
        </div>
        
        <nav className="space-y-6">
          {navGroups
            .filter(group => {
              if (user?.role === 'nhanvien') {
                return group.title === 'THUÊ SẢN PHẨM' || group.title === 'DỊCH VỤ & TƯ VẤN';
              }
              return true;
            })
            .map((group, groupIdx) => (
              <div key={groupIdx}>
              <div className="text-[10px] font-bold text-slate-500 mb-2 px-4 tracking-widest uppercase">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items
                  .filter(item => !(item.to === '/admin/user' && user?.role !== 'admin'))
                  .map((item) => (
                    <NavLink 
                      key={item.to} 
                      to={item.to} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-2.5 font-semibold transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500' 
                            : `${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
                        }`
                      }
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))
                }
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className={`mt-auto p-6 space-y-1 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all duration-200 font-bold active:scale-95">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
