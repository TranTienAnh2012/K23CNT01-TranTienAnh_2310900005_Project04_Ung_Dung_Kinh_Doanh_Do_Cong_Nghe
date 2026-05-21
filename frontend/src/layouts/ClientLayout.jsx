import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import NnhClientHeader from '../pages/components/NnhClientHeader';
import NnhClientFooter from '../pages/components/NnhClientFooter';
import NnhClientBanners from '../pages/components/NnhClientBanners';
import NvtClientSanPhamList from '../pages/client/NvtSanPham/NvtClientSanPhamList';
import { shopApi } from '../api/client/tta_shop.api';

export default function ClientLayout() {
  const scrollRef = React.useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  // Trạng thái lưu trữ danh sách sản phẩm lấy từ API
  const [products, setProducts] = useState([]);
  // Trạng thái lưu trữ danh sách banner động lấy từ CSDL
  const [banners, setBanners] = useState([]);
  // Trạng thái lưu trữ danh mục thực tế từ CSDL Admin
  const [categories, setCategories] = useState([]);
  // Trạng thái tải dữ liệu (loading)
  const [loading, setLoading] = useState(true);
  // Trạng thái danh mục đang được chọn để lọc sản phẩm
  const [selectedCategory, setSelectedCategory] = useState('');

  // Hàm gọi API lấy danh sách sản phẩm và banner công khai khi trang được tải
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await shopApi.getProducts();
        if (res.data?.data?.items) {
          setProducts(res.data.data.items);
        } else if (res.data?.data) {
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error('Lỗi lấy sản phẩm công khai:', err);
        // Dữ liệu sản phẩm mẫu (fallback) trong trường hợp không kết nối được API
        setProducts([
          {
            G5_MaSP: 1,
            G5_TenSP: 'iPhone 15 Pro Max 256GB',
            G5_Gia: 28990000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Điện thoại',
            discount: '-10%',
          },
          {
            G5_MaSP: 2,
            G5_TenSP: 'MacBook Air M2 2023 15 inch',
            G5_Gia: 24990000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Laptop',
            discount: '-20%',
          },
          {
            G5_MaSP: 3,
            G5_TenSP: 'AirPods Pro 2 USB-C',
            G5_Gia: 5490000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Tai nghe',
            discount: '-15%',
          },
          {
            G5_MaSP: 4,
            G5_TenSP: 'Apple Watch Series 9 GPS 41mm',
            G5_Gia: 8490000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Đồng hồ',
            discount: '-20%',
          },
          {
            G5_MaSP: 5,
            G5_TenSP: 'Samsung Galaxy S24 Ultra 512GB',
            G5_Gia: 23990000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Điện thoại',
            discount: '-10%',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await shopApi.getBanners();
        if (res.data?.data?.items) {
          setBanners(res.data.data.items);
        } else if (res.data?.data) {
          setBanners(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error('Lỗi lấy banner công khai:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await shopApi.getCategories();
        if (res.data?.data?.items) {
          setCategories(res.data.data.items);
        } else if (res.data?.data) {
          setCategories(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error('Lỗi lấy danh mục công khai:', err);
      }
    };

    fetchProducts();
    fetchBanners();
    fetchCategories();
  }, []);

  // Hàm hỗ trợ chuẩn hóa đường dẫn hình ảnh sản phẩm
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Hàm định dạng giá tiền tệ Việt Nam Đồng (VND)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Ánh xạ danh mục thực tế từ CSDL Admin kết hợp hình ảnh minh họa sang trọng
  const defaultIcons = ['smartphone', 'laptop_mac', 'headphones', 'watch', 'cable', 'battery_charging_full', 'speaker', 'tablet_mac'];
  const defaultImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181130329-d50675f07ac5?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609592424086-3b1029ba7d26?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200&auto=format&fit=crop'
  ];

  const finalCategoriesList = categories.length > 0
    ? categories.map((c, index) => ({
        name: c.TenDanhMuc || c.G5_TenDanhMuc,
        icon: defaultIcons[index % defaultIcons.length],
        img: defaultImages[index % defaultImages.length]
      }))
    : [
        { name: 'Điện thoại', icon: 'smartphone', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop' },
        { name: 'Laptop', icon: 'laptop_mac', img: 'https://images.unsplash.com/photo-1496181130329-d50675f07ac5?q=80&w=200&auto=format&fit=crop' },
        { name: 'Tai nghe', icon: 'headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop' },
        { name: 'Đồng hồ', icon: 'watch', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
      ];

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col selection:bg-purple-100 text-slate-800">
      {/* PHẦN HEADER & THANH CHỌN DANH MỤC TÍCH HỢP ĐỒNG BỘ */}
      <NnhClientHeader categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT) CỦA LAYOUT SHOPPING */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 md:px-8 py-6 space-y-10">
        {/* CÁC THÀNH PHẦN CHỈ HIỂN THỊ Ở TRANG CHỦ */}
        {isHomePage && (
          <div className="space-y-10">
            {/* KHU VỰC BANNER HERO NỔI BẬT ĐỘNG TỪ CSDL G5_BANNER */}
        <NnhClientBanners 
          banners={banners} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />

        {/* THANH CAM KẾT CHẤT LƯỢNG (TRUST BADGES / FEATURES) */}
        <div className="bg-[#f8f5ff] border border-purple-100 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Miễn phí giao hàng</p>
              <p className="text-xs text-purple-600/80">Cho đơn từ 500k</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">security</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Thanh toán an toàn</p>
              <p className="text-xs text-purple-600/80">100% bảo mật</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">cached</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Đổi trả dễ dàng</p>
              <p className="text-xs text-purple-600/80">Trong 7 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">support_agent</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Hỗ trợ 24/7</p>
              <p className="text-xs text-purple-600/80">0387742492</p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH DANH MỤC DẠNG PILLS TRƯỢT */}
        <div className="relative flex items-center bg-slate-50/40 border border-slate-100 rounded-2xl p-2 max-w-full">
          {/* Nút scroll trái */}
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm text-slate-500 active:scale-95 transition-all z-10 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
          </button>

          {/* Container các pills */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2.5 overflow-x-auto scrollbar-none px-2 scroll-smooth w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {finalCategoriesList.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border duration-300 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Nút scroll phải */}
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm text-slate-500 active:scale-95 transition-all z-10 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
          </button>
        </div>

        {/* LƯỚI SẢN PHẨM BÁN CHẠY HOẶC SẢN PHẨM ĐƯỢC LỌC (PRODUCTS GRID) */}
        <NvtClientSanPhamList 
          products={products} 
          loading={loading} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
          </div>
        )}

        {/* PHẦN HIỂN THỊ NỘI DUNG CÁC TRANG CON (OUTLET - Ví dụ: Trang Chi tiết sản phẩm, Blog/Tin tức) */}
        <div className={isHomePage ? "pt-8 border-t border-purple-50" : ""}>
          <Outlet context={{ selectedCategory, setSelectedCategory }} />
        </div>
      </main>

      {/* PHẦN CHÂN TRANG (FOOTER) */}
      <NnhClientFooter />
    </div>
  );
}
