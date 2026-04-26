import React, { useState, useEffect } from 'react';
import { danhmucThuoctinhApi, danhmucApi } from '../../../api/tta_api';

export default function TtaDanhMucThuocTinhList() {
  const [mappings, setMappings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resM, resC] = await Promise.all([
        danhmucThuoctinhApi.getAll(),
        danhmucApi.getAll()
      ]);
      setMappings(resM.data.data.items);
      setCategories(resC.data.data.items);
    } catch (err) {
      console.error("Lỗi kết nối CSDL, dùng dữ liệu giả:", err);
      setCategories([]);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [activeCategory, setActiveCategory] = useState(1);

  const filteredMappings = mappings.filter(m => m.MaDanhMuc === activeCategory);

  if (loading) return <div className="p-8 text-slate-400 font-['Inter']">Đang tải cấu hình danh mục...</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto font-['Inter'] bg-slate-950 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 font-['Space_Grotesk']">
            <span>Terminal</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>Inventory</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-blue-400">Category Config</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tight">Thiết lập Thuộc tính Danh mục</h2>
          <p className="text-slate-500 text-sm italic">Quản lý các bộ khung thông số mẫu cho từng loại sản phẩm chuyên biệt.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-transparent border border-slate-700 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">history</span>
            LỊCH SỬ THAY ĐỔI
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 hover:translate-y-[-1px] transition-all flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            THIẾT LẬP MẪU MỚI
          </button>
        </div>
      </div>

      {/* Bento Layout Configuration */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar: Category Selection */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">account_tree</span>
              Cấu trúc Danh mục
            </h3>
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
              <input className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:ring-1 focus:ring-blue-600 outline-none transition-all" placeholder="Tìm nhanh danh mục..." type="text"/>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                    activeCategory === cat.id 
                    ? 'bg-blue-600/10 border-blue-600/50 text-blue-400 shadow-lg shadow-blue-600/5' 
                    : 'text-slate-400 hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined">{activeCategory === cat.id ? 'folder_open' : 'folder'}</span>
                  <span className="flex-1 font-bold text-sm tracking-tight">{cat.ten_danh_muc}</span>
                  <span className="material-symbols-outlined text-sm">{activeCategory === cat.id ? 'expand_more' : 'chevron_right'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-blue-400">info</span>
              <span className="font-bold text-slate-200 text-sm">Tips cấu hình</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              Cấu hình thuộc tính đồng nhất giúp khách hàng dễ dàng so sánh sản phẩm. Hãy đảm bảo các thuộc tính kỹ thuật quan trọng được đặt ở đầu danh sách.
            </p>
          </div>
        </div>

        {/* Main Section: Attributes List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Danh sách Thuộc tính</h3>
                <p className="text-xs text-slate-500 font-medium">Gán cho: <span className="text-blue-400 italic">"{categories.find(c => c.id === activeCategory)?.ten_danh_muc}"</span></p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SL: {filteredMappings.length}</span>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                <div className="col-span-5">Thuộc tính / Mã</div>
                <div className="col-span-3 text-center">Kiểu dữ liệu</div>
                <div className="col-span-2 text-center">Bắt buộc</div>
                <div className="col-span-2 text-right">Thao tác</div>
              </div>

              {filteredMappings.map((attr) => (
                <div key={attr.Id} className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl items-center group hover:border-blue-600/30 transition-all">
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors border border-white/5">
                      <span className="material-symbols-outlined">{attr.Icon || 'label'}</span>
                    </div>
                    <div>
                      <div className="text-slate-100 font-bold text-sm">{attr.TenThuocTinh}</div>
                      <div className="text-[10px] text-slate-500 font-mono italic">{attr.MaThuocTinh}</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-[10px] font-bold border border-slate-800">{attr.KieuDuLieu}</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className={`w-9 h-5 rounded-full relative transition-colors ${attr.Required ? 'bg-blue-600' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${attr.Required ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Hint */}
              <div className="grid grid-cols-12 gap-4 px-6 py-8 border-2 border-dashed border-slate-800 rounded-2xl items-center justify-center text-slate-600 hover:bg-slate-900/50 hover:border-slate-600 transition-all cursor-pointer group">
                <div className="col-span-12 flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">add_circle</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Thêm thuộc tính từ thư viện chung</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-950/40 border-t border-slate-800 flex justify-end gap-4">
              <button className="px-8 py-2.5 text-slate-500 font-bold text-xs hover:text-white transition-colors">HỦY BỎ</button>
              <button className="px-10 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-950/50 active:scale-95">LƯU CẤU HÌNH</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-emerald-400 bg-emerald-400/10 p-2 rounded-lg text-sm">check_circle</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Độ phủ dữ liệu</span>
              </div>
              <div className="text-2xl font-bold text-white font-['Space_Grotesk']">--%</div>
              <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[94%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-blue-400 bg-blue-400/10 p-2 rounded-lg text-sm">database</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tổng SKU sử dụng</span>
              </div>
              <div className="text-2xl font-bold text-white font-['Space_Grotesk']">0</div>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-amber-400 bg-amber-400/10 p-2 rounded-lg text-sm">warning</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Lỗi định dạng</span>
              </div>
              <div className="text-2xl font-bold text-white font-['Space_Grotesk']">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
