import React from 'react';
import NnhClientHeader from '../components/NnhClientHeader';
import NnhClientFooter from '../components/NnhClientFooter';

export default function NnhClientHome() {
  return (
    <>
      <NnhClientHeader />
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5 bg-gray-50">
        <div className="layout-content-container flex flex-col max-w-[1280px] flex-1 w-full">
          <div className="bg-surface text-on-surface min-h-screen font-body-md">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary-container text-on-primary-container py-20 px-6 sm:px-12 lg:px-24 rounded-3xl shadow-xl">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-md px-4 py-2 rounded-full border border-secondary/30">
              <span className="size-2 rounded-full bg-secondary animate-ping"></span>
              <span className="text-secondary text-sm font-label-sm uppercase tracking-widest">
                Sản phẩm nổi bật 2026
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-headline-xl font-bold text-on-primary-fixed leading-tight">
              Khám Phá Công Nghệ <span className="text-secondary">Đỉnh Cao</span>
            </h1>
            
            <p className="text-lg md:text-xl font-body-lg text-on-surface-variant max-w-2xl">
              Trải nghiệm các sản phẩm công nghệ thế hệ mới với hiệu năng vượt trội, thiết kế sang trọng và tính năng đột phá. Đưa bạn đến với thế giới của tương lai.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="h-14 px-8 rounded-full bg-primary text-on-primary font-bold text-lg hover:bg-on-surface transition-colors shadow-lg shadow-primary/30">
                Mua ngay
              </button>
              <button className="h-14 px-8 rounded-full bg-surface text-primary border border-outline-variant font-bold text-lg hover:bg-surface-variant transition-colors">
                Xem chi tiết
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative z-10 w-full flex justify-center">
             <div className="absolute inset-0 bg-gradient-to-r from-primary-fixed to-secondary-fixed rounded-full blur-3xl opacity-50 animate-pulse"></div>
             <img 
               src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop" 
               alt="Technology Device" 
               className="relative z-20 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/10 transform hover:scale-105 transition-transform duration-500 object-cover aspect-square"
             />
          </div>
          
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-background">Tại sao chọn Zenith Zhop?</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md text-lg">
              Chúng tôi mang đến cho bạn những giá trị tốt nhất với cam kết chất lượng tuyệt đối.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-left space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-headline-md font-bold text-on-surface">Chính hãng 100%</h3>
              <p className="text-on-surface-variant font-body-md">Sản phẩm được nhập khẩu trực tiếp từ các thương hiệu hàng đầu thế giới.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-left space-y-4">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <h3 className="text-xl font-headline-md font-bold text-on-surface">Giao hàng tốc hành</h3>
              <p className="text-on-surface-variant font-body-md">Giao hàng miễn phí toàn quốc trong vòng 24h đối với khách hàng VIP.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-left space-y-4">
              <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">support_agent</span>
              </div>
              <h3 className="text-xl font-headline-md font-bold text-on-surface">Hỗ trợ 24/7</h3>
              <p className="text-on-surface-variant font-body-md">Đội ngũ chuyên gia luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào.</p>
            </div>
          </div>
        </div>
      </section>
          </div>
        </div>
      </div>
      <NnhClientFooter />
    </>
  );
}
