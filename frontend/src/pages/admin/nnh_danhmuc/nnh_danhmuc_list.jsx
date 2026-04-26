import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { danhmucApi } from '../../../api/tta_api';

export default function TtaDanhMucList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await danhmucApi.getAll();
      setCategories(res.data.data.items);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Đang tải danh mục...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-slate-950 font-['Inter'] flex flex-col">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white mb-2">Quản Lý Danh Mục</h2>
            <p className="text-slate-400 font-['Inter'] max-w-2xl">Tổ chức và phân cấp sản phẩm một cách chính xác. Cấu trúc danh mục cấp cao cho toàn bộ hệ thống Zenith Ztore.</p>
          </div>
          <Link to="/admin/danh-muc/them" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm Danh Mục Mới
          </Link>
        </div>

        {/* Stats/Bento Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tổng Danh Mục</span>
              <span className="material-symbols-outlined text-blue-500">category</span>
            </div>
            <div className="text-4xl font-['Space_Grotesk'] font-bold text-white">{categories.length}</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Đồng Bộ Dữ Liệu</span>
              <span className="material-symbols-outlined text-emerald-400">sync</span>
            </div>
            <div className="text-4xl font-['Space_Grotesk'] font-bold text-white">100%</div>
          </div>
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-900/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-white mb-1">Tối Ưu Hóa Hệ Thống</h4>
              <p className="text-xs text-blue-200/70 mb-4">Lập chỉ mục cơ sở dữ liệu đang chạy ở hiệu suất tối đa cho 4.2k mục.</p>
              <div className="w-full bg-slate-950/50 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 w-3/4 h-full rounded-full"></div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <span className="material-symbols-outlined text-[120px]">terminal</span>
            </div>
          </div>
        </div>

        {/* Category Table Card */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">list_alt</span>
              Cây Danh Mục
            </h3>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">Xuất CSV</button>
              <button className="px-3 py-2 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors flex items-center">
                <span className="material-symbols-outlined text-lg">filter_list</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Tên Danh Mục</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Mô Tả</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Hoạt Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {categories.map((dm) => (
                  <tr key={dm.MaDanhMuc} className="hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">#{dm.MaDanhMuc}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                          <span className="material-symbols-outlined text-blue-500">folder_open</span>
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{dm.TenDanhMuc}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Mã code: CAT-{dm.MaDanhMuc.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-400 max-w-sm">{dm.MoTa || '(Chưa có mô tả)'}</p>
                      {dm.ProductCount && (
                         <div className="mt-2 text-xs text-slate-500">
                           <span className="text-emerald-400 font-bold">{dm.ProductCount}</span> sản phẩm liên kết
                         </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/danh-muc/edit/${dm.MaDanhMuc}`} className="p-2 bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-500 rounded-lg transition-all" title="Sửa">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <Link to={`/admin/danh-muc/delete/${dm.MaDanhMuc}`} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-lg transition-all" title="Xóa">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
            <p className="text-xs text-slate-500 font-medium">Hiển thị toàn bộ {categories.length} danh mục</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-900/20">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 text-xs font-bold transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Contextual Insight Footer */}
        <div className="mt-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4 backdrop-blur-md">
          <span className="material-symbols-outlined text-blue-500">info</span>
          <div>
            <h5 className="text-sm font-bold text-white mb-1">Mẹo Quản Trị</h5>
            <p className="text-sm text-slate-400 leading-relaxed">Sự thay đổi tên danh mục sẽ ảnh hưởng toàn cầu tới các sản phẩm liên kết. Hành động này được lập chỉ mục mỗi 15 phút để tối ưu SEO. Việc "Xóa" danh mục có thể cần cấu hình lại các sản phẩm mồ côi (không có danh mục).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
