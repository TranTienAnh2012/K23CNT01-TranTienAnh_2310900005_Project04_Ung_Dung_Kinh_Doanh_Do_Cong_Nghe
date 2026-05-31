import React, { useState, useEffect } from 'react';
import { shopApi } from '../../../api/client/tta_shop.api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../../../components/AddressSelector';

export default function NvkClientThue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  // Booking Modal State
  const [bookingProduct, setBookingProduct] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    G5_HoTenNguoiNhan: '',
    G5_SoDienThoaiNguoiNhan: '',
    G5_EmailNguoiNhan: '',
    G5_DiaChiNguoiNhan: '',
    G5_NgayBatDau: '',
    G5_NgayKetThuc: '',
    G5_SoLuong: 1,
    G5_GhiChu: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        G5_HoTenNguoiNhan: user.fullname || user.HoTen || '',
        G5_SoDienThoaiNguoiNhan: user.phone || user.SDT || '',
        G5_EmailNguoiNhan: user.email || '',
        G5_DiaChiNguoiNhan: user.address || ''
      }));
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProducts, resHistory] = await Promise.all([
        shopApi.getSanPhamThue(),
        shopApi.getDonHangThue()
      ]);

      if (resProducts.data?.data?.items) {
        setProducts(resProducts.data.data.items);
      }
      if (resHistory.data?.data) {
        setHistory(resHistory.data.data);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu cho thuê:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để sử dụng dịch vụ cho thuê.");
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const handleOpenBooking = (product) => {
    setBookingProduct(product);
    setBookingForm(prev => ({
      ...prev,
      G5_SoLuong: 1,
      G5_NgayBatDau: new Date().toISOString().slice(0, 10),
      G5_NgayKetThuc: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    }));
    setMessage({ type: '', text: '' });
  };

  // Helper calculation
  const getRentalDays = () => {
    if (!bookingForm.G5_NgayBatDau || !bookingForm.G5_NgayKetThuc) return 1;
    const start = new Date(bookingForm.G5_NgayBatDau);
    const end = new Date(bookingForm.G5_NgayKetThuc);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 1 : diffDays;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingProduct) return;

    if (!bookingForm.G5_HoTenNguoiNhan || !bookingForm.G5_SoDienThoaiNguoiNhan || !bookingForm.G5_DiaChiNguoiNhan) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin giao nhận hàng.' });
      return;
    }

    const days = getRentalDays();
    const pricePerDay = Number(bookingProduct.G5_GiaThueNgay || 0);
    const depositPerUnit = Number(bookingProduct.G5_TienCoc || 0);
    const qty = parseInt(bookingForm.G5_SoLuong || 1);

    const rentalFee = pricePerDay * days * qty;
    const totalDeposit = depositPerUnit * qty;
    const totalAmount = rentalFee; // G5_TongTien stores total rent fee

    setSubmitting(true);
    try {
      const payload = {
        G5_NgayBatDau: bookingForm.G5_NgayBatDau + "T08:00:00",
        G5_NgayKetThuc: bookingForm.G5_NgayKetThuc + "T18:00:00",
        G5_TongTien: totalAmount,
        G5_TienCoc: totalDeposit,
        HoTenNguoiNhan: bookingForm.G5_HoTenNguoiNhan,
        SoDienThoaiNguoiNhan: bookingForm.G5_SoDienThoaiNguoiNhan,
        EmailNguoiNhan: bookingForm.G5_EmailNguoiNhan,
        DiaChiNguoiNhan: bookingForm.G5_DiaChiNguoiNhan,
        GhiChu: bookingForm.G5_GhiChu,
        items: [
          {
            G5_MaSanPham: bookingProduct.G5_MaSanPham,
            G5_SoLuong: qty,
            G5_GiaThue: pricePerDay
          }
        ]
      };

      const res = await shopApi.createDonHangThue(payload);
      if (res.data?.success) {
        alert("Gửi yêu cầu thuê sản phẩm thành công!");
        setBookingProduct(null);
        setActiveTab('orders');
        loadData();
      } else {
        setMessage({ type: 'error', text: res.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Không thể gửi yêu cầu đặt thuê.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu thuê này?")) return;
    try {
      const res = await shopApi.cancelDonHangThue(orderId);
      if (res.data?.success) {
        alert("Đã hủy đơn thuê thành công!");
        loadData();
      } else {
        alert(res.data?.message || "Không thể hủy đơn thuê.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Đã xảy ra lỗi khi hủy đơn thuê.");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã duyệt':
      case 'Approved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Đã duyệt</span>;
      case 'Đang thuê':
      case 'Active':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">Đang thuê</span>;
      case 'Đã trả':
      case 'Returned':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200">Đã trả</span>;
      case 'Đã hủy':
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Chờ xác nhận</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 font-['Inter'] min-h-screen">
      
      {/* Banner giới thiệu */}
      <div className="w-full bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden shadow-xl shadow-purple-950/10">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[200px]">event_available</span>
        </div>
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300 tracking-wider uppercase">Dịch vụ chính hãng</span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-['Space_Grotesk'] tracking-tight">Dịch Vụ Cho Thuê Thiết Bị Công Nghệ</h1>
          <p className="text-sm md:text-base text-purple-200/80 leading-relaxed font-medium">
            Zenith Ztore cung cấp giải pháp thuê ngắn hạn và dài hạn điện thoại, laptop, thiết bị thông minh phục vụ công việc, sự kiện hoặc trải nghiệm sản phẩm trước khi mua.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-purple-100/60 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-base font-bold transition-all relative ${
            activeTab === 'products' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sản phẩm cho thuê
          {activeTab === 'products' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-base font-bold transition-all relative ${
            activeTab === 'orders' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Đơn thuê của bạn ({history.length})
          {activeTab === 'orders' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu cho thuê...</p>
        </div>
      ) : activeTab === 'products' ? (
        
        /* TAB 1: DANH SÁCH SẢN PHẨM */
        products.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
            <p className="text-sm font-semibold">Hiện chưa có sản phẩm nào cho thuê.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.G5_Id}
                className="group bg-white border border-slate-100/80 hover:border-purple-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 p-2 mb-3">
                  <img
                    src={getImageUrl(prod.G5_HinhAnh)}
                    alt={prod.G5_TenSanPham}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs md:text-sm text-slate-800 line-clamp-2 leading-snug">
                      {prod.G5_TenSanPham}
                    </h3>
                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                      <p>Số lượng sẵn có: <strong className="text-slate-800">{prod.G5_SoLuongChoThue}</strong></p>
                      <p>Tiền cọc thiết bị: <strong className="text-purple-700">{Number(prod.G5_TienCoc || 0).toLocaleString('vi-VN')} đ</strong></p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-50 mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-purple-600 font-extrabold text-base font-['Space_Grotesk']">
                        {Number(prod.G5_GiaThueNgay).toLocaleString('vi-VN')} đ
                      </span>
                      <span className="text-slate-400 text-[10px]">/ ngày</span>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(prod)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors text-center active:scale-95 shadow-sm"
                    >
                      Thuê ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        
        /* TAB 2: ĐƠN THUÊ CỦA BẠN */
        history.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-5xl mb-3">receipt_long</span>
            <p className="text-sm font-semibold">Bạn chưa có đơn đặt thuê nào.</p>
            <button
              onClick={() => setActiveTab('products')}
              className="mt-3 text-xs font-bold text-purple-600 hover:underline"
            >
              Khám phá sản phẩm cho thuê
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((order) => (
              <div key={order.G5_MaDonThue} className="border border-purple-50 rounded-2xl p-6 shadow-sm bg-gradient-to-br from-white to-purple-50/10 hover:border-purple-100 transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-50 pb-4 mb-4 gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800">Mã đơn thuê: #{order.G5_MaDonThue}</h3>
                    <p className="text-xs text-slate-400">
                      Thời gian: {formatDate(order.G5_NgayBatDau)} - {formatDate(order.G5_NgayKetThuc)}
                    </p>
                    {order.G5_SoDienThoaiNguoiNhan && (
                      <p className="text-xs text-purple-700 font-semibold mt-1">
                        Người nhận: {order.G5_HoTenNguoiNhan} - {order.G5_SoDienThoaiNguoiNhan}
                      </p>
                    )}
                    {order.G5_DiaChiNguoiNhan && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Địa chỉ: {order.G5_DiaChiNguoiNhan}
                      </p>
                    )}
                    {order.G5_GhiChu && (
                      <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                        <strong className="text-slate-600 font-semibold">Ghi chú:</strong> {order.G5_GhiChu}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.G5_TrangThai)}
                    {['Chờ xác nhận', 'Pending'].includes(order.G5_TrangThai) && (
                      <button
                        onClick={() => handleCancelOrder(order.G5_MaDonThue)}
                        className="px-3 py-1 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        Hủy yêu cầu
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg p-1">
                        <img src={getImageUrl(item.G5_HinhAnh)} alt={item.G5_TenSanPham} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.G5_TenSanPham}</h4>
                        <p className="text-xs text-slate-500">Số lượng: {item.G5_SoLuong}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{Number(item.G5_GiaThue).toLocaleString('vi-VN')} đ <span className="text-[10px] text-slate-400">/ngày</span></p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost summary */}
                <div className="mt-4 pt-4 border-t border-purple-50 flex flex-wrap justify-between items-center text-sm gap-4">
                  <div className="flex gap-4 text-xs text-slate-500">
                    <p>Tiền cọc thiết bị: <strong className="text-slate-700">{Number(order.G5_TienCoc || 0).toLocaleString('vi-VN')} đ</strong></p>
                    <p>Trạng thái thanh toán: <strong className="text-purple-700">{order.G5_TrangThaiThanhToan || 'Chưa thanh toán'}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 mr-2">Tổng tiền thuê:</span>
                    <strong className="text-purple-600 text-lg font-['Space_Grotesk']">
                      {Number(order.G5_TongTien).toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* BOOKING MODAL */}
      {bookingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-purple-100 animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Yêu Cầu Thuê Thiết Bị</h3>
                <p className="text-xs text-purple-200">Đăng ký thủ tục thuê nhanh chóng</p>
              </div>
              <button
                onClick={() => setBookingProduct(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Alert Message (Fixed, outside scrollable body) */}
            {message.text && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100">
                {message.text}
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              
              {/* Product Info Summary */}
              <div className="flex gap-4 p-3 bg-purple-50/50 border border-purple-100 rounded-xl items-center">
                <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0 border border-purple-100/50">
                  <img src={getImageUrl(bookingProduct.G5_HinhAnh)} alt={bookingProduct.G5_TenSanPham} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{bookingProduct.G5_TenSanPham}</h4>
                  <p className="text-xs text-purple-700 font-semibold mt-1">
                    Giá thuê: {Number(bookingProduct.G5_GiaThueNgay).toLocaleString('vi-VN')} đ/ngày
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Cọc thiết bị: {Number(bookingProduct.G5_TienCoc).toLocaleString('vi-VN')} đ/chiếc
                  </p>
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên người nhận</label>
                  <input
                    type="text"
                    value={bookingForm.G5_HoTenNguoiNhan}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, G5_HoTenNguoiNhan: e.target.value }))}
                    className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={bookingForm.G5_SoDienThoaiNguoiNhan}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, G5_SoDienThoaiNguoiNhan: e.target.value }))}
                    className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email liên hệ</label>
                <input
                  type="email"
                  value={bookingForm.G5_EmailNguoiNhan}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, G5_EmailNguoiNhan: e.target.value }))}
                  className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ nhận hàng</label>
                <AddressSelector
                  value={bookingForm.G5_DiaChiNguoiNhan}
                  onChange={(val) => setBookingForm(prev => ({ ...prev, G5_DiaChiNguoiNhan: val }))}
                  placeholder="Số nhà, ngõ, tên đường..."
                  required={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={bookingForm.G5_NgayBatDau}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, G5_NgayBatDau: e.target.value }))}
                    className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={bookingForm.G5_NgayKetThuc}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, G5_NgayKetThuc: e.target.value }))}
                    className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng thuê</label>
                  <input
                    type="number"
                    min="1"
                    max={bookingProduct.G5_SoLuongChoThue || 10}
                    value={bookingForm.G5_SoLuong}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, G5_SoLuong: parseInt(e.target.value) || 1 }))}
                    className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Thời gian thuê</label>
                  <p className="h-10 flex items-center text-xs font-bold text-slate-700">{getRentalDays()} ngày</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú</label>
                <textarea
                  value={bookingForm.G5_GhiChu}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, G5_GhiChu: e.target.value }))}
                  placeholder="Yêu cầu cấu hình, thời gian giao nhận..."
                  rows="2"
                  className="w-full p-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10 resize-none"
                />
              </div>

              {/* Price Calculation details summary */}
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiền thuê ({getRentalDays()} ngày x {bookingForm.G5_SoLuong} chiếc):</span>
                  <span className="font-bold text-slate-800">
                    {Number(Number(bookingProduct.G5_GiaThueNgay) * getRentalDays() * bookingForm.G5_SoLuong).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiền đặt cọc thiết bị:</span>
                  <span className="font-bold text-slate-800">
                    {Number(Number(bookingProduct.G5_TienCoc) * bookingForm.G5_SoLuong).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="h-[1px] bg-purple-100 my-1" />
                <div className="flex justify-between text-sm">
                  <strong className="text-slate-700">Tổng tạm tính (Thuê + Cọc):</strong>
                  <strong className="text-purple-700 font-['Space_Grotesk'] text-base">
                    {Number(
                      (Number(bookingProduct.G5_GiaThueNgay) * getRentalDays() * bookingForm.G5_SoLuong) +
                      (Number(bookingProduct.G5_TienCoc || 0) * bookingForm.G5_SoLuong)
                    ).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
                <p className="text-[9px] text-slate-400 mt-1 italic text-center">* Lưu ý: Tiền đặt cọc sẽ được hoàn trả đầy đủ sau khi hoàn tất thanh lý hợp đồng thuê và trả lại máy nguyên vẹn.</p>
              </div>

              {/* Modal Footer */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">event_available</span>
                    <span>Xác Nhận Đặt Thuê</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
