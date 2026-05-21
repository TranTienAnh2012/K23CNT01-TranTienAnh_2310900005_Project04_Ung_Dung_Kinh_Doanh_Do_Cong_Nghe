import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientChiTietDonHang() {
  const { ma } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [cancelling, setCancelling] = useState(false);

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

  // Nếu không có dữ liệu từ state, gọi API lấy tất cả đơn hàng rồi tìm đúng mã
  useEffect(() => {
    if (order) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await shopApi.getOrders();
        if (res.data && res.data.data) {
          const found = res.data.data.find(o => String(o.MaDonHang) === String(ma));
          setOrder(found || null);
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [ma, user]);

  // =====================================================================
  // TRẠNG THÁI ĐƠN HÀNG - STEPPER (Timeline)
  // Các giá trị trạng thái thực tế từ Backend (Admin cập nhật):
  //   'Pending'       → Mặc định khi tạo đơn mới
  //   'Chờ xác nhận'  → Admin set
  //   'Đã xác nhận'   → Admin set
  //   'Đang giao'     → Admin set
  //   'Hoàn thành'    → Admin set
  //   'Đã hủy'        → Admin set
  // =====================================================================
  const statusSteps = [
    { key: 'pending',    label: 'Đã đặt hàng',    desc: 'Đơn hàng đã được tạo',           icon: 'check_circle' },
    { key: 'confirmed',  label: 'Đã xác nhận',     desc: 'Đơn hàng đang được chuẩn bị',    icon: 'inventory_2' },
    { key: 'shipping',   label: 'Đang giao hàng',   desc: 'Đơn hàng đang trên đường giao',  icon: 'local_shipping' },
    { key: 'completed',  label: 'Hoàn thành',       desc: 'Giao hàng thành công',            icon: 'where_to_vote' },
  ];

  const getActiveStep = (status) => {
    if (!status) return 0;
    const s = status.trim();
    // Khớp chính xác với giá trị backend
    if (s === 'Hoàn thành')    return 4;
    if (s === 'Đang giao')     return 3;
    if (s === 'Đã xác nhận')   return 2;
    if (s === 'Đã hủy')        return -1; // Đã huỷ
    // Pending hoặc Chờ xác nhận → step 1 (đã đặt hàng)
    if (s === 'Pending' || s === 'Chờ xác nhận') return 1;
    // Fallback: tìm theo từ khóa phòng trường hợp giá trị không khớp chính xác
    const lower = s.toLowerCase();
    if (lower.includes('hoàn thành') || lower.includes('completed'))   return 4;
    if (lower.includes('đang giao') || lower.includes('shipping'))     return 3;
    if (lower.includes('xác nhận') || lower.includes('processing'))    return 2;
    if (lower.includes('hủy') || lower.includes('cancelled'))          return -1;
    return 1;
  };

  const isCancelled = order && getActiveStep(order.TrangThai) === -1;
  const activeStep = order ? getActiveStep(order.TrangThai) : 0;

  // =====================================================================
  // XỬ LÝ HUỶ ĐƠN HÀNG
  // =====================================================================
  const handleCancelOrder = () => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.MaDonHang}?`)) return;
    setCancelling(true);
    // Giả lập - trong thực tế sẽ gọi API cancel
    setTimeout(() => {
      alert('Chức năng hủy đơn hàng sẽ được triển khai khi có API backend tương ứng.');
      setCancelling(false);
    }, 500);
  };

  // =====================================================================
  // GUARD: Chưa đăng nhập
  // =====================================================================
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-purple-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Yêu cầu đăng nhập</h2>
        <p className="text-sm text-slate-500">Bạn cần đăng nhập để xem chi tiết đơn hàng.</p>
        <Link to="/login?redirect=/lich-su-don-hang" className="inline-block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // =====================================================================
  // LOADING
  // =====================================================================
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-purple-600">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold animate-pulse">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  // =====================================================================
  // KHÔNG TÌM THẤY ĐƠN HÀNG
  // =====================================================================
  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 rounded-3xl shadow-md text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">search_off</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Không tìm thấy đơn hàng</h2>
        <p className="text-sm text-slate-500">Đơn hàng #{ma} không tồn tại hoặc không thuộc tài khoản của bạn.</p>
        <Link to="/lich-su-don-hang" className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all">
          ← Quay lại lịch sử
        </Link>
      </div>
    );
  }

  // =====================================================================
  // TÍNH TOÁN TỔNG TIỀN TỪ ITEMS
  // =====================================================================
  const calcTotal = order.items?.reduce((sum, item) => sum + (item.GiaBan || 0) * (item.SoLuong || 0), 0) || order.TongTien || 0;

  return (
    <div className="py-6 font-['Inter'] space-y-8 max-w-4xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <Link to="/lich-su-don-hang" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-purple-600 font-bold mb-2 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Quay lại lịch sử đơn hàng
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-purple-600 text-2xl md:text-3xl">receipt_long</span>
            Đơn hàng #{order.MaDonHang}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Đặt ngày: {formatDate(order.NgayDatHang)}
          </p>
        </div>
      </div>

      {/* ===== TRẠNG THÁI ĐƠN HÀNG — STEPPER ===== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-purple-600 text-base">schedule</span>
          Trạng thái đơn hàng
        </h2>

        {isCancelled ? (
          <div className="flex items-center justify-center gap-3 py-6 bg-rose-50 rounded-2xl border border-rose-100">
            <span className="material-symbols-outlined text-rose-500 text-3xl">cancel</span>
            <div>
              <p className="font-extrabold text-rose-700 text-base font-['Space_Grotesk']">Đơn hàng đã bị hủy</p>
              <p className="text-xs text-rose-500">Đơn hàng này đã được hủy và không thể tiếp tục xử lý.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between relative">
            {/* Đường kẻ nối các bước */}
            <div className="absolute top-5 left-[calc(12.5%)] right-[calc(12.5%)] h-0.5 bg-slate-200 z-0">
              <div
                className="h-full bg-purple-500 transition-all duration-700"
                style={{ width: `${Math.max(0, ((activeStep - 1) / (statusSteps.length - 1)) * 100)}%` }}
              />
            </div>

            {statusSteps.map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum <= activeStep;
              const isCurrent = stepNum === activeStep;
              return (
                <div key={step.key} className="flex flex-col items-center text-center z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 shadow-sm ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-purple-200 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  } ${isCurrent ? 'ring-4 ring-purple-100 scale-110' : ''}`}>
                    <span className="material-symbols-outlined text-lg">{step.icon}</span>
                  </div>
                  <p className={`mt-2 text-[11px] font-bold ${isActive ? 'text-purple-700' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[120px] hidden md:block">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== THÔNG TIN GIAO HÀNG & THANH TOÁN ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin giao hàng */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 text-base">location_on</span>
            Thông tin giao hàng
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Người nhận:</span>
              <span className="font-bold text-slate-800">{order.HoTenNguoiNhan || '—'}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Số điện thoại:</span>
              <span className="font-bold text-slate-800">{order.SoDienThoai || '—'}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Email:</span>
              <span className="font-medium text-slate-600">{order.Email || '—'}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Địa chỉ:</span>
              <span className="font-medium text-slate-600">{order.DiaChi || '—'}</span>
            </div>
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 text-base">payments</span>
            Thông tin thanh toán
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Phương thức:</span>
              <span className="font-bold text-slate-800">
                {order.PhuongThucThanhToan === 'COD'
                  ? 'COD (Thanh toán khi nhận hàng)'
                  : order.PhuongThucThanhToan || '—'}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Tổng tiền hàng:</span>
              <span className="font-extrabold text-purple-600 text-base font-['Space_Grotesk']">
                {formatPrice(order.TongTien)}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-slate-400 w-28 shrink-0 font-medium">Trạng thái TT:</span>
              {order.TrangThaiThanhToan === 'Paid' ? (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-md font-bold uppercase tracking-wider">
                  Đã thanh toán
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-md font-bold uppercase tracking-wider">
                  Chưa thanh toán
                </span>
              )}
            </div>
            {order.GhiChu && (
              <div className="flex items-start gap-3">
                <span className="text-slate-400 w-28 shrink-0 font-medium">Ghi chú:</span>
                <span className="font-medium text-slate-600 italic">"{order.GhiChu}"</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== BẢNG SẢN PHẨM ĐÃ ĐẶT ===== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-base">shopping_bag</span>
          Sản phẩm đã đặt
        </h2>

        {/* Desktop: Table */}
        <div className="hidden md:block overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="bg-white text-left py-4 px-2 text-slate-500 font-bold text-xs uppercase tracking-wider border-none">Sản phẩm</th>
                <th className="bg-white text-center py-4 px-2 text-slate-500 font-bold text-xs uppercase tracking-wider w-28 border-none">Số lượng</th>
                <th className="bg-white text-right py-4 px-2 text-slate-500 font-bold text-xs uppercase tracking-wider w-36 border-none">Đơn giá</th>
                <th className="bg-white text-right py-4 px-2 text-slate-500 font-bold text-xs uppercase tracking-wider w-36 border-none">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-purple-50/30 transition-colors bg-white">
                  <td className="py-4 px-2 border-none">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl p-1.5 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={getImageUrl(item.HinhAnh)}
                          alt={item.TenSanPham}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.TenSanPham}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Mã: {item.MaSanPham}</p>
                        {item.specifications && item.specifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.specifications.map((spec, i) => (
                              <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                                {spec.TenThuocTinh}: {spec.GiaTri}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center border-none">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-700 font-bold text-sm border border-purple-100">
                      {item.SoLuong}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right font-medium text-slate-700 border-none">
                    {formatPrice(item.GiaBan)}
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-purple-600 border-none">
                    {formatPrice(item.GiaBan * item.SoLuong)}
                  </td>
                </tr>
              )) : (
                <tr className="bg-white">
                  <td colSpan="4" className="py-8 text-center text-slate-400 text-sm italic border-none">
                    Không có chi tiết sản phẩm cho đơn hàng này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: Cards */}
        <div className="md:hidden space-y-3">
          {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-slate-50/60 rounded-2xl p-3 border border-slate-100/60">
              <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl p-1.5 overflow-hidden flex items-center justify-center shrink-0">
                <img src={getImageUrl(item.HinhAnh)} alt={item.TenSanPham} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-slate-800 truncate">{item.TenSanPham}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">SL: x{item.SoLuong} · {formatPrice(item.GiaBan)}/cái</p>
                {item.specifications && item.specifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.specifications.map((spec, i) => (
                      <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                        {spec.TenThuocTinh}: {spec.GiaTri}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="font-bold text-sm text-purple-600 shrink-0">{formatPrice(item.GiaBan * item.SoLuong)}</p>
            </div>
          )) : (
            <p className="text-xs text-slate-400 italic text-center py-6">Không có chi tiết sản phẩm.</p>
          )}
        </div>

        {/* Tổng cộng */}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <div className="text-right space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng cộng:</p>
            <p className="text-2xl font-extrabold text-purple-600 font-['Space_Grotesk']">
              {formatPrice(calcTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          to="/lich-su-don-hang"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại
        </Link>

        {!isCancelled && activeStep <= 1 && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">block</span>
            {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </button>
        )}
      </div>
    </div>
  );
}
