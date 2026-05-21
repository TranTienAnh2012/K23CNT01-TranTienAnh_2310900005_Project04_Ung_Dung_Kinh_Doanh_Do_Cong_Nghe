import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { shopApi } from '../../../api/tta_api';

export default function NvtClientTrangCaNhan() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await shopApi.getOrders();
        if (res.data?.data) setOrders(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-purple-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Yêu cầu đăng nhập</h2>
        <p className="text-sm text-slate-500">Bạn cần đăng nhập để xem trang cá nhân.</p>
        <Link to="/login" className="inline-block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const getStatusBadge = (s) => {
    const map = {
      'Pending': { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Chờ xử lý': { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Chờ xác nhận': { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Processing': { label: 'Đã xác nhận', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      'Đã xác nhận': { label: 'Đã xác nhận', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      'Đang giao': { label: 'Đang giao', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
      'Shipping': { label: 'Đang giao', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
      'Hoàn thành': { label: 'Hoàn thành', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'Completed': { label: 'Hoàn thành', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'Đã hủy': { label: 'Đã hủy', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
      'Cancelled': { label: 'Đã hủy', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    };
    const info = map[s] || { label: s, cls: 'bg-slate-50 text-slate-700 border-slate-200' };
    return (
      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${info.cls}`}>
        {info.label}
      </span>
    );
  };

  const completedOrders = orders.filter(o => o.TrangThai === 'Hoàn thành' || o.TrangThai === 'Completed');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.TongTien || 0), 0);

  return (
    <div className="py-8 font-['Inter'] max-w-5xl mx-auto space-y-8">
      {/* HERO CARD */}
      <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-16 -translate-x-10" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-3xl font-['Space_Grotesk'] shadow-inner backdrop-blur-sm">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-['Space_Grotesk']">Trang Cá Nhân</h1>
              <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full border border-white/30 uppercase tracking-wider">
                Khách hàng
              </span>
            </div>
            <p className="text-white/80 text-sm font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">mail</span>
              {user.email}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 md:mt-0">
            <div className="text-center bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-black font-['Space_Grotesk']">{orders.length}</p>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Đơn hàng</p>
            </div>
            <div className="text-center bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-black font-['Space_Grotesk']">{completedOrders.length}</p>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Hoàn thành</p>
            </div>
            <div className="text-center bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-lg font-black font-['Space_Grotesk'] truncate" title={formatPrice(totalSpent)}>
                {totalSpent > 0 ? (totalSpent / 1_000_000).toFixed(1) + 'M' : '0'}
              </p>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Đã chi</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[
          { id: 'profile', label: 'Thông tin', icon: 'person' },
          { id: 'orders', label: 'Đơn hàng', icon: 'receipt_long' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: THÔNG TIN */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-['Space_Grotesk'] flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-lg">account_circle</span>
              Thông tin tài khoản
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Email</span>
                <span className="font-semibold text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Vai trò</span>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold border border-purple-100 uppercase">{user.role || 'Khách hàng'}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Trạng thái</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-['Space_Grotesk'] flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-lg">bar_chart</span>
              Thống kê mua sắm
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-50 text-sm">
                <span className="text-slate-500">Tổng đơn hàng</span>
                <span className="font-black text-slate-800">{orders.length} đơn</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-50 text-sm">
                <span className="text-slate-500">Đơn hoàn thành</span>
                <span className="font-black text-emerald-600">{completedOrders.length} đơn</span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-500">Tổng chi tiêu</span>
                <span className="font-black text-purple-600">{formatPrice(totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'receipt_long', label: 'Đơn hàng của tôi', to: '/lich-su-don-hang', color: 'purple' },
              { icon: 'storefront', label: 'Tiếp tục mua sắm', to: '/', color: 'slate' },
              { icon: 'local_offer', label: 'Khuyến mãi', to: '/', color: 'amber' },
              { icon: 'headset_mic', label: 'Hỗ trợ', to: '/', color: 'blue' },
            ].map(link => (
              <Link key={link.label} to={link.to}
                className="flex flex-col items-center gap-2 py-5 bg-white border border-slate-100 hover:border-purple-200 rounded-2xl text-center shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-${link.color}-50 text-${link.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                </div>
                <span className="text-xs font-bold text-slate-600">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="md:col-span-2">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-100 hover:border-rose-200 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Đăng xuất khỏi tài khoản
            </button>
          </div>
        </div>
      )}

      {/* TAB: ĐƠN HÀNG */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loading ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-3 text-purple-600">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold animate-pulse">Đang tải đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-4">
              <span className="material-symbols-outlined text-4xl text-slate-300">shopping_cart_checkout</span>
              <p className="font-bold text-slate-500">Chưa có đơn hàng nào</p>
              <Link to="/" className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all">
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.MaDonHang}
                className="bg-white border border-slate-100 hover:border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800 font-['Space_Grotesk']">Đơn #{order.MaDonHang}</span>
                    {getStatusBadge(order.TrangThai)}
                    {order.TrangThaiThanhToan === 'Paid' && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold">Đã TT</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{formatDate(order.NgayDatHang)}</p>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                          {getImageUrl(item.HinhAnh)
                            ? <img src={getImageUrl(item.HinhAnh)} alt={item.TenSanPham} className="w-full h-full object-contain" />
                            : <span className="material-symbols-outlined text-sm text-slate-300">image</span>
                          }
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-700 max-w-[100px] truncate">{item.TenSanPham}</p>
                          <p className="text-[10px] text-slate-400">x{item.SoLuong}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex-shrink-0 flex items-center px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-500">+{order.items.length - 4} SP</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                  <p className="text-xs text-slate-400 font-medium">{order.PhuongThucThanhToan}</p>
                  <p className="font-black text-purple-600 text-sm font-['Space_Grotesk']">{formatPrice(order.TongTien)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
