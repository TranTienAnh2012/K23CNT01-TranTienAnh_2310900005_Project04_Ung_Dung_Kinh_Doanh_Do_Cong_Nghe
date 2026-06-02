import React, { useState, useEffect } from 'react';
import { danhmucThuoctinhApi, danhmucApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaDanhMucThuocTinhList() {
  const isDark = useAdminTheme();
  const [mappings, setMappings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resM, resC] = await Promise.all([
        danhmucThuoctinhApi.getAll(),
        danhmucApi.getAll()
      ]);
      const cats = resC.data.data.items;
      setMappings(resM.data.data.items);
      setCategories(cats);
      if (cats.length > 0) setActiveCategory(cats[0].MaDanhMuc);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setCategories([]);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa liên kết này không?")) return;
    try {
      await danhmucThuoctinhApi.delete(id);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Xóa thất bại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMappings = mappings.filter(m => m.MaDanhMuc === activeCategory);

  if (loading) return <div className={`p-8 ${isDark ? 'text-slate-400' : 'text-slate-500'} font-['Inter']`}>Đang tải cấu hình danh mục...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] space-y-10`}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-2 font-['Space_Grotesk']">
            <span>Terminal</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span>Inventory</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="opacity-60">Category Config</span>
          </div>
          <h2 className={`font-['Space_Grotesk'] text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>Thiết lập Thuộc tính Danh mục</h2>
          <p className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-sm italic font-medium`}>Quản lý các bộ khung thông số mẫu cho từng loại sản phẩm chuyên biệt.</p>
        </div>
        <div className="flex gap-3">
          <button className={`px-6 py-3 border ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} rounded-xl font-bold text-xs transition-all flex items-center gap-2 active:scale-95`}>
            <span className="material-symbols-outlined text-sm">history</span>
            LỊCH SỬ
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            MẪU MỚI
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar: Category Selection */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md border rounded-3xl p-6 shadow-2xl`}>
            <h3 className={`font-['Space_Grotesk'] text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3`}>
              <span className="material-symbols-outlined text-blue-500">account_tree</span>
              Cấu trúc Danh mục
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div 
                  key={cat.MaDanhMuc} 
                  onClick={() => setActiveCategory(cat.MaDanhMuc)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                    activeCategory === cat.MaDanhMuc 
                    ? 'bg-blue-600/10 border-blue-600/30 text-blue-500 shadow-lg shadow-blue-600/5' 
                    : `${isDark ? 'text-slate-400 hover:bg-slate-800/50 border-transparent' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeCategory === cat.MaDanhMuc ? 'bg-blue-600 text-white' : `${isDark ? 'bg-slate-950' : 'bg-slate-100'}`
                  }`}>
                    <span className="material-symbols-outlined text-lg">{activeCategory === cat.MaDanhMuc ? 'folder_open' : 'folder'}</span>
                  </div>
                  <span className="flex-1 font-bold text-sm tracking-tight">{cat.TenDanhMuc}</span>
                  <span className="material-symbols-outlined text-sm opacity-40">{activeCategory === cat.MaDanhMuc ? 'expand_more' : 'chevron_right'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'} space-y-3`}>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-lg">lightbulb</span>
              Tips cấu hình
            </div>
            <p className="text-[11px] leading-relaxed italic font-medium">
              Cấu hình thuộc tính đồng nhất giúp khách hàng dễ dàng so sánh sản phẩm. Hãy đảm bảo các thuộc tính kỹ thuật quan trọng được đặt ở đầu danh sách.
            </p>
          </div>
        </div>

        {/* Main Content: Attributes List */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
            <div className={`px-8 py-6 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'} flex items-center justify-between`}>
              <div>
                <h3 className={`font-['Space_Grotesk'] text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Danh sách Thuộc tính</h3>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
                  Đang xem: <span className="text-blue-500 italic font-bold">"{categories.find(c => c.MaDanhMuc === activeCategory)?.TenDanhMuc}"</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${isDark ? 'bg-slate-950 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                  SL: {filteredMappings.length}
                </span>
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'} transition-colors`}>
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {/* Table Header */}
              <div className={`grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <div className="col-span-5">Thuộc tính / Mã ID</div>
                <div className="col-span-3 text-center">Kiểu dữ liệu</div>
                <div className="col-span-2 text-center">Bắt buộc</div>
                <div className="col-span-2 text-right">Quản lý</div>
              </div>

              {filteredMappings.map((attr) => (
                <div key={attr.Id} className={`grid grid-cols-12 gap-4 px-6 py-4 border rounded-2xl items-center group transition-all ${
                  isDark ? 'bg-slate-950/50 border-slate-800 hover:border-blue-500/50' : 'bg-slate-50/50 border-slate-200 hover:border-blue-400/50'
                }`}>
                  <div className="col-span-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-500 group-hover:text-blue-500' : 'bg-white border-slate-200 text-slate-400 group-hover:text-blue-600'
                    }`}>
                      <span className="material-symbols-outlined text-xl">{attr.Icon || 'label'}</span>
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{attr.TenThuocTinh}</div>
                      <div className="text-[10px] text-blue-500 font-mono italic font-bold">#{attr.MaThuocTinh || 'ATTR-ID'}</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                    }`}>{attr.KieuDuLieu || 'String'}</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${attr.Required ? 'bg-blue-600' : `${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${attr.Required ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <button 
                      onClick={() => handleDelete(attr.Id)}
                      className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-600 hover:text-rose-500 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Hint */}
              <div className={`flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-3xl transition-all cursor-pointer group ${
                isDark ? 'border-slate-800 text-slate-600 hover:bg-slate-900/50 hover:border-slate-600' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300'
              }`}>
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform mb-2">add_circle</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Thêm thuộc tính từ thư viện chung</span>
              </div>
            </div>

            <div className={`p-8 border-t ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'} flex justify-end gap-4`}>
              <button className={`px-8 py-3 rounded-xl font-bold text-xs transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>HỦY BỎ</button>
              <button className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-900/30 active:scale-95">LƯU THAY ĐỔI</button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md p-6 rounded-3xl border shadow-2xl relative overflow-hidden`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`material-symbols-outlined p-2 rounded-xl text-lg ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>check_circle</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Độ phủ dữ liệu</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} font-['Space_Grotesk']`}>--%</div>
              <div className={`mt-4 w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="bg-emerald-500 h-full w-[94%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"></div>
              </div>
            </div>
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md p-6 rounded-3xl border shadow-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`material-symbols-outlined p-2 rounded-xl text-lg ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>database</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SKU sử dụng</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} font-['Space_Grotesk']`}>0</div>
            </div>
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md p-6 rounded-3xl border shadow-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`material-symbols-outlined p-2 rounded-xl text-lg ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>warning</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Lỗi định dạng</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} font-['Space_Grotesk']`}>0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
