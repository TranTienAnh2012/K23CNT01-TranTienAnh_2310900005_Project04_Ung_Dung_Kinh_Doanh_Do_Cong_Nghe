import React from 'react';

export default function NnhClientBanners({ banners = [], selectedCategory = '', setSelectedCategory }) {
  // Hàm hỗ trợ chuẩn hóa URL ảnh từ Backend
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Lọc banner theo danh mục được chọn
  // Nếu đang chọn danh mục: lấy banner có TenDanhMuc tương ứng hoặc liên kết với danh mục đó
  // Nếu ở trang chủ (không chọn danh mục): lấy banner dùng chung (MaDanhMuc là null hoặc rỗng)
  const currentBanners = banners.filter((b) => {
    if (selectedCategory) {
      return b.TenDanhMuc?.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    return !b.MaDanhMuc; // Banner toàn cục mặc định
  });

  // Khởi tạo các vị trí banner
  let mainBanner = null;
  let subBanner1 = null;
  let subBanner2 = null;

  if (currentBanners.length > 0) {
    // 1. Phân bổ theo G5_ViTri (1: chính trái, 2: phụ trên phải, 3: phụ dưới phải)
    mainBanner = currentBanners.find(b => b.ViTri === 1) || null;
    subBanner1 = currentBanners.find(b => b.ViTri === 2) || null;
    subBanner2 = currentBanners.find(b => b.ViTri === 3) || null;

    // 2. Tự động gán các banner không chỉ định vị trí vào các chỗ trống theo thứ tự index
    const unassigned = currentBanners.filter(b => b.ViTri !== 1 && b.ViTri !== 2 && b.ViTri !== 3);
    let uIdx = 0;
    
    if (!mainBanner && unassigned[uIdx]) {
      mainBanner = unassigned[uIdx++];
    }
    if (!subBanner1 && unassigned[uIdx]) {
      subBanner1 = unassigned[uIdx++];
    }
    if (!subBanner2 && unassigned[uIdx]) {
      subBanner2 = unassigned[uIdx++];
    }
  }

  // Helper check xem tiêu đề có hợp lệ để hiển thị text overlay hay không
  const hasValidText = (bannerObj) => {
    if (!bannerObj) return false;
    const title = bannerObj.TieuDe;
    return title && title.trim() !== '' && title.trim() !== '(Không tiêu đề)';
  };

  // Helper render nút "Mua ngay" hoặc LinkRedirect
  const renderBannerContent = (bannerObj, isMain = false) => {
    const hasText = hasValidText(bannerObj);
    const redirectUrl = bannerObj.LinkRedirect && bannerObj.LinkRedirect.trim() !== '' ? bannerObj.LinkRedirect : '#';

    return (
      <div className="absolute inset-0 w-full h-full p-8 md:p-12 flex flex-col justify-between z-20">
        {/* Lớp phủ mờ bảo vệ chữ chỉ khi có text hiển thị */}
        {hasText && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent -z-10 rounded-3xl" />
        )}
        
        {/* Phần thông tin chữ */}
        {hasText ? (
          <div className="max-w-sm space-y-3.5">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/10">
              {selectedCategory ? `Danh mục: ${selectedCategory}` : 'Siêu phẩm'}
            </span>
            <h1 className={`${isMain ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'} font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk'] line-clamp-2`}>
              {bannerObj.TieuDe}
            </h1>
            {bannerObj.MoTa && bannerObj.MoTa !== '(Không mô tả)' && (
              <p className="text-white/90 text-sm md:text-base font-medium line-clamp-2">
                {bannerObj.MoTa}
              </p>
            )}
          </div>
        ) : (
          <div /> // Giữ khoảng trống ở trên để đẩy nút xuống dưới
        )}

        {/* Nút hành động */}
        <div className="mt-auto">
          {bannerObj.LinkRedirect ? (
            <a 
              href={redirectUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-md text-xs md:text-sm"
            >
              Mua ngay
            </a>
          ) : (
            <button 
              onClick={() => {
                if (bannerObj.TenDanhMuc && setSelectedCategory) {
                  setSelectedCategory(bannerObj.TenDanhMuc);
                }
              }}
              className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-md text-xs md:text-sm"
            >
              Mua ngay
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render phần giao diện
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. BANNER CHÍNH BÊN TRÁI */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-950 shadow-xl min-h-[380px] group transition-all duration-300">
        {mainBanner ? (
          <>
            {/* Ảnh nền phủ toàn bộ container */}
            <img
              src={getImageUrl(mainBanner.UrlAnh)}
              alt={mainBanner.TieuDe || 'Banner chính'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {renderBannerContent(mainBanner, true)}
          </>
        ) : (
          // Fallback mặc định hoàn hảo nếu không có banner chính
          <>
            <img
              src={
                selectedCategory === 'Laptop'
                  ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'
                  : selectedCategory === 'Tai nghe'
                  ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'
                  : selectedCategory === 'Đồng hồ'
                  ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop'
              }
              alt="Default main banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent z-10" />
            <div className="absolute inset-0 w-full h-full p-8 md:p-12 flex flex-col justify-between z-20">
              <div className="max-w-sm space-y-4">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/10">
                  {selectedCategory ? `Danh mục: ${selectedCategory}` : 'Siêu phẩm ra mắt'}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk']">
                  {selectedCategory ? `Ưu đãi ${selectedCategory}` : 'iPhone 15 Pro Max'}
                </h1>
                <p className="text-white/90 text-base md:text-lg font-medium">
                  {selectedCategory ? 'Khám phá trọn bộ sưu tập cao cấp với giá ưu đãi.' : 'Titan. Mạnh mẽ. Đột phá.'}
                </p>
                {!selectedCategory && (
                  <div className="pt-2">
                    <p className="text-white/85 text-xs">Giá ưu đãi từ</p>
                    <p className="text-white text-2xl font-bold font-['Space_Grotesk']">28.990.000đ</p>
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => setSelectedCategory?.(selectedCategory || 'Điện thoại')}
                  className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-md text-sm"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. CÁC BANNER PHỤ XẾP DỌC BÊN PHẢI */}
      <div className="flex flex-col gap-6 justify-between min-h-[380px]">
        {/* BANNER PHỤ 1 (GÓC TRÊN BÊN PHẢI) */}
        <div className="flex-1 relative overflow-hidden rounded-3xl bg-slate-950 shadow-md group transition-all duration-300 min-h-[178px]">
          {subBanner1 ? (
            <>
              <img
                src={getImageUrl(subBanner1.UrlAnh)}
                alt={subBanner1.TieuDe || 'Banner phụ 1'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {renderBannerContent(subBanner1, false)}
            </>
          ) : (
            // Fallback AirPods Pro 2
            <>
              <img
                src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop"
                alt="AirPods Pro 2"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent z-10" />
              <div className="absolute inset-0 w-full h-full p-6 md:p-8 flex flex-col justify-between z-20">
                <div className="max-w-[180px] space-y-2">
                  <h3 className="font-bold text-white text-lg leading-tight font-['Space_Grotesk']">
                    AirPods Pro 2
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-purple-600 text-white font-bold text-xs rounded-md">
                    Giảm 15%
                  </span>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedCategory?.('Tai nghe')}
                    className="px-6 py-2 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-md text-xs"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* BANNER PHỤ 2 (GÓC DƯỚI BÊN PHẢI) */}
        <div className="flex-1 relative overflow-hidden rounded-3xl bg-slate-950 shadow-md group transition-all duration-300 min-h-[178px]">
          {subBanner2 ? (
            <>
              <img
                src={getImageUrl(subBanner2.UrlAnh)}
                alt={subBanner2.TieuDe || 'Banner phụ 2'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {renderBannerContent(subBanner2, false)}
            </>
          ) : (
            // Fallback Apple Watch Series 9
            <>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
                alt="Apple Watch"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent z-10" />
              <div className="absolute inset-0 w-full h-full p-6 md:p-8 flex flex-col justify-between z-20">
                <div className="max-w-[180px] space-y-2">
                  <h3 className="font-bold text-white text-lg leading-tight font-['Space_Grotesk']">
                    Apple Watch Series 9
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-xs rounded-md">
                    Giảm 10%
                  </span>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedCategory?.('Đồng hồ')}
                    className="px-6 py-2 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-md text-xs"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
