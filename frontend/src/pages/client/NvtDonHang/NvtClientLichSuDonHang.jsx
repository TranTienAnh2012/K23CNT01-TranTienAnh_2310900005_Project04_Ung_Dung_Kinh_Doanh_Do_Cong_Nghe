import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientLichSuDonHang() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unpaid', 'pending', 'shipping', 'completed', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await shopApi.getOrders();
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy lịch sử đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} này không?`)) return;
    setCancellingOrderId(orderId);
    try {
      await shopApi.cancelOrder(orderId);
      alert("Hủy đơn hàng thành công!");
      await fetchOrders();
    } catch (err) {
      console.error("Lỗi hủy đơn hàng:", err);
      alert("Không thể hủy đơn hàng: " + (err.response?.data?.message || err.message));
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-purple-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Yêu cầu đăng nhập</h2>
          <p className="text-sm text-slate-500">
            Bạn cần đăng nhập tài khoản để xem lịch sử mua sắm và theo dõi trạng thái các đơn hàng.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-3">
          <Link
            to="/login?redirect=/lich-su-don-hang"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
          >
            Đăng nhập ngay
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Lọc danh sách đơn hàng theo Tab và Tìm kiếm
  const filteredOrders = orders
    .filter((order) => {
      if (activeTab === 'unpaid') {
        return order.TrangThaiThanhToan === 'Unpaid' && !['Cancelled', 'Đã hủy', 'Đã hủy đơn'].includes(order.TrangThai);
      }
      if (activeTab === 'pending') {
        return ['Pending', 'Chờ xử lý', 'Chờ xác nhận'].includes(order.TrangThai);
      }
      if (activeTab === 'shipping') {
        return ['Shipping', 'Đang giao', 'Đang giao hàng'].includes(order.TrangThai);
      }
      if (activeTab === 'completed') {
        return ['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(order.TrangThai);
      }
      if (activeTab === 'cancelled') {
        return ['Cancelled', 'Đã hủy', 'Đã hủy đơn'].includes(order.TrangThai);
      }
      return true;
    })
    .filter((order) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const matchOrderId = `#${order.MaDonHang}`.includes(query) || `${order.MaDonHang}`.includes(query);
      const matchProductName = order.items?.some(item => 
        item.TenSanPham?.toLowerCase().includes(query)
      );
      return matchOrderId || matchProductName;
    });

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
      case 'Chờ xử lý':
      case 'Chờ xác nhận':
        return 'CHỜ XÁC NHẬN';
      case 'Processing':
      case 'Đã xác nhận':
        return 'ĐÃ XÁC NHẬN';
      case 'Shipping':
      case 'Đang giao':
      case 'Đang giao hàng':
        return 'ĐANG GIAO HÀNG';
      case 'Completed':
      case 'Hoàn thành':
      case 'Đã hoàn thành':
        return 'HOÀN THÀNH';
      case 'Cancelled':
      case 'Đã hủy':
      case 'Đã hủy đơn':
        return 'ĐÃ HỦY';
      default:
        return status.toUpperCase();
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Pending':
      case 'Chờ xử lý':
      case 'Chờ xác nhận':
        return 'text-amber-600';
      case 'Processing':
      case 'Đã xác nhận':
        return 'text-blue-600';
      case 'Shipping':
      case 'Đang giao':
      case 'Đang giao hàng':
        return 'text-purple-600';
      case 'Completed':
      case 'Hoàn thành':
      case 'Đã hoàn thành':
        return 'text-emerald-600';
      case 'Cancelled':
      case 'Đã hủy':
      case 'Đã hủy đơn':
        return 'text-rose-600';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
      case 'Hoàn thành':
      case 'Đã hoàn thành':
        return 'local_shipping';
      case 'Cancelled':
      case 'Đã hủy':
      case 'Đã hủy đơn':
        return 'cancel';
      default:
        return 'receipt';
    }
  };

  return (
    <div className="py-6 font-['Inter'] space-y-6 max-w-5xl mx-auto">
      {/* HEADER HERO AREA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-purple-200 hover:text-white font-bold mb-1 transition-colors uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Quay lại mua sắm
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
              Đơn Mua Của Bạn
            </h1>
          </div>
          <div className="px-3.5 py-2 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl text-xs border border-white/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-purple-300">account_circle</span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* TABS HỖ TRỢ BỘ LỌC SHOPEE STYLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unpaid', label: 'Chờ thanh toán' },
            { id: 'pending', label: 'Chờ xác nhận' },
            { id: 'shipping', label: 'Đang giao' },
            { id: 'completed', label: 'Hoàn thành' },
            { id: 'cancelled', label: 'Đã hủy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-4 text-center font-bold text-xs md:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700 font-["Space_Grotesk"] bg-purple-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ô TÌM KIẾM ĐƠN HÀNG */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm..."
              className="w-full pl-10 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* DANH SÁCH ĐƠN HÀNG */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-purple-600">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold animate-pulse">Đang tải danh sách đơn mua...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">search_off</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
              <p className="text-xs text-slate-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-150/70 bg-slate-50/30">
            {filteredOrders.map((order) => (
              <div 
                key={order.MaDonHang} 
                className="bg-white p-5 md:p-6 space-y-4 shadow-sm first:rounded-t-none last:rounded-b-none"
              >
                {/* Header: Shop name & Delivery Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100/60">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-600 text-white font-extrabold text-[9px] rounded uppercase tracking-wider shadow-sm">Mall</span>
                    <span className="font-extrabold text-xs md:text-sm text-slate-800 font-['Space_Grotesk']">Zenith Store</span>
                    <button 
                      onClick={() => alert("Chức năng chat với shop đang phát triển.")}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold border border-purple-100 rounded-md text-[10px] cursor-pointer hover:bg-purple-100 transition-colors flex items-center gap-1 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[11px] filled">chat</span> Chat
                    </button>
                    <Link 
                      to="/"
                      className="px-2.5 py-1 bg-white text-slate-600 font-bold border border-slate-200 rounded-md text-[10px] hover:bg-slate-50 transition-colors flex items-center gap-1 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[11px]">storefront</span> Xem Shop
                    </Link>
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] font-bold uppercase ${getStatusColorClass(order.TrangThai)}`}>
                    <span className="material-symbols-outlined text-sm">{getStatusIcon(order.TrangThai)}</span>
                    <span>{getStatusText(order.TrangThai)}</span>
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <Link 
                      key={idx} 
                      to={`/lich-su-don-hang/${order.MaDonHang}`}
                      className="flex gap-4 items-start cursor-pointer hover:bg-slate-50/50 p-1.5 rounded-xl transition-all"
                    >
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl p-2 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={getImageUrl(item.HinhAnh)}
                          alt={item.TenSanPham}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs md:text-sm text-slate-800 line-clamp-2 leading-relaxed" title={item.TenSanPham}>
                          {item.TenSanPham}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                          Phân loại: Phiên bản tiêu chuẩn
                        </p>
                        <p className="text-xs text-slate-500 font-bold mt-1">
                          x{item.SoLuong}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-xs md:text-sm text-purple-600">
                          {formatPrice(item.GiaBan)}
                        </p>
                        {item.GiaBan > 0 && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatPrice(item.GiaBan * 1.15)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100/60 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: payment condition or cancellation status */}
                  <div className="text-xs text-slate-400 font-medium">
                    {order.TrangThaiThanhToan === 'Unpaid' && !['Cancelled', 'Đã hủy', 'Đã hủy đơn'].includes(order.TrangThai) ? (
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Vui lòng thanh toán khi nhận hàng (COD).
                      </span>
                    ) : order.TrangThai === 'Cancelled' ? (
                      <span className="text-rose-600 font-semibold italic">Đơn hàng đã được hủy.</span>
                    ) : (
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-emerald-500">task_alt</span>
                        Đơn hàng #{order.MaDonHang} hợp lệ.
                      </span>
                    )}
                  </div>

                  {/* Right: Order Total */}
                  <div className="text-right flex items-baseline gap-2 justify-end">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tổng số tiền:</span>
                    <span className="text-lg md:text-xl font-extrabold text-purple-600 font-['Space_Grotesk']">
                      {formatPrice(order.TongTien)}
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="border-t border-slate-100/60 pt-3 flex flex-wrap gap-2 justify-end">
                  {/* Hủy đơn hàng */}
                  {['Pending', 'Chờ xử lý', 'Chờ xác nhận'].includes(order.TrangThai) && (
                    <button
                      onClick={() => handleCancelOrder(order.MaDonHang)}
                      disabled={cancellingOrderId === order.MaDonHang}
                      className="px-5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
                    >
                      {cancellingOrderId === order.MaDonHang ? (
                        <>
                          <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang hủy...</span>
                        </>
                      ) : (
                        <span>Hủy đơn hàng</span>
                      )}
                    </button>
                  )}

                  {/* Chi tiết đơn hàng */}
                  <Link
                    to={`/lich-su-don-hang/${order.MaDonHang}`}
                    className="px-5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 text-center"
                  >
                    Chi tiết đơn hàng
                  </Link>

                  {/* Đánh giá */}
                  {['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(order.TrangThai) && (
                    <Link
                      to={`/san-pham/${order.items?.[0]?.MaSanPham}?tab=review`}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 text-center flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs filled">star</span>
                      Đánh giá ngay
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
