import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientLichSuDonHang() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
            Đã đặt hàng
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
            Hoàn thành
          </span>
        );
      case 'Cancelled':
      case 'Đã hủy':
      case 'Đã hủy đơn':
        return (
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Đã hủy
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

  return (
    <div className="py-6 font-['Inter'] space-y-8">
      {/* Tiêu đề & nút quay lại */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-purple-600 font-bold mb-2 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Quay lại mua sắm
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">Lịch Sử Mua Hàng</h1>
          <p className="text-xs text-slate-500">Xem và theo dõi trạng thái các đơn hàng đã đặt của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-50 text-purple-700 font-bold rounded-2xl text-xs border border-purple-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">person</span>
            Tài khoản: {user.email}
          </div>
        </div>
      </div>

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
              className="bg-white border border-slate-100 hover:border-purple-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4"
            >
              {/* PHẦN ĐẦU THẺ ĐƠN HÀNG */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 font-['Space_Grotesk']">
                      Đơn hàng #{order.MaDonHang}
                    </span>
                    {getPaymentStatusBadge(order.TrangThaiThanhToan)}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Đặt ngày: {formatDate(order.NgayDatHang)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(order.TrangThai)}
                </div>
              </div>

              {/* PHẦN DANH SÁCH SẢN PHẨM TRONG ĐƠN HÀNG */}
              <div className="space-y-3 py-1">
                {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl p-1.5 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={getImageUrl(item.HinhAnh)}
                        alt={item.TenSanPham}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-slate-800 truncate" title={item.TenSanPham}>
                        {item.TenSanPham}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Số lượng: <span className="font-bold text-slate-600">x{item.SoLuong}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs md:text-sm text-slate-700">
                        {formatPrice(item.GiaBan * item.SoLuong)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatPrice(item.GiaBan)} / cái
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic py-2">Không có chi tiết sản phẩm cho đơn hàng này.</p>
                )}
              </div>

              {/* PHẦN DƯỚI THẺ ĐƠN HÀNG (CHI TIẾT NGƯỜI NHẬN, TỔNG TIỀN) */}
              <div className="bg-slate-50/60 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4 border border-slate-100/50 text-xs">
                <div className="space-y-1.5 flex-1">
                  <p className="font-bold text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-purple-600">person_pin</span>
                    Người nhận: {order.HoTenNguoiNhan} - {order.SoDienThoai}
                  </p>
                  <p className="text-slate-500 font-medium leading-relaxed pl-5">
                    Địa chỉ: {order.DiaChi}
                  </p>
                  {order.GhiChu && (
                    <p className="text-slate-500 italic pl-5">
                      Ghi chú: "{order.GhiChu}"
                    </p>
                  )}
                </div>

                <div className="md:text-right flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-2 pt-2 md:pt-0 border-t border-slate-150 md:border-t-0 shrink-0">
                  <div>
                    <p className="text-slate-400 font-bold">Thanh toán: {order.PhuongThucThanhToan}</p>
                    <p className="text-[10px] text-slate-400">Đã gồm VAT & Phí ship</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tổng tiền</span>
                    <span className="text-lg font-extrabold text-purple-600 font-['Space_Grotesk']">
                      {formatPrice(order.TongTien)}
                    </span>
                  </div>
                </div>
              </div>

              {/* NÚT XEM CHI TIẾT ĐƠN HÀNG */}
              <div className="flex justify-end pt-1">
                <Link
                  to={`/chi-tiet-don-hang/${order.MaDonHang}`}
                  state={{ order }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
