import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientLichSuDonHang() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

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

  useEffect(() => {
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
    fetchOrders();
  }, [user]);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
      case 'Chờ xử lý':
      case 'Chờ xác nhận':
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ xác nhận
          </span>
        );
      case 'Processing':
      case 'Đã xác nhận':
        return (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Đã xác nhận
          </span>
        );
      case 'Shipping':
      case 'Đang giao':
      case 'Đang giao hàng':
        return (
          <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
            Đang giao hàng
          </span>
        );
      case 'Completed':
      case 'Hoàn thành':
      case 'Đã hoàn thành':
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Đã hoàn thành
          </span>
        );
      case 'Cancelled':
      case 'Đã hủy':
      case 'Đã hủy đơn':
        return (
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Đã hủy đơn
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'Paid') {
      return (
        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-md font-bold uppercase tracking-wider">
          Đã thanh toán
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-md font-bold uppercase tracking-wider">
        Chưa thanh toán
      </span>
    );
  };

  const getTimelineSteps = (status) => {
    const isCancelled = ['Cancelled', 'Đã hủy', 'Đã hủy đơn'].includes(status);
    
    if (isCancelled) {
      return [
        { label: 'Đặt hàng', active: false, done: true, icon: 'receipt' },
        { label: 'Đã hủy đơn', active: true, error: true, icon: 'cancel' }
      ];
    }
    
    const steps = [
      { label: 'Đặt hàng', icon: 'receipt' },
      { label: 'Xác nhận', icon: 'verified' },
      { label: 'Đang giao', icon: 'local_shipping' },
      { label: 'Hoàn thành', icon: 'check_circle' }
    ];
    
    let activeIndex = 0;
    if (['Pending', 'Chờ xử lý', 'Chờ xác nhận'].includes(status)) {
      activeIndex = 0;
    } else if (['Processing', 'Đã xác nhận'].includes(status)) {
      activeIndex = 1;
    } else if (['Shipping', 'Đang giao', 'Đang giao hàng'].includes(status)) {
      activeIndex = 2;
    } else if (['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(status)) {
      activeIndex = 3;
    }
    
    return steps.map((step, idx) => ({
      ...step,
      done: idx < activeIndex,
      active: idx === activeIndex,
      error: false
    }));
  };

  return (
    <div className="py-6 font-['Inter'] space-y-8 max-w-6xl mx-auto">
      {/* HEADER HERO AREA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-purple-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-40 h-40 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-purple-200 hover:text-white font-bold mb-1 transition-colors uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Quay lại mua sắm
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Lịch Sử Mua Hàng
            </h1>
            <p className="text-xs md:text-sm text-purple-200/80 max-w-md">Theo dõi chi tiết trạng thái giao hàng và quản lý các giao dịch của bạn.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-2xl text-xs border border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-purple-300">account_circle</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS COUNT GRID */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tổng đơn hàng</span>
              <span className="text-xl font-extrabold text-slate-800 font-['Space_Grotesk']">{orders.length}</span>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tích lũy mua sắm</span>
              <span className="text-xl font-extrabold text-slate-800 font-['Space_Grotesk']">
                {formatPrice(orders.reduce((acc, o) => ['Cancelled', 'Đã hủy', 'Đã hủy đơn'].includes(o.TrangThai) ? acc : acc + o.TongTien, 0))}
              </span>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">autorenew</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Đang xử lý</span>
              <span className="text-xl font-extrabold text-slate-800 font-['Space_Grotesk']">
                {orders.filter(o => ['Pending', 'Chờ xử lý', 'Chờ xác nhận', 'Processing', 'Đã xác nhận', 'Shipping', 'Đang giao', 'Đang giao hàng'].includes(o.TrangThai)).length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Đã hoàn thành</span>
              <span className="text-xl font-extrabold text-slate-800 font-['Space_Grotesk']">
                {orders.filter(o => ['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(o.TrangThai)).length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN ORDERS SECTION */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 text-purple-600">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold animate-pulse">Đang tải lịch sử đơn hàng...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">shopping_cart_checkout</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 font-['Space_Grotesk']">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-slate-500 px-6">
              Bạn chưa thực hiện bất kỳ giao dịch mua sắm nào tại Zenith Store. Hãy khám phá và mua sắm các sản phẩm công nghệ hot nhất!
            </p>
          </div>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order.MaDonHang}
              className="bg-white border border-slate-150/70 hover:border-purple-200 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* CARD HEADER */}
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
                      Mã đơn hàng: <span className="text-purple-600">#{order.MaDonHang}</span>
                    </span>
                    {getPaymentStatusBadge(order.TrangThaiThanhToan)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    <span>Đặt ngày: {formatDate(order.NgayDatHang)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(order.TrangThai)}
                </div>
              </div>

              {/* PRODUCTS LIST */}
              <div className="p-6 divide-y divide-slate-100/80 space-y-4">
                {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center pt-4 first:pt-0">
                    <Link to={`/san-pham/${item.MaSanPham}`} className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl p-2 overflow-hidden flex items-center justify-center shrink-0 hover:border-purple-300 transition-colors">
                      <img
                        src={getImageUrl(item.HinhAnh)}
                        alt={item.TenSanPham}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/san-pham/${item.MaSanPham}`} className="font-bold text-xs md:text-sm text-slate-800 hover:text-purple-600 transition-colors line-clamp-1 truncate block" title={item.TenSanPham}>
                        {item.TenSanPham}
                      </Link>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Số lượng: <span className="font-bold text-slate-600">x{item.SoLuong}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <p className="font-extrabold text-xs md:text-sm text-slate-800">
                        {formatPrice(item.GiaBan * item.SoLuong)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {formatPrice(item.GiaBan)} / sản phẩm
                      </p>
                      
                      {/* Rate now button if completed */}
                      {['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(order.TrangThai) && (
                        <Link
                          to={`/san-pham/${item.MaSanPham}?tab=review`}
                          className="mt-1 flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full text-[10px] font-extrabold border border-amber-200 transition-all cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-xs filled">star</span>
                          <span>Đánh giá sản phẩm</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic py-2 text-center">Không có chi tiết sản phẩm cho đơn hàng này.</p>
                )}
              </div>

              {/* PROGRESS TIMELINE TRACKER */}
              <div className="px-6 py-5 bg-slate-50/20 border-t border-slate-100">
                <div className="flex items-center justify-between max-w-xl mx-auto relative py-2">
                  {/* Timeline Background Line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10"></div>
                  
                  {/* Timeline Active Line */}
                  {(() => {
                    const steps = getTimelineSteps(order.TrangThai);
                    const total = steps.length;
                    const doneCount = steps.filter(s => s.done || s.active).length;
                    const percentage = total > 1 ? ((doneCount - 1) / (total - 1)) * 100 : 0;
                    return (
                      <div 
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 ${steps[steps.length - 1].error ? 'bg-rose-500' : 'bg-purple-600'} -z-10 transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    );
                  })()}

                  {getTimelineSteps(order.TrangThai).map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 relative z-10">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 ${
                          step.error 
                            ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                            : step.active 
                              ? 'bg-purple-600 border-purple-600 text-white font-bold scale-110 shadow-purple-200' 
                              : step.done 
                                ? 'bg-purple-50 border-purple-300 text-purple-600' 
                                : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {step.icon}
                        </span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wide ${
                        step.error 
                          ? 'text-rose-600 font-black' 
                          : step.active 
                            ? 'text-purple-700 font-black' 
                            : step.done 
                              ? 'text-purple-600' 
                              : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECIPIENT DETAILS & PRICING FOOTER */}
              <div className="border-t border-slate-100">
                {/* Collapse trigger bar */}
                <button
                  onClick={() => toggleExpand(order.MaDonHang)}
                  className="w-full px-6 py-3 bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-purple-600">info</span>
                    <span>{expandedOrders[order.MaDonHang] ? 'Ẩn thông tin nhận hàng' : 'Xem thông tin nhận hàng & thanh toán'}</span>
                  </div>
                  <span className={`material-symbols-outlined text-base transition-transform duration-300 ${expandedOrders[order.MaDonHang] ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </button>

                {/* Collapsible Panel */}
                {expandedOrders[order.MaDonHang] && (
                  <div className="px-6 py-5 bg-slate-50/40 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-slate-100 animate-slideDown">
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200/60">Thông tin giao nhận</h5>
                      <div className="space-y-1.5 text-slate-600 font-medium">
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-xs text-slate-400">person</span>
                          <span>Người nhận: <strong className="text-slate-800">{order.HoTenNguoiNhan}</strong></span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-xs text-slate-400">call</span>
                          <span>Điện thoại: <strong className="text-slate-800">{order.SoDienThoai}</strong></span>
                        </p>
                        {order.Email && (
                          <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs text-slate-400">mail</span>
                            <span>Email: <strong className="text-slate-800">{order.Email}</strong></span>
                          </p>
                        )}
                        <p className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-xs text-slate-400 mt-0.5">location_on</span>
                          <span className="leading-relaxed">Địa chỉ: <strong className="text-slate-800">{order.DiaChi}</strong></span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200/60">Ghi chú & Phương thức</h5>
                      <div className="space-y-2">
                        {order.GhiChu ? (
                          <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-500 italic">
                            "{order.GhiChu}"
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">Không có ghi chú nào khác.</p>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 font-bold border border-purple-100 rounded-md text-[10px] uppercase">
                            Hình thức: {order.PhuongThucThanhToan}
                          </span>
                          <span className={`px-2 py-1 border rounded-md text-[10px] font-bold uppercase ${
                            order.TrangThaiThanhToan === 'Paid' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}>
                            Trạng thái: {order.TrangThaiThanhToan === 'Paid' ? 'Đã trả' : 'Chưa trả'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD FOOTER SUMMARY */}
                <div className="px-6 py-4 bg-slate-50/20 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 font-medium">
                    Thanh toán: <span className="font-bold text-slate-700">{order.PhuongThucThanhToan}</span>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-none mb-1">Tổng thanh toán</span>
                      <span className="text-lg md:text-xl font-extrabold text-purple-600 font-['Space_Grotesk'] tracking-tight">
                        {formatPrice(order.TongTien)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
