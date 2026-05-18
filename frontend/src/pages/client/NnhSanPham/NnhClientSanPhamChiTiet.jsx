// NnhClientSanPhamChiTiet - Trang chi tiet san pham client
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../../../api/client/tta_shop.api';

// Dữ liệu mẫu cho dung lượng & màu sắc
const STORAGE_OPTIONS = ['256GB', '512GB', '1TB'];
const COLOR_OPTIONS = [
  { name: 'Titan Tự nhiên', hex: '#C4B198' },
  { name: 'Titan Đen', hex: '#3C3C3C' },
  { name: 'Titan Trắng', hex: '#F5F5F0' },
  { name: 'Titan Xanh', hex: '#4A5568' },
];

export default function NnhClientSanPhamChiTiet() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedThumb, setSelectedThumb] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await shopApi.getProductDetail(ma);
        if (res.data?.data) {
          setProduct(res.data.data);
        } else {
          setProduct({
            MaSanPham: ma,
            TenSanPham: 'iPhone 15 Pro Max 256GB Chính hãng VN/A',
            TenDanhMuc: 'iPhone',
            Gia: 34990000,
            GiaBan: 29490000,
            SoLuongTon: 23,
            TrangThai: 1,
            HinhAnh: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
            MoTa: 'iPhone 15 Pro Max mang đến bước đột phá ngoạn mục với thiết kế titan chuẩn hàng không vũ trụ cực kỳ bền bỉ và nhẹ nhàng. Chip A17 Pro mang lại hiệu năng đồ họa đỉnh cao.',
            ThuongHieu: 'Apple',
            XuatXu: 'Đang cập nhật',
            BaoHanh: '12 tháng',
          });
        }
      } catch {
        setProduct({
          MaSanPham: ma,
          TenSanPham: 'iPhone 15 Pro Max 256GB',
          TenDanhMuc: 'iPhone',
          Gia: 34990000,
          GiaBan: 29490000,
          SoLuongTon: 23,
          TrangThai: 1,
          HinhAnh: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
          MoTa: 'Sản phẩm cao cấp thế hệ mới.',
          ThuongHieu: 'Apple',
          XuatXu: 'Đang cập nhật',
          BaoHanh: '12 tháng',
        });
      } finally {
        setLoading(false);
      }
    };
    if (ma) fetchDetail();
  }, [ma]);

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price) + ' đ';

  const handleAddToCart = () => {
    if (!product) return;
    alert(`Đã thêm ${quantity} x "${product.TenSanPham}" (${selectedStorage}, ${selectedColor.name}) vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    alert(`Đang tiến hành thanh toán "${product.TenSanPham}" (${selectedStorage}, ${selectedColor.name})...`);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-5xl text-slate-400">production_quantity_limits</span>
        <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-purple-600 text-white rounded-full text-xs font-bold">Quay lại</button>
      </div>
    );
  }

  const name = product.TenSanPham || 'Sản phẩm';
  const priceSale = product.GiaBan || 15000000;
  const priceOriginal = product.Gia && product.Gia > priceSale ? product.Gia : priceSale * 1.15;
  const discountPercent = Math.round((1 - priceSale / priceOriginal) * 100);
  const stock = product.SoLuongTon ?? 10;

  // Thumbnail images mẫu
  const thumbs = [
    getImageUrl(product.HinhAnh),
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574755393849-623942496936?q=80&w=200&auto=format&fit=crop',
  ];

  return (
    <div className="space-y-8 pb-12 font-['Inter']">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4 pt-2">
        <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-xs">home</span> Home
        </Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-slate-600 font-medium">{product.TenDanhMuc || 'Phone'}</span>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-purple-700 font-bold">{product.TenDanhMuc ? `${product.TenDanhMuc} (${product.ThuongHieu || 'Apple'})` : name}</span>
      </div>

      {/* MAIN: IMAGE + INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* LEFT: IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-center relative overflow-hidden aspect-square group">
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 z-10 space-y-1">
                <span className="block px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-md shadow">Mới</span>
                <span className="block px-3 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-md">🔥 Hot</span>
              </div>
            )}
            <img
              src={thumbs[selectedThumb]}
              alt={name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-lg"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {thumbs.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedThumb(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedThumb === i ? 'border-purple-600 shadow-md' : 'border-slate-200 hover:border-purple-300'}`}
              >
                <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
            <button className="w-16 h-16 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-purple-300 hover:text-purple-500 transition-all">
              <span className="material-symbols-outlined text-xl">360</span>
            </button>
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="space-y-5">
          {/* Brand + Stock */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-md uppercase tracking-wider border border-purple-200/60">
              {product.ThuongHieu || 'Chính hãng'}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              <span className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {stock > 0 ? 'Còn hàng' : 'Tạm hết hàng'}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {name}
          </h1>

          {/* Star Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="material-symbols-outlined text-sm text-amber-400" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              ))}
            </div>
            <span className="text-xs text-slate-500">(342 đánh giá)</span>
            <span className="text-xs text-purple-600 font-semibold cursor-pointer hover:underline">So sánh</span>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50/30 p-5 rounded-2xl border border-purple-100/50 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-red-600 font-['Space_Grotesk'] tracking-tight">
              {formatPrice(priceSale)}
            </span>
            {priceOriginal > priceSale && (
              <span className="text-base text-slate-400 line-through font-semibold">
                {formatPrice(priceOriginal)}
              </span>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Danh mục</span>
              <span className="font-bold text-slate-800">{product.TenDanhMuc || 'iPhone'}</span>
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

          {/* ============ CHỌN DUNG LƯỢNG ============ */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Dung lượng:</label>
            <div className="flex items-center gap-3">
              {STORAGE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedStorage(opt)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                    selectedStorage === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* ============ CHỌN MÀU SẮC ============ */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Màu sắc: <span className="font-normal text-slate-500">{selectedColor.name}</span>
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`w-9 h-9 rounded-full border-2 transition-all duration-200 relative ${
                    selectedColor.name === color.name
                      ? 'border-purple-600 ring-2 ring-purple-200 scale-110'
                      : 'border-slate-300 hover:border-purple-400 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor.name === color.name && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm" style={{ color: color.hex === '#3C3C3C' || color.hex === '#4A5568' ? '#fff' : '#7c3aed' }}>check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Số lượng chọn:</label>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors border-r border-slate-100 font-bold"
                >-</button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  disabled={quantity >= stock}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors border-l border-slate-100 font-bold"
                >+</button>
              </div>
              <span className="text-xs text-slate-400">(Tối đa {stock} sản phẩm)</span>
            </div>
          </div>

          {/* ============ KHUYẾN MẠI & ƯU ĐÃI ============ */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 shadow-sm shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <span className="material-symbols-outlined text-lg">redeem</span>
              Khuyến mãi & Ưu đãi
            </div>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Thu cũ Đổi mới: Giảm đến <strong className="text-purple-700">2 triệu</strong> (Tùy model máy cũ, không kèm các hình thức thanh toán online, mua kèm)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Giảm thêm <strong className="text-purple-700">5%</strong> khi mua cùng Apple Watch (Không áp dụng kèm khuyến mãi khác)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Giảm <strong className="text-purple-700">50%</strong> cho gói Bảo hành mở rộng 12 tháng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Nhập mã <strong className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-mono">VNPAYAPPLE</strong> giảm ngay 500.000đ khi thanh toán qua VNPAY-QR</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-purple-50 text-purple-700 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border-2 border-purple-300 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Mua ngay
            </button>
          </div>

          {/* ============ MUA TRẢ GÓP ============ */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => alert('Chuyển đến trang mua trả góp 0%...')}
              className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm border-2 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">credit_card</span>
              MUA TRẢ GÓP 0%
            </button>
            <button
              onClick={() => alert('Chuyển đến trang mua trả góp qua thẻ...')}
              className="flex-1 py-3 px-5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm border-2 border-blue-500 hover:border-blue-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">credit_score</span>
              MUA TRẢ GÓP QUA THẺ
            </button>
          </div>
        </div>
      </div>

      {/* TABS: MÔ TẢ & THÔNG SỐ */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'desc' ? 'text-purple-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Mô tả sản phẩm
            {activeTab === 'desc' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'specs' ? 'text-purple-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Thông số kỹ thuật
            {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />}
          </button>
        </div>

        {activeTab === 'desc' ? (
          <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
            <p>{product.MoTa || 'Sản phẩm chưa có mô tả chi tiết từ nhà sản xuất. Vui lòng liên hệ bộ phận hỗ trợ khách hàng để biết thêm thông số đầy đủ.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              ['Mã phân phối', `SKU-${product.MaSanPham}`],
              ['Thương hiệu', product.ThuongHieu || 'Chính hãng'],
              ['Danh mục', product.TenDanhMuc || 'Thiết bị'],
              ['Bảo hành', product.BaoHanh || '12 tháng'],
              ['Dung lượng', selectedStorage],
              ['Màu sắc', selectedColor.name],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">{label}:</span>
                <span className="font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
