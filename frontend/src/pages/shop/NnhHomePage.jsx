import React from 'react';
import { Link } from 'react-router-dom';

export default function TtaHomePage() {
  return (
    <div className="@container">
      <div className="@[480px]:p-4">
        <div className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-6 pb-12 @[480px]:px-12 relative overflow-hidden group shadow-xl" style={{ backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKKmYaGc_q-D6PJ3F-73XzUCijIt_2uK8XuzsKJ5xYuenTReQrUAVDcJrNe1xLLjcAkspnsEBYMoH-BosaVof5NjGJK3Xi5WaJI2CYi7Xn3QGv26mF1S7cdwdCHi2Ur0e9noT3c6PLcxHpt_mzl66zyP-1F7BP13KQHSN0qDRAhyWs37QadGUxZmObnteoWb_urWw5mrm88-6MLHK1aiD2ZNo7348ndzLHogSYZGbETEDcvXStIM8qhWiWaxOPu_9hKBCGMj58WA")' }}>
          <div className="flex flex-col gap-4 text-left max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-md px-3 py-1 rounded-full border border-secondary/30 w-fit">
              <span className="size-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-secondary text-xs font-bold uppercase tracking-widest">Sản phẩm mới nhất</span>
            </div>
            <h1 className="text-white text-4xl font-bold leading-tight tracking-[-0.033em] @[480px]:text-6xl font-headline-xl">
                iPhone 15 Pro Titanium
            </h1>
            <p className="text-gray-300 text-base font-normal leading-relaxed @[480px]:text-lg font-body-lg">
                Sức mạnh của chip A17 Pro. Thiết kế Titan siêu bền và nhẹ. Trải nghiệm đỉnh cao công nghệ tương lai ngay hôm nay.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-secondary text-white text-base font-bold leading-normal tracking-[0.015em] hover:scale-105 transition-transform">
                <span className="truncate">Khám phá ngay</span>
              </button>
              <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
                <span className="truncate">Xem cấu hình</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
