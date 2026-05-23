import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientChiTietDonHang() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr, offsetDays = 0, offsetMinutes = 0) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (offsetDays > 0) date.setDate(date.getDate() + offsetDays);
    if (offsetMinutes > 0) date.setMinutes(date.getMinutes() + offsetMinutes);
    
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await shopApi.getOrder(id);
        if (res.data && res.data.data) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrderDetail();
    }
  }, [id, user]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    setCancelling(true);
    try {
      await shopApi.cancelOrder(id);
      alert("Hủy đơn hàng thành công!");
      // Tải lại chi tiết đơn hàng
      const res = await shopApi.getOrder(id);
      if (res.data && res.data.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi hủy đơn hàng:", err);
      alert("Không thể hủy đơn hàng: " + (err.response?.data?.message || err.message));
    } finally {
      setCancelling(false);
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
          <p className="text-sm text-slate-500">Bạn cần đăng nhập tài khoản để xem chi tiết đơn hàng.</p>
        </div>
        <Link to="/login" className="block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all">Đăng nhập</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-purple-600">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold animate-pulse">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Không tìm thấy đơn hàng</h2>
          <p className="text-sm text-slate-500">Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.</p>
        </div>
        <button onClick={() => navigate('/lich-su-don-hang')} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all">Quay lại lịch sử</button>
      </div>
    );
  }

  // Định nghĩa các bước timeline dựa theo quy trình trạng thái ở Backend
  const getTimelineSteps = (status, isPaid) => {
    const isCancelled = ['Cancelled', 'Đã hủy', 'Đã hủy đơn'].includes(status);
    
    if (isCancelled) {
      return [
        { label: 'Đơn Đã Đặt', icon: 'receipt', date: formatDate(order.NgayDatHang), done: true, active: false },
        { label: 'Đã Hủy Đơn', icon: 'cancel', date: formatDate(order.NgayDatHang, 0, 5), done: false, active: true, error: true }
      ];
    }

    const steps = [
      { label: 'Đơn Đã Đặt', icon: 'receipt', date: formatDate(order.NgayDatHang) },
      { label: 'Đã Thanh Toán', icon: 'payments', date: isPaid ? formatDate(order.NgayDatHang, 0, 2) : 'Chưa thanh toán' },
      { label: 'Đang Giao', icon: 'local_shipping', date: ['Shipping', 'Đang giao', 'Đang giao hàng', 'Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(status) ? formatDate(order.NgayDatHang, 1, 15) : 'Chờ vận chuyển' },
      { label: 'Đã Nhận', icon: 'package_2', date: ['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(status) ? formatDate(order.NgayDatHang, 3, 45) : 'Chờ giao hàng' },
      { label: 'Đánh Giá', icon: 'star', date: ['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(status) ? 'Đang chờ đánh giá' : 'Đơn chưa hoàn thành' }
    ];

    let activeIndex = 0;
    if (['Pending', 'Chờ xử lý', 'Chờ xác nhận'].includes(status)) {
      activeIndex = isPaid ? 1 : 0;
    } else if (['Processing', 'Đã xác nhận'].includes(status)) {
      activeIndex = 1;
    } else if (['Shipping', 'Đang giao', 'Đang giao hàng'].includes(status)) {
      activeIndex = 2;
    } else if (['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(status)) {
      activeIndex = 4; // Bật tới bước cuối để đánh giá
    }

    return steps.map((step, idx) => ({
      ...step,
      done: idx < activeIndex,
      active: idx === activeIndex,
      error: false
    }));
  };

  const isPaid = order.TrangThaiThanhToan === 'Paid';
  const steps = getTimelineSteps(order.TrangThai, isPaid);

  return (
    <div className="py-6 font-['Inter'] space-y-6 max-w-5xl mx-auto">
      {/* HEADER CONTROL BAR */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <button
          onClick={() => navigate('/lich-su-don-hang')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors uppercase cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          Trở lại
        </button>
        <div className="text-right flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-200 pr-3">
            MÃ ĐƠN HÀNG: <span className="text-slate-800">#{order.MaDonHang}</span>
          </span>
          <span className={`text-xs font-extrabold uppercase tracking-wider ${
            ['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(order.TrangThai) ? 'text-emerald-600' : 'text-purple-600'
          }`}>
            {order.TrangThai === 'Cancelled' ? 'ĐƠN HÀNG ĐÃ HỦY' : `ĐƠN HÀNG ${getStatusText(order.TrangThai)}`}
          </span>
        </div>
      </div>

      {/* TIMELINE PROGRESS TRACKER SECTION */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative py-4">
          {/* Connecting Line Background */}
          <div className="absolute left-0 right-0 top-[28px] -translate-y-1/2 h-1 bg-slate-150 -z-10 rounded-full"></div>
          
          {/* Active Status Progress Fill */}
          {(() => {
            const total = steps.length;
            const doneCount = steps.filter(s => s.done || s.active).length;
            const percentage = total > 1 ? ((doneCount - 1) / (total - 1)) * 100 : 0;
            return (
              <div 
                className={`absolute left-0 top-[28px] -translate-y-1/2 h-1 ${steps[steps.length - 1].error ? 'bg-rose-500' : 'bg-emerald-500'} -z-10 transition-all duration-700 rounded-full`}
                style={{ width: `${percentage}%` }}
              />
            );
          })()}

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 relative z-10 text-center w-24">
              {/* Circle Icon Badge */}
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                  step.error 
                    ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse' 
                    : step.active 
                      ? 'bg-emerald-500 border-emerald-500 text-white font-extrabold scale-110 shadow-emerald-100' 
                      : step.done 
                        ? 'bg-white border-emerald-500 text-emerald-600 font-bold' 
                        : 'bg-white border-slate-200 text-slate-300'
                }`}
              >
                <span className="material-symbols-outlined text-lg md:text-xl">
                  {step.icon}
                </span>
              </div>
              
              {/* Info Text Labels */}
              <div className="space-y-0.5">
                <span className={`text-[11px] font-extrabold uppercase tracking-wide block ${
                  step.error 
                    ? 'text-rose-600' 
                    : step.active 
                      ? 'text-emerald-600 font-black' 
                      : step.done 
                        ? 'text-emerald-500' 
                        : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
                <span className="text-[9px] text-slate-400 font-medium block leading-tight">
                  {step.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECIPIENT SHIPPING ADDRESS CONTAINER */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Left section: Recipient Address */}
        <div className="p-6 md:col-span-2 border-b md:border-b-0 md:border-r border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-purple-600">location_on</span>
            Địa Chỉ Nhận Hàng
          </h3>
          <div className="space-y-2 text-slate-700 text-xs md:text-sm font-medium leading-relaxed">
            <h4 className="font-extrabold text-slate-900 text-sm">{order.HoTenNguoiNhan}</h4>
            <p className="text-slate-500">Số điện thoại: <strong className="text-slate-800">{order.SoDienThoai}</strong></p>
            {order.Email && <p className="text-slate-500">Email: <strong className="text-slate-800">{order.Email}</strong></p>}
            <p className="text-slate-500">Địa chỉ: <strong className="text-slate-800">{order.DiaChi}</strong></p>
          </div>
        </div>

        {/* Right section: Customer Notes */}
        <div className="p-6 space-y-4 bg-slate-50/20">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-purple-600">rate_review</span>
            Lời Nhắn Từ Khách Hàng
          </h3>
          {order.GhiChu ? (
            <div className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-600 italic text-xs leading-relaxed">
              "{order.GhiChu}"
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Không có lời nhắn hoặc ghi chú kèm theo đơn hàng.</p>
          )}
        </div>
      </div>

      {/* ORDER ITEMS GRID SECTION */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        {/* Mall Tag Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-600 text-white font-extrabold text-[9px] rounded uppercase tracking-wider shadow-sm">Mall</span>
            <span className="font-extrabold text-xs md:text-sm text-slate-800">Zenith Store</span>
          </div>
          <button 
            onClick={() => alert("Chức năng đang phát triển.")}
            className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700"
          >
            <span className="material-symbols-outlined text-sm">chat</span> Liên hệ hỗ trợ
          </button>
        </div>

        {/* Products mapping */}
        <div className="p-6 divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start py-4 first:pt-0 last:pb-0">
              <Link to={`/san-pham/${item.MaSanPham}`} className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl p-2 overflow-hidden flex items-center justify-center shrink-0 hover:border-purple-300 transition-colors">
                <img
                  src={getImageUrl(item.HinhAnh)}
                  alt={item.TenSanPham}
                  className="w-full h-full object-contain"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/san-pham/${item.MaSanPham}`} className="font-bold text-xs md:text-sm text-slate-800 hover:text-purple-600 transition-colors line-clamp-2 leading-relaxed block">
                  {item.TenSanPham}
                </Link>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                  Phân loại: Phiên bản tiêu chuẩn
                </p>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Số lượng: x{item.SoLuong}
                </p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <p className="font-extrabold text-xs md:text-sm text-purple-600">
                  {formatPrice(item.GiaBan)}
                </p>
                {item.GiaBan > 0 && (
                  <p className="text-[10px] text-slate-400 line-through">
                    {formatPrice(item.GiaBan * 1.15)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* COST BREAKDOWN TABLE */}
        <div className="border-t border-slate-100 bg-slate-50/20 p-6 space-y-3.5 text-xs font-semibold text-slate-500">
          <div className="flex justify-between max-w-md ml-auto gap-4">
            <span>Tổng Tiền Hàng (Tạm tính)</span>
            <span className="text-slate-800 font-bold">{formatPrice(order.TongTien)}</span>
          </div>
          <div className="flex justify-between max-w-md ml-auto gap-4">
            <span>Phí Vận Chuyển</span>
            <span className="text-slate-800 font-bold">{formatPrice(30000)}</span>
          </div>
          <div className="flex justify-between max-w-md ml-auto gap-4">
            <span>Khuyến Mãi Phí Ship (Freeship Extra)</span>
            <span className="text-purple-600 font-extrabold">-{formatPrice(30000)}</span>
          </div>
          <div className="flex justify-between max-w-md ml-auto gap-4 items-baseline border-t border-slate-200/80 pt-3.5">
            <span className="text-slate-900 font-extrabold uppercase tracking-wide">Tổng số tiền:</span>
            <span className="text-xl md:text-2xl font-black text-purple-600 font-['Space_Grotesk'] tracking-tight">
              {formatPrice(order.TongTien)}
            </span>
          </div>
          <div className="flex justify-between max-w-md ml-auto gap-4 items-center border-t border-slate-200/40 pt-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Phương thức thanh toán:</span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-extrabold border border-purple-100 rounded text-[10px] uppercase">
              {order.PhuongThucThanhToan} ({order.TrangThaiThanhToan === 'Paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'})
            </span>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex gap-3 justify-end">
          {/* Hủy đơn hàng */}
          {['Pending', 'Chờ xử lý', 'Chờ xác nhận'].includes(order.TrangThai) && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-6 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
            >
              {cancelling ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang hủy...</span>
                </>
              ) : (
                <span>Hủy Đơn Hàng</span>
              )}
            </button>
          )}

          {/* Đánh giá ngay */}
          {['Completed', 'Hoàn thành', 'Đã hoàn thành'].includes(order.TrangThai) && (
            <Link
              to={`/san-pham/${order.items?.[0]?.MaSanPham}?tab=review`}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs filled">star</span>
              Đánh Giá Sản Phẩm
            </Link>
          )}

          {/* Quay lại */}
          <Link
            to="/lich-su-don-hang"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            Quay Lại Lịch Sử
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper to display status text correctly
function getStatusText(status) {
  switch (status) {
    case 'Pending':
    case 'Chờ xử lý':
    case 'Chờ xác nhận':
      return 'ĐANG CHỜ XÁC NHẬN';
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
      return 'ĐÃ HOÀN THÀNH';
    case 'Cancelled':
    case 'Đã hủy':
    case 'Đã hủy đơn':
      return 'ĐÃ HỦY';
    default:
      return status.toUpperCase();
  }
}
