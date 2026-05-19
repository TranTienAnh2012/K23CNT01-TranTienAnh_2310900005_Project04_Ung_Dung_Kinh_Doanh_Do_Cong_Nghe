import React from 'react';

export default function NnhClientBanners({ banners = [] }) {
  // Hàm hỗ trợ chuẩn hóa URL ảnh từ Backend
  const getImageUrl = (path) => {
    if (!path) return '/banner-iphone.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Lọc banner toàn cục (không liên kết danh mục)
  const currentBanners = banners.filter((b) => !b.MaDanhMuc);

  // Nếu trong DB có banner, sử dụng dữ liệu động
  if (currentBanners.length > 0) {
    const mainBanner = currentBanners[0];
    const subBanner1 = currentBanners[1] || null;
    const subBanner2 = currentBanners[2] || null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* BANNER CHÍNH - ẢNH FULL BACKGROUND */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl shadow-xl min-h-[380px] group cursor-pointer">
          <img
            src={getImageUrl(mainBanner.UrlAnh)}
            alt={mainBanner.TieuDe || 'Banner'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
            <span className="inline-block w-fit px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/20 mb-3">
              Siêu phẩm nổi bật
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk'] line-clamp-2 mb-2 drop-shadow-lg">
              {mainBanner.TieuDe || 'Khuyến mãi đặc biệt'}
            </h1>
            <p className="text-white/85 text-sm md:text-base font-medium line-clamp-2 mb-4 max-w-md">
              {mainBanner.MoTa || 'Trải nghiệm đỉnh cao công nghệ với mức giá vô cùng hấp dẫn.'}
            </p>
            <div>
              <button className="px-7 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-purple-50 hover:scale-105 transition-all shadow-lg text-sm">
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>

        {/* CÁC BANNER PHỤ */}
        <div className="flex flex-col gap-4 justify-between">
          {subBanner1 && (
            <div className="flex-1 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[180px]">
              <img
                src={getImageUrl(subBanner1.UrlAnh)}
                alt={subBanner1.TieuDe || 'Promotion'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-5">
                <h3 className="font-bold text-white text-base leading-tight font-['Space_Grotesk'] line-clamp-1 drop-shadow">
                  {subBanner1.TieuDe || 'Ưu đãi cực hot'}
                </h3>
                <span className="inline-block w-fit mt-1.5 px-2.5 py-0.5 bg-purple-600 text-white font-bold text-xs rounded-md">
                  {subBanner1.MoTa || 'Giá siêu ưu đãi'}
                </span>
              </div>
            </div>
          )}

          {subBanner2 ? (
            <div className="flex-1 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[180px]">
              <img
                src={getImageUrl(subBanner2.UrlAnh)}
                alt={subBanner2.TieuDe || 'Promotion'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-5">
                <h3 className="font-bold text-white text-base leading-tight font-['Space_Grotesk'] line-clamp-1 drop-shadow">
                  {subBanner2.TieuDe || 'Sản phẩm mới'}
                </h3>
                <span className="inline-block w-fit mt-1.5 px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-xs rounded-md">
                  {subBanner2.MoTa || 'Khám phá ngay'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-dashed border-purple-200 flex flex-col items-center justify-center p-4 text-center">
              <span className="material-symbols-outlined text-purple-400 text-3xl mb-1">loyalty</span>
              <p className="text-xs text-purple-900 font-medium">Nhiều ưu đãi hấp dẫn khác đang chờ đón bạn</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // FALLBACK: Banner mặc định - KHÔNG LIÊN KẾT DANH MỤC
  // Chỉ hiển thị tĩnh, sau này sẽ link nút Mua tới sản phẩm
  // =====================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* BANNER CHÍNH - iPhone vàng cam FULL BACKGROUND */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl shadow-xl min-h-[380px] group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop"
          alt="iPhone Pro Max"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/75 via-amber-800/40 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
          <span className="inline-block w-fit px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/20 mb-3">
            Siêu phẩm ra mắt
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk'] mb-2 drop-shadow-lg">
            iPhone 15 Pro Max
          </h1>
          <p className="text-white/90 text-base md:text-lg font-medium mb-1">
            Titan. Mạnh mẽ. Đột phá.
          </p>
          <div className="mb-4">
            <span className="text-white/70 text-xs">Giá ưu đãi từ</span>
            <p className="text-white text-2xl font-bold font-['Space_Grotesk']">28.990.000đ</p>
          </div>
          <div>
            <button className="px-8 py-3 rounded-full bg-white text-amber-800 font-bold hover:bg-amber-50 hover:scale-105 transition-all shadow-lg text-sm">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* CÁC BANNER KHUYẾN MÃI XẾP DỌC BÊN PHẢI */}
      <div className="flex flex-col gap-4 justify-between">
        {/* BANNER PHỤ TRÊN - AirPods */}
        <div className="flex-1 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[180px]">
          <img
            src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop"
            alt="AirPods Pro 2"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-800/30 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-5">
            <h3 className="font-bold text-white text-lg leading-tight font-['Space_Grotesk'] drop-shadow-md">
              AirPods Pro 2
            </h3>
            <span className="inline-block w-fit mt-1.5 px-2.5 py-0.5 bg-purple-600 text-white font-bold text-xs rounded-md shadow">
              Giảm 15%
            </span>
            <button className="mt-2.5 w-fit px-4 py-1.5 rounded-full bg-white/90 text-slate-800 font-semibold text-xs hover:bg-white transition-colors shadow">
              Mua ngay
            </button>
          </div>
        </div>

        {/* BANNER PHỤ DƯỚI - Apple Watch */}
        <div className="flex-1 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[180px]">
          <img
            src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop"
            alt="Apple Watch Series 9"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-5">
            <h3 className="font-bold text-white text-lg leading-tight font-['Space_Grotesk'] drop-shadow-md">
              Apple Watch Series 9
            </h3>
            <span className="inline-block w-fit mt-1.5 px-2.5 py-0.5 bg-blue-600 text-white font-bold text-xs rounded-md shadow">
              Giảm 10%
            </span>
            <button className="mt-2.5 w-fit px-4 py-1.5 rounded-full bg-white/90 text-slate-800 font-semibold text-xs hover:bg-white transition-colors shadow">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
