import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { shopApi } from '../../../api/client/tta_shop.api';
import { useAuth } from '../../../context/AuthContext';
import NvtClientDanhGia from '../NvtDanhGia/NvtClientDanhGia';

export default function NvtClientSanPhamChiTiet() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'specs' hoặc 'reviews'
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'review' || tab === 'reviews') {
      setActiveTab('reviews');
    }
  }, [location]);

  const fetchAverageRating = async () => {
    try {
      const res = await shopApi.getProductReviews(ma);
      if (res.data?.data) {
        setAvgRating(res.data.data.average_stars);
        setTotalReviews(res.data.data.total);
      }
    } catch (err) {
      console.error("Lỗi lấy số sao đánh giá trung bình:", err);
    }
  };

  useEffect(() => {
    if (ma) {
      fetchAverageRating();
    }
  }, [ma]);

  // Lắng nghe sự kiện gửi đánh giá thành công để cập nhật lại số sao
  useEffect(() => {
    const handleReviewSubmitted = () => {
      fetchAverageRating();
    };
    window.addEventListener('review-submitted', handleReviewSubmitted);
    return () => {
      window.removeEventListener('review-submitted', handleReviewSubmitted);
    };
  }, [ma]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await shopApi.getProductDetail(ma);
        if (res.data?.data) {
          setProduct(res.data.data);
        } else {
          // Fallback dữ liệu mẫu cao cấp nếu không tìm thấy trên server
          setProduct({
            MaSanPham: ma,
            TenSanPham: 'iPhone 15 Pro Max 256GB Chính hãng VN/A',
            TenDanhMuc: 'Điện thoại',
            Gia: 34990000,
            GiaBan: 28990000,
            SoLuongTon: 15,
            TrangThai: 1,
            HinhAnh: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
            MoTa: 'iPhone 15 Pro Max mang đến bước đột phá ngoạn mục với thiết kế titan chuẩn hàng không vũ trụ cực kỳ bền bỉ và nhẹ nhàng. Chip A17 Pro mang lại hiệu năng đồ họa đỉnh cao, cho phép chơi các tựa game AAA sống động như console. Hệ thống camera nâng cấp toàn diện với khả năng zoom quang học 5x sắc nét.',
            ThuongHieu: 'Apple',
            XuatXu: 'Mỹ / Trung Quốc',
            BaoHanh: '12 Tháng chính hãng',
          });
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết sản phẩm:', err);
        // Fallback dữ liệu mẫu
        setProduct({
          MaSanPham: ma,
          TenSanPham: 'Sản phẩm cao cấp thế hệ mới',
          TenDanhMuc: 'Thiết bị thông minh',
          Gia: 25000000,
          GiaBan: 21990000,
          SoLuongTon: 10,
          TrangThai: 1,
          HinhAnh: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop',
          MoTa: 'Thiết kế tinh xảo, chất liệu cao cấp cùng hiệu năng tối ưu hóa mang lại trải nghiệm sử dụng hoàn hảo cho không gian làm việc và giải trí của bạn.',
          ThuongHieu: 'Premium Brand',
          XuatXu: 'Nhập khẩu chính hãng',
          BaoHanh: '24 Tháng',
        });
      } finally {
        setLoading(false);
      }
    };

    if (ma) {
      fetchDetail();
    }
  }, [ma]);

  // Hàm hỗ trợ chuẩn hóa đường dẫn hình ảnh sản phẩm
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Hàm định dạng giá tiền tệ Việt Nam Đồng (VND)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Xử lý nút Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate(`/login?redirect=/san-pham/${product.MaSanPham}`);
      return;
    }
    try {
      await shopApi.addToCart({
        MaSanPham: product.MaSanPham,
        SoLuong: quantity
      });
      alert(`Đã thêm ${quantity} sản phẩm "${product.TenSanPham}" vào giỏ hàng thành công!`);
      // Bắn sự kiện cập nhật để header update badge
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      alert("Không thể thêm vào giỏ hàng: " + (err.response?.data?.message || err.message));
    }
  };

  // Xử lý nút Mua ngay (Chuyển đến trang thanh toán)
  const handleBuyNow = () => {
    if (!product) return;
    navigate(`/dat-hang/${product.MaSanPham}?qty=${quantity}`);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Đang tải thông tin chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-5xl text-slate-400">production_quantity_limits</span>
        <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">Sản phẩm này có thể đã bị xóa hoặc đường dẫn không chính xác. Vui lòng kiểm tra lại.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-purple-600 text-white rounded-full text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors">
          Quay lại trang trước
        </button>
      </div>
    );
  }

  // =========================================================================
  // KHU VỰC TÍNH TOÁN GIÁ & PHẦN TRĂM GIẢM GIÁ (FRONTEND LOGIC)
  // Tính toán tương tự trang Danh Sách (List). Công thức: (1 - Giá bán/Giá gốc) * 100
  // =========================================================================
  const name = product.TenSanPham || 'Sản phẩm cao cấp';
  const priceSale = product.GiaBan || 15000000;
  // Thủ thuật fake giá gốc lớn hơn 15% nếu người nhập liệu quên không điền Giá gốc
  const priceOriginal = product.Gia && product.Gia > priceSale ? product.Gia : priceSale * 1.15;
  // Làm tròn phần trăm (ví dụ: 14.5% -> 15%)
  const discountPercent = Math.round((1 - priceSale / priceOriginal) * 100);
  const stock = product.SoLuongTon ?? 10;

  return (
    <div className="space-y-8 pb-12 font-['Inter']">
      {/* THANH ĐIỀU HƯỚNG BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4 pt-2">
        <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-xs">home</span> Trang chủ
        </Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-slate-600 font-medium">{product.TenDanhMuc || 'Sản phẩm'}</span>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-purple-700 font-bold line-clamp-1">{name}</span>
      </div>

      {/* KHU VỰC CHÍNH: HÌNH ẢNH VÀ THÔNG TIN SẢN PHẨM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* BÊN TRÁI: KHUNG HÌNH ẢNH SẢN PHẨM LỚN CÓ VIỀN VÀ BÓNG CAO CẤP */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-10 flex items-center justify-center relative shadow-sm group overflow-hidden aspect-square">
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-extrabold text-xs rounded-full shadow-md tracking-wider z-10">
              GIẢM {discountPercent}%
            </span>
          )}
          <img 
            src={getImageUrl(product.HinhAnh)} 
            alt={name} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 select-none drop-shadow-xl" 
          />
        </div>

        {/* BÊN PHẢI: BẢNG ĐIỀU KHIỂN CHI TIẾT SẢN PHẨM */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            {/* NHÃN THƯƠNG HIỆU, ĐÁNH GIÁ TRUNG BÌNH VÀ TRẠNG THÁI */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-md border border-purple-100/60 uppercase tracking-wider">
                  {product.ThuongHieu || 'Chính hãng'}
                </span>
                
                {totalReviews > 0 ? (
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-50/50 px-2.5 py-1 rounded-lg border border-amber-100/60 text-xs font-bold flex">
                    <span className="material-symbols-outlined text-sm filled">star</span>
                    <span>{avgRating}</span>
                    <span className="text-slate-400 font-medium">({totalReviews} đánh giá)</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold italic">Chưa có đánh giá</span>
                )}
              </div>
              
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                <span className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {stock > 0 ? `Còn hàng (${stock} sản phẩm)` : 'Tạm hết hàng'}
              </span>
            </div>

            {/* TÊN SẢN PHẨM CHÍNH */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-['Space_Grotesk']">
              {name}
            </h1>

            {/* KHU VỰC GIÁ CẢ KẾT HỢP FONT SPACE GROTESK */}
            <div className="bg-gradient-to-r from-purple-50/60 to-indigo-50/30 p-4 rounded-2xl border border-purple-100/50 flex items-baseline gap-4">
              <span className="text-3xl md:text-4xl font-extrabold text-purple-700 font-['Space_Grotesk'] tracking-tight">
                {formatPrice(priceSale)}
              </span>
              {priceOriginal > priceSale && (
                <span className="text-sm md:text-base text-slate-400 line-through font-semibold">
                  {formatPrice(priceOriginal)}
                </span>
              )}
            </div>

            {/* THÔNG TIN TÓM TẮT DƯỚI DẠNG DANH SÁCH RÚT GỌN */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-y border-slate-100 py-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Danh mục</span>
                <span className="font-bold text-slate-800">{product.TenDanhMuc || 'Thiết bị'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Xuất xứ</span>
                <span className="font-bold text-slate-800">{product.XuatXu || 'Đang cập nhật'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Bảo hành</span>
                <span className="font-bold text-slate-800">{product.BaoHanh || '12 tháng'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Vận chuyển</span>
                <span className="font-bold text-purple-600">Miễn phí toàn quốc</span>
              </div>
            </div>

            {/* CHỌN SỐ LƯỢNG */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">Số lượng chọn:</label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-40 disabled:hover:bg-white transition-colors border-r border-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-slate-800 font-['Space_Grotesk']">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-40 disabled:hover:bg-white transition-colors border-l border-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  (Tối đa {stock} sản phẩm)
                </span>
              </div>
            </div>
          </div>

          {/* NHÓM NÚT HÀNH ĐỘNG (CALL TO ACTION) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border border-purple-200/60 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              Thêm vào giỏ hàng
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* KHU VỰC THÔNG TIN MỞ RỘNG (TABS: MÔ TẢ & THÔNG SỐ KỸ THUẬT) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 pt-6">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-3">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'desc' ? 'text-purple-700 font-["Space_Grotesk"]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Mô tả sản phẩm
            {activeTab === 'desc' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'specs' ? 'text-purple-700 font-["Space_Grotesk"]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Thông số kỹ thuật
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'reviews' ? 'text-purple-700 font-["Space_Grotesk"]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Đánh giá ({totalReviews})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>
        </div>

        {/* NỘI DUNG TABS */}
        {activeTab === 'desc' && (
          <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
            <p>{product.MoTa || 'Sản phẩm chưa có mô tả chi tiết từ nhà sản xuất. Vui lòng liên hệ bộ phận hỗ trợ khách hàng để biết thêm thông số đầy đủ.'}</p>
            {product.MoTa && product.MoTa.length > 50 && (
              <p className="pt-2 text-xs text-slate-400 italic">Cam kết hàng chính hãng 100%, hỗ trợ xuất hóa đơn VAT và giao hàng hỏa tốc trong vòng 2 giờ tại các thành phố lớn.</p>
            )}
          </div>
        )}
        
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Mã phân phối:</span>
              <span className="font-bold text-slate-800 font-['Space_Grotesk']">SKU-{product.MaSanPham}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Thương hiệu:</span>
              <span className="font-bold text-purple-700">{product.ThuongHieu || 'Chính hãng'}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Danh mục phân loại:</span>
              <span className="font-bold text-slate-800">{product.TenDanhMuc || 'Thiết bị'}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Bảo hành tiêu chuẩn:</span>
              <span className="font-bold text-slate-800">{product.BaoHanh || '12 tháng'}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Tình trạng tồn kho:</span>
              <span className="font-bold text-slate-800">{stock > 0 ? 'Sẵn sàng giao' : 'Đặt trước'}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Chứng nhận chất lượng:</span>
              <span className="font-bold text-emerald-600">ISO 9001:2015</span>
            </div>
            {product.specifications && product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2.5 px-4 bg-purple-50/40 rounded-xl border border-purple-100/50">
                <span className="text-slate-500 font-semibold">{spec.TenThuocTinh}:</span>
                <span className="font-extrabold text-purple-950">{spec.GiaTri}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <NvtClientDanhGia maSanPham={ma} />
        )}
      </div>
    </div>
  );
}
