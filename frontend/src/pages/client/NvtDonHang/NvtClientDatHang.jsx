import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientDatHang() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const qty = parseInt(searchParams.get('qty'));
    return !isNaN(qty) && qty > 0 ? qty : 1;
  });

  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);

  const cartItems = location.state?.items || [];
  const isFromCart = ma === 'cart' || ma === 'gio-hang';

  // Form states
  const [formData, setFormData] = useState({
    HoTenNguoiNhan: '',
    SoDienThoaiNguoiNhan: '',
    DiaChiNguoiNhan: '',
    EmailNguoiNhan: '',
    GhiChu: '',
    PhuongThucThanhToan: 'COD'
  });

  const priceSale = product ? (product.GiaBan || product.Gia || 15000000) : 0;
  const totalPrice = isFromCart
    ? cartItems.reduce((sum, item) => sum + item.GiaBan * item.SoLuong, 0)
    : priceSale * quantity;

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    if (isFromCart) {
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await shopApi.getProductDetail(ma);
        if (res.data && res.data.data) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [ma, isFromCart]);

  // Lấy danh sách voucher đã nhận chưa dùng
  useEffect(() => {
    if (!user) return;
    const fetchUserVouchers = async () => {
      try {
        const res = await shopApi.getMyVouchers();
        if (res.data?.data) {
          const unused = res.data.data.filter(v => !v.IsUsed);
          setVouchers(unused);
        }
      } catch (err) {
        console.error("Lỗi lấy ví voucher:", err);
      }
    };
    fetchUserVouchers();
  }, [user]);

  // Tính toán số tiền được giảm giá
  useEffect(() => {
    if (!selectedVoucher) {
      setDiscount(0);
      return;
    }
    
    // Kiểm tra xem đơn hàng có thỏa mãn điều kiện tối thiểu không
    if (totalPrice < selectedVoucher.MinOrderValue) {
      alert(`Đơn hàng chưa đạt giá trị tối thiểu ${formatPrice(selectedVoucher.MinOrderValue)} để áp dụng mã này.`);
      setSelectedVoucher(null);
      setDiscount(0);
      return;
    }

    if (selectedVoucher.DiscountType === 'percent') {
      let calcDiscount = (totalPrice * selectedVoucher.DiscountValue) / 100;
      if (selectedVoucher.MaxDiscount > 0 && calcDiscount > selectedVoucher.MaxDiscount) {
        calcDiscount = selectedVoucher.MaxDiscount;
      }
      setDiscount(calcDiscount);
    } else {
      let calcDiscount = selectedVoucher.DiscountValue;
      if (calcDiscount > totalPrice) {
        calcDiscount = totalPrice;
      }
      setDiscount(calcDiscount);
    }
  }, [selectedVoucher, totalPrice]);

  // Tự động điền email của người dùng đã đăng nhập nếu có
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        EmailNguoiNhan: user.email
      }));
    }
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
            Bạn cần đăng nhập tài khoản để thực hiện mua sắm và thanh toán tại Zenith Store.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-3">
          <Link
            to={`/login?redirect=/dat-hang/${ma}`}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-900/10 hover:scale-[1.02] active:scale-95 transition-all"
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

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-purple-600">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold animate-pulse">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!isFromCart && !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Lỗi tải sản phẩm</h2>
          <p className="text-sm text-slate-500">
            Sản phẩm bạn đang mua không tồn tại hoặc đã ngừng kinh doanh.
          </p>
        </div>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty < 1) return;
    if (product.SoLuongTon !== undefined && newQty > product.SoLuongTon) {
      alert(`Rất tiếc, sản phẩm này chỉ còn ${product.SoLuongTon} sản phẩm trong kho.`);
      return;
    }
    setQuantity(newQty);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.HoTenNguoiNhan || !formData.SoDienThoaiNguoiNhan || !formData.DiaChiNguoiNhan || !formData.EmailNguoiNhan) {
      alert("Vui lòng nhập đầy đủ các thông tin giao hàng bắt buộc.");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        HoTenNguoiNhan: formData.HoTenNguoiNhan,
        SoDienThoaiNguoiNhan: formData.SoDienThoaiNguoiNhan,
        DiaChiNguoiNhan: formData.DiaChiNguoiNhan,
        EmailNguoiNhan: formData.EmailNguoiNhan,
        TongTien: totalPrice - discount,
        GhiChu: formData.GhiChu,
        PhuongThucThanhToan: formData.PhuongThucThanhToan,
        TrangThaiThanhToan: formData.PhuongThucThanhToan === 'Bank Transfer' ? 'Paid' : 'Unpaid',
        VoucherId: selectedVoucher ? selectedVoucher.VoucherId : null,
        items: isFromCart
          ? cartItems.map(item => ({
              MaSanPham: item.MaSanPham,
              SoLuong: item.SoLuong
            }))
          : [
              {
                MaSanPham: product.MaSanPham,
                SoLuong: quantity
              }
            ]
      };

      const res = await shopApi.placeOrder(orderPayload);
      alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng tại Zenith Store.");
      window.dispatchEvent(new Event('cart-updated')); // Cập nhật lại badge giỏ hàng
      navigate('/lich-su-don-hang'); // Quay về trang lịch sử đơn hàng
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert("Đặt hàng thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6 font-['Inter']">
      {/* Nút quay lại */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 font-bold mb-6 transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Quay lại mua sắm
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] mb-8 tracking-tight">Thanh Toán Đơn Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT PHẢI: FORM THÔNG TIN GIAO HÀNG */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">local_shipping</span>
            Thông Tin Giao Hàng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Họ tên người nhận <span className="text-rose-500">*</span></label>
              <input 
                required
                type="text" 
                name="HoTenNguoiNhan"
                value={formData.HoTenNguoiNhan}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại <span className="text-rose-500">*</span></label>
              <input 
                required
                type="tel" 
                name="SoDienThoaiNguoiNhan"
                value={formData.SoDienThoaiNguoiNhan}
                onChange={handleInputChange}
                placeholder="09xxxxxxxx"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email liên hệ <span className="text-rose-500">*</span></label>
            <input 
              required
              type="email" 
              name="EmailNguoiNhan"
              value={formData.EmailNguoiNhan}
              onChange={handleInputChange}
              placeholder="customer@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-slate-50/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ giao hàng <span className="text-rose-500">*</span></label>
            <input 
              required
              type="text" 
              name="DiaChiNguoiNhan"
              value={formData.DiaChiNguoiNhan}
              onChange={handleInputChange}
              placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành Phố"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-slate-50/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ghi chú đơn hàng</label>
            <textarea 
              name="GhiChu"
              value={formData.GhiChu}
              onChange={handleInputChange}
              rows="3"
              placeholder="Ghi chú về thời gian giao hàng, hướng dẫn tìm nhà..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-slate-50/50 resize-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phương Thức Thanh Toán</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.PhuongThucThanhToan === 'COD' ? 'border-purple-600 bg-purple-50/30' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input 
                  type="radio" 
                  name="PhuongThucThanhToan"
                  value="COD"
                  checked={formData.PhuongThucThanhToan === 'COD'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-slate-400">Nhận hàng và thanh toán tiền mặt</p>
                </div>
              </label>

              <label className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.PhuongThucThanhToan === 'Bank Transfer' ? 'border-purple-600 bg-purple-50/30' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input 
                  type="radio" 
                  name="PhuongThucThanhToan"
                  value="Bank Transfer"
                  checked={formData.PhuongThucThanhToan === 'Bank Transfer'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">Chuyển khoản Ngân hàng (QR)</p>
                  <p className="text-xs text-slate-400">Quét mã QR chuyển khoản tức thì</p>
                </div>
              </label>
            </div>
          </div>

          {formData.PhuongThucThanhToan === 'Bank Transfer' && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 mt-4">
              <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm">
                {/* QR code demo */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ZenithStoreTransfer_${ma}`} 
                  alt="QR Code thanh toan" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Thông tin tài khoản</p>
                <p className="text-sm font-bold text-slate-800">NGÂN HÀNG QUÂN ĐỘI (MB BANK)</p>
                <p className="text-sm font-semibold text-slate-600">Số tài khoản: <span className="font-bold text-purple-600">2310900005</span></p>
                <p className="text-sm font-semibold text-slate-600">Chủ tài khoản: <span className="font-bold text-slate-800">TRAN TIEN ANH</span></p>
                <p className="text-xs text-rose-500 font-medium italic mt-2">
                  * Vui lòng thanh toán và chụp lại bill giao dịch trước khi hoàn tất đặt hàng.
                </p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-2xl font-bold text-base shadow-lg shadow-purple-900/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý đặt hàng...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                  Xác Nhận Đặt Hàng & Thanh Toán
                </>
              )}
            </button>
          </div>
        </form>

        {/* CỘT TRÁI: THÔNG TIN TÓM TẮT SẢN PHẨM MUA */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-6">
          <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">shopping_bag</span>
            Tóm Tắt Đơn Hàng
          </h2>

          {isFromCart ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item, idx) => (
                <div key={item.Id || idx} className="flex gap-4 items-start border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1.5 overflow-hidden flex items-center justify-center shrink-0">
                    <img 
                      src={getImageUrl(item.HinhAnh)} 
                      alt={item.TenSanPham} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
                      {item.TenSanPham}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {formatPrice(item.GiaBan)} x {item.SoLuong}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src={getImageUrl(product.HinhAnh)} 
                  alt={product.TenSanPham} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">
                  {product.TenDanhMuc || "Thiết bị công nghệ"}
                </span>
                <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug">
                  {product.TenSanPham}
                </h3>
                <p className="text-slate-400 text-xs font-semibold">Thương hiệu: {product.ThuongHieu || 'Zenith'}</p>
                
                {product.SoLuongTon !== undefined && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Còn lại {product.SoLuongTon} sản phẩm trong kho
                  </p>
                )}
              </div>
            </div>
          )}

          {!isFromCart && (
            <div className="flex items-center justify-between py-4 border-y border-slate-50">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Số lượng mua</p>
                <p className="text-[10px] text-slate-400 italic">Chọn số lượng đặt hàng</p>
              </div>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">{quantity}</span>
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* PHẦN CHỌN VOUCHER */}
          <div className="bg-purple-50/40 border border-purple-100/50 rounded-2xl p-4 space-y-3 mt-4">
            <div className="flex items-center gap-2 text-purple-950 font-bold text-sm font-['Space_Grotesk']">
              <span className="material-symbols-outlined text-purple-600 text-lg">local_activity</span>
              Zenith Voucher
            </div>
            
            {vouchers.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Bạn không có mã giảm giá nào khả dụng.</p>
            ) : (
              <div className="space-y-2">
                <select
                  value={selectedVoucher ? selectedVoucher.VoucherId : ''}
                  onChange={(e) => {
                    const vId = parseInt(e.target.value);
                    const found = vouchers.find(v => v.VoucherId === vId);
                    setSelectedVoucher(found || null);
                  }}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                >
                  <option value="">-- Chọn mã giảm giá của bạn --</option>
                  {vouchers.map((v) => {
                    const isApplicable = totalPrice >= v.MinOrderValue;
                    return (
                      <option key={v.VoucherId} value={v.VoucherId} disabled={!isApplicable}>
                        {v.Code} - {v.DiscountType === 'percent' ? `Giảm ${v.DiscountValue}%` : `Giảm ${formatPrice(v.DiscountValue)}`} 
                        {!isApplicable ? ` (Đơn tối thiểu ${formatPrice(v.MinOrderValue)})` : ''}
                      </option>
                    );
                  })}
                </select>
                
                {selectedVoucher && (
                  <div className="p-2.5 bg-white border border-purple-100 rounded-xl flex items-start gap-2 shadow-inner">
                    <span className="material-symbols-outlined text-purple-600 text-sm mt-0.5">verified</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-purple-700 truncate">{selectedVoucher.Name}</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Đã áp dụng mã <span className="font-bold text-slate-800">{selectedVoucher.Code}</span>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedVoucher(null)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-750 cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
            {!isFromCart ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Giá bán sản phẩm</span>
                  <span className="font-semibold text-slate-800">{formatPrice(priceSale)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Số lượng mua</span>
                  <span className="font-semibold text-slate-800">x {quantity}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Số lượng sản phẩm</span>
                <span className="font-semibold text-slate-800">{cartItems.reduce((sum, item) => sum + item.SoLuong, 0)} sản phẩm</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Phí giao hàng</span>
              <span className="text-emerald-600 font-bold">Miễn phí</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-purple-700 font-bold bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/50">
                <span className="flex items-center gap-1.5 font-['Space_Grotesk']">
                  <span className="material-symbols-outlined text-sm">local_activity</span>
                  Giảm giá voucher
                </span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            
            <div className="border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Tổng tiền thanh toán</p>
                <p className="text-[10px] text-slate-400">Đã bao gồm VAT nếu có</p>
              </div>
              <span className="text-xl font-extrabold text-purple-600 font-['Space_Grotesk']">
                {formatPrice(totalPrice - discount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
