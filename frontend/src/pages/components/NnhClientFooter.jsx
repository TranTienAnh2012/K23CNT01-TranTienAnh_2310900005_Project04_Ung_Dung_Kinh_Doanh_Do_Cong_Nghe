import React from 'react';
import { Link } from 'react-router-dom';

export default function NnhClientFooter() {
  return (
    <footer className="border-t border-outline-variant/30 px-4 md:px-8 py-12 mt-8 bg-white w-full">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-5 text-secondary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-primary text-lg font-bold">Zenith Zhop</h2>
          </div>
          <p className="text-on-surface-variant text-sm mb-6">Nơi hội tụ của những đỉnh cao công nghệ toàn cầu.</p>
          <div className="flex gap-4">
            <div className="size-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary hover:text-white cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-base">share</span>
            </div>
            <div className="size-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary hover:text-white cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-base">language</span>
            </div>
            <div className="size-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary hover:text-white cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-base">alternate_email</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-primary mb-6">Sản phẩm</h4>
          <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <li><a className="hover:text-secondary" href="#">iPhone</a></li>
            <li><a className="hover:text-secondary" href="#">Samsung</a></li>
            <li><a className="hover:text-secondary" href="#">Google Pixel</a></li>
            <li><a className="hover:text-secondary" href="#">Phụ kiện Apple</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-primary mb-6">Hỗ trợ</h4>
          <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <li><a className="hover:text-secondary" href="#">Trung tâm trợ giúp</a></li>
            <li><a className="hover:text-secondary" href="#">Vận chuyển &amp; Giao hàng</a></li>
            <li><a className="hover:text-secondary" href="#">Chính sách bảo hành</a></li>
            <li><a className="hover:text-secondary" href="#">Liên hệ</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-primary mb-6">Liên hệ</h4>
          <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">call</span> +84 123 456 789
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">mail</span> support@zenithzhop.vn
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">location_on</span> BanhCuon, Thanh Tri, TP Ha Noi
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant">© 2026 Zenith Zhop. Mọi quyền được bảo lưu.</p>
        <div className="flex gap-6 text-xs text-on-surface-variant">
          <a className="hover:text-secondary" href="#">Điều khoản dịch vụ</a>
          <a className="hover:text-secondary" href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
}
