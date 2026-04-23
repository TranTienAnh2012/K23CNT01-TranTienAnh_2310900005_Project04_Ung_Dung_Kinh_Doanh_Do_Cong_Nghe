import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { giatrithuoctinhApi, sanphamApi } from '../../../api/tta_api';

export default function TtaGiaTriThuocTinhList() {
  const [values, setValues] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resValues, resProds] = await Promise.all([
        giatrithuoctinhApi.getAll(),
        sanphamApi.getAll()
      ]);
      setValues(resValues.data.data.items || []);
      setProducts(resProds.data.data.items || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu thật, dùng mock:", err);
      // Dùng dữ liệu trống để demo giao diện empty state đẹp mắt của bạn
      setValues([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-slate-400 font-['Inter']">Đang tải dữ liệu thuộc tính...</div>;

  return (
    <div className="p-8 max-w-[1280px] mx-auto font-['Inter'] bg-slate-950 min-h-[calc(100vh-64px)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <nav className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-['Space_Grotesk']">
            <span>INVENTORY</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-blue-500">ATTRIBUTES</span>
          </nav>
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tight">Quản lý Thuộc tính Sản phẩm</h1>
          <p className="text-slate-500 mt-2 max-w-xl text-sm italic">Cấu hình các tham số kỹ thuật và tùy chọn thuộc tính cho toàn bộ danh mục sản phẩm của Zenith Ztore.</p>
        </div>
        <div>
          <Link to="/admin/giatri-thuoctinh/them" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:translate-y-[-1px] transition-transform active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            THÊM THÔNG SỐ MỚI
          </Link>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SẢN PHẨM CÓ CẤU HÌNH</p>
            <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">1,284</h3>
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">THUỘC TÍNH ĐÃ NHẬP</p>
            <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">42</h3>
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">THIẾU THÔNG TIN</p>
            <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">15</h3>
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ĐỒNG BỘ LẦN CUỐI</p>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">02:45 PM</h3>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[500px] flex flex-col">
        {/* Filters Bar */}
        <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Lọc nhóm
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-sm">sort</span>
              Sắp xếp
            </button>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
              Hiển thị {values.length} của {values.length} thuộc tính
            </span>
          </div>
        </div>

        {/* Main Content */}
        {values.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-slate-700/50">schema</span>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="material-symbols-outlined text-blue-500">search_off</span>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk'] tracking-tight">Chưa có thuộc tính nào được cấu hình</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-10 text-sm italic font-medium leading-relaxed">
              Hệ thống hiện tại chưa ghi nhận thông số kỹ thuật nào. Bắt đầu bằng cách tạo các nhóm thuộc tính như "Màn hình", "Vi xử lý", hoặc "Pin".
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl w-64 text-left border border-dashed border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group hover:bg-blue-600/5">
                <span className="material-symbols-outlined text-blue-500 mb-4 group-hover:scale-110 transition-transform text-3xl">laptop_mac</span>
                <h4 className="font-bold text-white text-base mb-2">Nhóm Laptop/PC</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">CPU, RAM, GPU, SSD, Kích thước màn hình, Tần số quét...</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl w-64 text-left border border-dashed border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group hover:bg-cyan-600/5">
                <span className="material-symbols-outlined text-cyan-400 mb-4 group-hover:scale-110 transition-transform text-3xl">smartphone</span>
                <h4 className="font-bold text-white text-base mb-2">Nhóm Smartphone</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Chipset, Camera, Dung lượng pin, Sạc nhanh, Kháng nước...</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl w-64 text-left border border-dashed border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group hover:bg-purple-600/5">
                <span className="material-symbols-outlined text-purple-400 mb-4 group-hover:scale-110 transition-transform text-3xl">headphones</span>
                <h4 className="font-bold text-white text-base mb-2">Nhóm Phụ kiện</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Kết nối, Bluetooth, Chống ồn, Thời lượng pin, Màu sắc...</p>
              </div>
            </div>
            <div className="mt-12">
              <button className="text-blue-500 font-bold text-xs flex items-center gap-2 hover:underline transition-all">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                TỰ ĐỘNG KHỞI TẠO BỘ THUỘC TÍNH MẪU
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-6">
            {/* Nếu có dữ liệu sẽ render ở đây theo mẫu product specs đã thiết kế */}
            <p className="text-slate-500 italic text-sm">Đang hiển thị danh sách thông số cho {values.length} thuộc tính...</p>
          </div>
        )}
      </div>

      {/* Contextual Quick Actions */}
      <div className="mt-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-8 bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-full pointer-events-none">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwgmcGhYfLRYHrteBh_M-kjdL4ss_TT2bOnTWon0zMjmC-D3hFWVaDMx_edZ08JL0FI8Vr4HiE7-gQxklS3xF683bO0G25eTYKE-tPhcf0Ci_hBM9PVXf6uodw2xrMhGoOir_jcsb9zoeGW2eaCmYDup43BVoH8n2tvFCS2u8v-p8I1dTrltvJyyTAp4oiqxuwfbVSrVq7lJr0yrSd5HuvFIytbydW80FU_TcAXYCCPOgn15UYq0-5MQidEfSHJrmGopjwmNCIlQ" alt="Server Hardware" className="h-full w-full object-cover opacity-10 [mask-image:linear-gradient(to_left,black,transparent)]" />
          </div>
          <div className="relative z-10">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-6">Hướng dẫn quản lý thuộc tính</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">1</div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Xác định các nhóm sản phẩm</p>
                  <p className="text-xs text-slate-500 mt-1">Xác định các nhóm sản phẩm có chung đặc tính kỹ thuật cơ bản.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">2</div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Tạo các "Key" thuộc tính</p>
                  <p className="text-xs text-slate-500 mt-1">Tạo các thông số (ví dụ: Dung lượng pin) và định dạng giá trị (Số, Văn bản, Lựa chọn).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">3</div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Gán thuộc tính vào danh mục</p>
                  <p className="text-xs text-slate-500 mt-1">Gán các thuộc tính này vào danh mục tương ứng để hiển thị trên Storefront.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">Báo cáo hệ thống</h3>
            <p className="text-xs text-slate-500 font-medium italic">Trạng thái cơ sở dữ liệu thuộc tính hiện tại.</p>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[0%] transition-all duration-1000"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">HOÀN THÀNH CẤU HÌNH</span>
              <span className="text-blue-500 font-mono">0%</span>
            </div>
          </div>
          <button className="mt-10 w-full border border-slate-700 py-3.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-95">
            XEM CHI TIẾT LỖI
          </button>
        </div>
      </div>
    </div>
  );
}

