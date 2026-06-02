import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shopApi } from '../../api/client/tta_shop.api';

export default function NnhClientHeader({ categories = [], selectedCategory = '', onSelectCategory }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const [searchVal, setSearchVal] = useState(selectedCategory);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [languages, setLanguages] = useState({});
  const [currentLang, setCurrentLang] = useState('vi');

  useEffect(() => {
    if (window.NQT_LANGUAGES) {
      setLanguages(window.NQT_LANGUAGES);
    }
    setCurrentLang(localStorage.getItem('website_lang') || 'vi');
  }, []);

  // Đồng bộ searchVal khi category thay đổi bên ngoài
  useEffect(() => {
    setSearchVal(selectedCategory);
  }, [selectedCategory]);

  // Lắng nghe sự kiện cuộn trang để ẩn/hiện thanh danh mục & top bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsNavVisible(prev => {
        if (prev) {
          // Trạng thái Đang Hiện: Ẩn đi khi cuộn xuống vượt quá ngưỡng trên
          const collapseThreshold = isHomePage ? 450 : 100;
          if (currentScrollY > collapseThreshold) {
            return false; // Thu gọn thanh nav
          }
        } else {
          // Trạng thái Đang Ẩn: Chỉ hiện lại khi cuộn ngược hẳn về gần đầu trang (tránh giật lag ở giữa/dưới trang)
          const expandThreshold = isHomePage ? 300 : 40;
          if (currentScrollY <= expandThreshold) {
            return true; // Mở rộng thanh nav
          }
        }
        return prev;
      });

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Xử lý tìm kiếm theo từ khóa
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(searchVal);
    }
    navigate('/');
  };

  // Lấy số lượng giỏ hàng của user
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      try {
        const res = await shopApi.getCart();
        if (res.data?.data) {
          setCartCount(res.data.data.length);
        }
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
      }
    };

    fetchCartCount();

    // Lắng nghe sự kiện update giỏ hàng để cập nhật badge ngay lập tức
    const handleCartUpdated = () => {
      fetchCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdated);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdated);
    };
  }, [user]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xây dựng danh sách tab điều hướng động từ danh mục thực tế của Admin
  const navTabs = categories.length > 0
    ? [
      { id: '', name: 'Trang chủ' },
      ...categories.map(c => ({ id: c.TenDanhMuc || c.G5_TenDanhMuc, name: c.TenDanhMuc || c.G5_TenDanhMuc })),
    ]
    : [
      { id: '', name: 'Trang chủ' },
      { id: 'Điện thoại', name: 'Điện thoại' },
      { id: 'Laptop', name: 'Laptop' },
      { id: 'Tai nghe', name: 'Tai nghe' },
      { id: 'Đồng hồ', name: 'Đồng hồ' },
      { id: 'Phụ kiện', name: 'Phụ kiện' },
      { id: 'Thiết bị thông minh', name: 'Thiết bị thông minh' },
    ];

  return (
    <header className="w-full bg-white font-['Inter'] select-none border-b border-purple-100/50 sticky top-0 z-50 shadow-sm">
      {/* THANH THÔNG BÁO TRÊN CÙNG (TOP BAR) */}
      <div
        style={{ transition: 'max-height 0.2s ease-in-out, opacity 0.15s ease-in-out, padding 0.2s ease-in-out' }}
        className={`w-full bg-[#fdfcff] border-b border-purple-50 px-4 md:px-12 flex justify-between items-center text-xs text-purple-950/70 font-medium overflow-hidden ${isNavVisible ? 'max-h-[36px] py-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-sm">local_shipping</span>
          <span>Miễn phí giao hàng cho đơn từ 500k</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-purple-600 text-sm">verified_user</span>
            <span>Bảo hành chính hãng 12 tháng</span>
          </div>

          <div className="flex items-center gap-2 border border-purple-100/40 bg-purple-50/30 rounded-full px-2.5 py-0.5 select-none">
            <button
              type="button"
              onClick={() => window.changeLanguage?.('vi')}
              className={`text-base transition-all hover:scale-120 cursor-pointer ${currentLang === 'vi' ? 'scale-110 filter-none opacity-100 font-bold' : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'}`}
              title="Tiếng Việt"
            >
              🇻🇳
            </button>
            <button
              type="button"
              onClick={() => window.changeLanguage?.('en')}
              className={`text-base transition-all hover:scale-120 cursor-pointer ${currentLang === 'en' ? 'scale-110 filter-none opacity-100 font-bold' : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'}`}
              title="English"
            >
              🇺🇸
            </button>
            <button
              type="button"
              onClick={() => window.changeLanguage?.('zh-CN')}
              className={`text-base transition-all hover:scale-120 cursor-pointer ${currentLang === 'zh-CN' ? 'scale-110 filter-none opacity-100 font-bold' : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'}`}
              title="简体中文"
            >
              🇨🇳
            </button>
            <button
              type="button"
              onClick={() => window.changeLanguage?.('ja')}
              className={`text-base transition-all hover:scale-120 cursor-pointer ${currentLang === 'ja' ? 'scale-110 filter-none opacity-100 font-bold' : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'}`}
              title="日本語"
            >
              🇯🇵
            </button>
            <button
              type="button"
              onClick={() => window.changeLanguage?.('ko')}
              className={`text-base transition-all hover:scale-120 cursor-pointer ${currentLang === 'ko' ? 'scale-110 filter-none opacity-100 font-bold' : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'}`}
              title="한국어"
            >
              🇰🇷
            </button>
          </div>
        </div>
      </div>

      {/* KHU VỰC HEADER CHÍNH (LOGO, TÌM KIẾM, TÀI KHOẢN, GIỎ HÀNG) */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4 md:gap-8">
        {/* LOGO THƯƠNG HIỆU */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0" onClick={() => onSelectCategory?.('')}>
          <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform shadow-inner">
            <span className="material-symbols-outlined text-xl">devices</span>
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-purple-950 font-['Space_Grotesk']">
            Zenith <span className="text-purple-600">Ztore</span>
          </span>
        </Link>

        {/* THANH TÌM KIẾM TRUNG TÂM */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden sm:block">
          <div className="relative flex items-center w-full h-11 bg-purple-50/60 hover:bg-purple-50 border border-purple-100/80 rounded-full px-4 transition-all focus-within:bg-white focus-within:border-purple-400 focus-within:shadow-md">
            <input
              type="text"
              placeholder="Bạn cần tìm sản phẩm gì?"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none focus-visible:ring-0 text-sm text-purple-950 placeholder-purple-400/80 pr-12"
            />
            <button type="submit" className="absolute right-1.5 w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-700 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </div>
        </form>

        {/* CÁC NÚT TÁC VỤ (GIỎ HÀNG / ĐĂNG NHẬP / AVATAR) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* GIỎ HÀNG - luôn hiển thị trên thanh header, bên trái avatar */}
          <Link to="/gio-hang" className="flex items-center gap-2 text-purple-950 hover:text-purple-600 transition-colors cursor-pointer group relative">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-100 transition-colors relative">
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold hidden md:block"></span>
          </Link>
          {user ? (
            /* AVATAR DROPDOWN KHI ĐÃ ĐĂNG NHẬP */
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all ring-2 ring-purple-200 ring-offset-1 overflow-hidden"
                title={user.email}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5000${user.avatarUrl}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.email?.[0]?.toUpperCase() || 'U'
                )}
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-purple-100 rounded-2xl shadow-2xl shadow-purple-900/10 z-50 overflow-hidden animate-fade-in">
                  {/* Header dropdown */}
                  <div className="px-4 py-3.5 bg-gradient-to-br from-purple-50 to-violet-50 border-b border-purple-100/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5000${user.avatarUrl}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.email?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-800 truncate">{user.name || user.email}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Tài khoản Zenith Store</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2 space-y-0.5">
                    {(user.role === 'admin' || user.role === 'nhanvien') && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-750 transition-colors group border-b border-purple-50 pb-2 mb-1"
                      >
                        <span className="material-symbols-outlined text-base text-purple-600 group-hover:scale-105 transition-transform">dashboard</span>
                        <span className="text-sm font-bold text-purple-700">Trang quản lý</span>
                      </Link>
                    )}

                    <Link
                      to="/trang-ca-nhan"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-purple-600">account_circle</span>
                      <span className="text-sm font-semibold">Trang cá nhân</span>
                    </Link>

                    <Link
                      to="/lich-su-don-hang"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-purple-600">receipt_long</span>
                      <span className="text-sm font-semibold">Lịch sử đơn hàng</span>
                    </Link>

                    <Link
                      to="/voucher"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-purple-600">confirmation_number</span>
                      <span className="text-sm font-semibold">Ví voucher</span>
                    </Link>

                    <Link
                      to="/thue-thiet-bi"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors group border-t border-purple-50/50 pt-2.5"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-purple-600">event_available</span>
                      <span className="text-sm font-semibold">Thuê thiết bị</span>
                    </Link>

                    <Link
                      to="/tu-van"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-purple-600">support_agent</span>
                      <span className="text-sm font-semibold">Dịch vụ tư vấn</span>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-100">
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); navigate('/login'); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span className="text-sm font-semibold">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* NÚT ĐĂNG NHẬP KHI CHƯA ĐĂNG NHẬP */
            <Link to="/login" className="flex items-center gap-2 text-purple-950 hover:text-purple-600 transition-colors group">
              <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-100 transition-colors">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
              <span className="text-sm font-semibold hidden md:block">Đăng nhập</span>
            </Link>
          )}


        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG DANH MUC (NAVIGATION TABS) */}
      <div
        style={{ transition: 'max-height 0.2s ease-in-out, opacity 0.15s ease-in-out' }}
        className={`overflow-hidden ${isNavVisible ? 'max-h-[50px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-none border-t border-purple-50/50 pt-1">
          {navTabs.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(cat.id);
                  }
                  if (!isHomePage) {
                    navigate('/');
                  }
                }}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${isActive
                  ? 'text-purple-700 font-bold'
                  : 'text-purple-950/70 hover:text-purple-950'
                  }`}
              >
                {cat.name}
                {/* ĐƯỜNG GẠCH CHÂN ĐÁNH DẤU TAB ĐANG HOẠT ĐỘNG */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full layout-id-tab-indicator" />
                )}
              </button>
            );
          })}

          {/* Link to Thuê thiết bị */}
          {/* <Link
            to="/thue-thiet-bi"
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${location.pathname === '/thue-thiet-bi'
              ? 'text-purple-700 font-bold'
              : 'text-purple-950/70 hover:text-purple-950'
              }`}
          >
            Thuê thiết bị
            {location.pathname === '/thue-thiet-bi' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full layout-id-tab-indicator" />
            )}
          </Link>

          {/* Link to Dịch vụ tư vấn */}
          {/* <Link
            to="/tu-van"
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${location.pathname === '/tu-van'
              ? 'text-purple-700 font-bold'
              : 'text-purple-950/70 hover:text-purple-950'
              }`}
          >
            Dịch vụ tư vấn
            {location.pathname === '/tu-van' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full layout-id-tab-indicator" />
            )}
          </Link> */}
        </div>
      </div>
    </header>
  );
}
