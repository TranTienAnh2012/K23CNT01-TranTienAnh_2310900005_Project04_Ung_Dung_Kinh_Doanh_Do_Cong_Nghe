import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
            
            {/* Shared TopNavBar Start */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaecf1] px-4 md:px-10 py-3 bg-white rounded-t-xl">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-4 text-[#111318]">
                  <div className="size-6 text-secondary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em]">Zenith Zhop</h2>
                </Link>
                <div className="hidden md:flex items-center gap-9">
                  <a className="text-[#111318] text-sm font-medium leading-normal hover:text-secondary transition-colors" href="#">Sản phẩm</a>
                  <a className="text-[#111318] text-sm font-medium leading-normal hover:text-secondary transition-colors" href="#">Khuyến mãi</a>
                  <a className="text-[#111318] text-sm font-medium leading-normal hover:text-secondary transition-colors" href="#">Tin tức</a>
                  <a className="text-[#111318] text-sm font-medium leading-normal hover:text-secondary transition-colors" href="#">Hỗ trợ</a>
                </div>
              </div>
              <div className="flex flex-1 justify-end gap-4 md:gap-8">
                <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm">
                    <div className="text-[#5d6a89] flex border-none bg-[#eaecf1] items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-secondary/20 border-none bg-[#eaecf1] h-full placeholder:text-[#5d6a89] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Tìm kiếm sản phẩm..." value="" readOnly/>
                  </div>
                </label>
                <div className="flex gap-2">
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#eaecf1] text-[#111318] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                  <Link to="/login" className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#eaecf1] text-[#111318] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">person</span>
                  </Link>
                </div>
              </div>
            </header>

            <main className="mt-8">
              <Outlet />
            </main>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
