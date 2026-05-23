import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../../api/tta_api';

/**
 * TtaDashboard - Trang điều khiển trung tâm của quản trị viên
 */
export default function TtaDashboard() {
  const navigate = useNavigate();
  
  // --- STATES DỮ LIỆU ---
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, specs: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATES CÀI ĐẶT GIAO DIỆN ---
  const [isExpanded, setIsExpanded] = useState(() => localStorage.getItem('tta_dashboard_quickmgmt_expanded') === 'true');
  const [visibleLinkIds, setVisibleLinkIds] = useState(() => {
    const saved = localStorage.getItem('tta_admin_visible_links');
    return saved ? JSON.parse(saved) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  });
  
  // Kiểm tra theme hiện tại từ document element
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Đồng bộ cài đặt từ Header (localStorage)
  useEffect(() => {
    const syncSettings = () => {
      const saved = localStorage.getItem('tta_admin_visible_links');
      if (saved) setVisibleLinkIds(JSON.parse(saved));
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('tta_settings_updated', syncSettings);
    // Observer để theo dõi thay đổi class 'dark' trên root
    const observer = new MutationObserver(syncSettings);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('tta_settings_updated', syncSettings);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tta_dashboard_quickmgmt_expanded', isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getSummary();
        const data = response.data.data;
        setStats(data.stats);
        setRecentActivities(data.recentActivities);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const allQuickLinks = [
    { id: 1, title: 'Quản Lý Sản Phẩm', desc: 'Thêm mới & cập nhật kho hàng', path: '/admin/san-pham', icon: 'add_box', color: 'blue' },
    { id: 2, title: 'Quản Lý Đơn Hàng', desc: 'Kiểm duyệt & xử lý vận chuyển', path: '/admin/don-hang', icon: 'inventory', color: 'orange' },
    { id: 3, title: 'Quản Lý Người Dùng', desc: 'Phân quyền & hỗ trợ khách hàng', path: '/admin/user', icon: 'group', color: 'emerald' },
    { id: 4, title: 'Quản Lý Voucher', desc: 'Chiến dịch khuyến mãi & giảm giá', path: '/admin/voucher', icon: 'campaign', color: 'purple' },
    { id: 5, title: 'Quản Lý Danh Mục', desc: 'Phân loại nhóm sản phẩm', path: '/admin/danh-muc', icon: 'category', color: 'cyan' },
    { id: 6, title: 'Thông Số Kỹ Thuật', desc: 'Quản lý cấu hình chi tiết', path: '/admin/giatri-thuoctinh', icon: 'rule', color: 'rose' },
    { id: 7, title: 'Định Nghĩa Thuộc Tính', desc: 'Tạo các thuộc tính sản phẩm', path: '/admin/thuoc-tinh', icon: 'settings_suggest', color: 'amber' },
    { id: 8, title: 'Chi Tiết Đơn Hàng', desc: 'Kiểm tra thông tin hàng hóa', path: '/admin/chi-tiet', icon: 'list_alt', color: 'indigo' },
    { id: 9, title: 'Quản Lý Đánh Giá', desc: 'Phản hồi khách hàng & uy tín', path: '/admin/danh-gia', icon: 'star', color: 'yellow' },
    { id: 10, title: 'Danh Mục Thuộc Tính', desc: 'Ánh xạ thuộc tính theo loại', path: '/admin/danhmuc-thuoctinh', icon: 'account_tree', color: 'teal' },
  ];

  // Lọc danh sách link theo cài đặt visibility VÀ THỨ TỰ người dùng chọn
  const quickLinks = visibleLinkIds
    .map(id => allQuickLinks.find(link => link.id === id))
    .filter(Boolean);

  if (loading) return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950 text-blue-400' : 'bg-slate-50 text-blue-600'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Đang tải báo cáo hệ thống...</p>
      </div>
    </div>
  );

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] font-['Inter'] transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {/* Banner Chào Mừng */}
      <section className="mb-8 relative overflow-hidden rounded-2xl bg-blue-600 p-8 shadow-xl shadow-blue-900/20">
        <div className="relative z-10">
          <h3 className="font-['Space_Grotesk'] text-4xl font-bold text-white mb-2">Welcome back, Admin G5.</h3>
          <p className="text-lg text-blue-100 opacity-90 max-w-2xl">Hệ sinh thái Zenith đang hoạt động tối ưu. Hệ thống đang đồng bộ dữ liệu thời gian thực từ cơ sở dữ liệu.</p>
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">Xuất Báo Cáo</button>
            <button className="px-6 py-2 bg-blue-500 text-white border border-blue-400/30 font-bold rounded-lg hover:bg-blue-400 transition-all">Xem Logs</button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none text-white">
          <span className="material-symbols-outlined text-[300px] absolute -right-20 -top-20">terminal</span>
        </div>
      </section>

      {/* Lưới Chỉ Số KPI */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { key: 'products', title: 'Tổng Sản Phẩm', icon: 'inventory_2', color: 'blue', path: '/admin/san-pham' },
          { key: 'users', title: 'Tổng Người Dùng', icon: 'group', color: 'purple', path: '/admin/user' },
          { key: 'orders', title: 'Tổng Đơn Hàng', icon: 'shopping_cart', color: 'orange', path: '/admin/don-hang' },
          { key: 'specs', title: 'Thông số kỹ thuật', icon: 'settings_input_component', color: 'cyan', path: '/admin/giatri-thuoctinh' }
        ].map((item) => (
          <div 
            key={item.key}
            onClick={() => navigate(item.path)} 
            className={`${isDark ? 'bg-slate-900/70 border-white/5 hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-500 shadow-sm'} backdrop-blur-md border p-6 rounded-xl group transition-all duration-300 cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? `bg-${item.color}-500/10 text-${item.color}-400` : `bg-${item.color}-500 text-white`}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${isDark ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-700 bg-emerald-100'}`}>Real-time</span>
            </div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-semibold text-sm mb-1`}>{item.title}</p>
            <h4 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>{stats[item.key]}</h4>
            <div className="h-10 w-full flex items-end gap-1">
              {[40, 60, 50, 80, 70, 95].map((h, i) => (
                <div key={i} className={`flex-1 ${i === 5 ? 'bg-blue-500' : `${isDark ? 'bg-blue-500/20 group-hover:bg-blue-500/40' : 'bg-blue-100 group-hover:bg-blue-200'}`} rounded-t-sm transition-all`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Phần: Quản Lý Nhanh */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h5 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Quản Lý Nhanh</h5>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-white border-slate-200 text-blue-600 shadow-sm'} text-sm font-bold rounded-lg transition-all border`}
              >
                <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                {isExpanded ? 'Thu Gọn' : 'Xem Thêm'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.slice(0, isExpanded ? quickLinks.length : 4).map((link) => (
              <div 
                key={link.id}
                onClick={() => navigate(link.path)}
                className={`${isDark ? 'bg-slate-900/70 border-white/5 hover:bg-slate-800/80' : 'bg-white border-slate-200 hover:border-blue-50 shadow-sm'} backdrop-blur-md border p-6 rounded-xl transition-all cursor-pointer group border-l-4 border-l-${link.color}-500`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${isDark ? 'bg-slate-800' : 'bg-slate-100'} text-${link.color}-500`}>
                    <span className="material-symbols-outlined">{link.icon}</span>
                  </div>
                  <div>
                    <h6 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{link.title}</h6>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{link.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phần: Hoạt Động Gần Đây */}
          <div className={`mt-8 ${isDark ? 'bg-slate-900/70 border-white/5' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md border rounded-2xl overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'} flex justify-between items-center`}>
              <h6 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Hoạt Động Gần Đây</h6>
              <button onClick={() => navigate('/admin/don-hang')} className="text-xs font-bold text-blue-500 uppercase tracking-widest hover:underline">Xem Tất Cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className={`${isDark ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-100'} text-xs uppercase tracking-wider border-b`}>
                    <th className="px-6 py-4 font-semibold">Đối Tượng</th>
                    <th className="px-6 py-4 font-semibold">Hành Động</th>
                    <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                    <th className="px-6 py-4 font-semibold">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {recentActivities.map((act, index) => (
                    <tr key={index} className={`border-b ${isDark ? 'border-slate-800/50 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50/50'} transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <span className="material-symbols-outlined text-xs">{act.icon}</span>
                          </div>
                          <span className="font-medium">{act.target}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{act.action}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                          act.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 
                          act.status === 'Active' || act.status === 'Thành công' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {act.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 opacity-60">{new Date(act.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột Phụ: Giám Sát Hệ Thống */}
        <div className="space-y-6">
          <h5 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Giám Sát</h5>
          <div className={`${isDark ? 'bg-slate-900/70 border-white/5' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md border p-6 rounded-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <h6 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Hệ thống ổn định</h6>
            </div>
            <div className="space-y-4">
              {[
                { icon: 'warning', color: 'orange', title: 'Thiếu Media', desc: 'Một số sản phẩm cần kiểm tra lại hình ảnh.' },
                { icon: 'backup', color: 'blue', title: 'Sao Lưu Hoàn Tất', desc: 'Dữ liệu đã được bảo vệ an toàn.' }
              ].map((item, idx) => (
                <div key={idx} className={`flex items-start gap-4 p-3 rounded-lg ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'} border`}>
                  <span className={`material-symbols-outlined text-${item.color}-500`}>{item.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${isDark ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'} p-6 rounded-xl border`}>
            <h6 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Tải Hệ Thống</h6>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="3"></path>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeDasharray="24, 100" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>24%</span>
                </div>
              </div>
              <div>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>An Toàn</p>
                <p className="text-[11px] text-slate-500 leading-tight">Mọi chỉ số đều đang ở mức tối ưu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
