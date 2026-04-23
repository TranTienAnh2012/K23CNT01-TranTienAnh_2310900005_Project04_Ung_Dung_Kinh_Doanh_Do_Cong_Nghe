import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { thuoctinhApi } from '../../../api/tta_api';

export default function TtaThuocTinhList() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await thuoctinhApi.getAll();
      setAttributes(res.data.data.items);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu thật, dùng mock:", err);
      // Dữ liệu giả lập cho Thuộc tính
      setAttributes([
        { ThuocTinhID: 'ATT-001', TenThuocTinh: 'Color', Icon: 'palette', Color: 'text-blue-400', Bg: 'bg-blue-500/10' },
        { ThuocTinhID: 'ATT-002', TenThuocTinh: 'Storage', Icon: 'memory', Color: 'text-purple-400', Bg: 'bg-purple-500/10' },
        { ThuocTinhID: 'ATT-003', TenThuocTinh: 'Screen Size', Icon: 'aspect_ratio', Color: 'text-cyan-400', Bg: 'bg-cyan-500/10' },
        { ThuocTinhID: 'ATT-004', TenThuocTinh: 'Weight', Icon: 'weight', Color: 'text-emerald-400', Bg: 'bg-emerald-500/10' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Đang tải danh sách thuộc tính...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 font-['Inter']">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
          <nav className="flex text-[10px] text-slate-500 mb-2 uppercase tracking-widest gap-2 font-bold font-['Space_Grotesk']">
            <span>Terminal</span>
            <span>/</span>
            <span>Inventory</span>
            <span>/</span>
            <span className="text-blue-400">Attributes</span>
          </nav>
          <h2 className="text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">Quản lý Thuộc tính</h2>
          <p className="text-slate-400 text-sm mt-1">Định nghĩa các tham số kỹ thuật dùng chung cho toàn bộ kho hàng.</p>
        </div>
        <Link to="/admin/thuoc-tinh/them" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:translate-y-[-2px] transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <span className="material-symbols-outlined text-base">add</span>
          THÊM THUỘC TÍNH MỚI
        </Link>
      </div>

      {/* Management Table Container */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-32">Mã ID</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">TÊN THUỘC TÍNH</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {attributes.map((tt) => (
              <tr key={tt.ThuocTinhID} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-8 py-5 font-mono text-blue-400/80 text-sm font-bold">#{tt.ThuocTinhID}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${tt.Bg || 'bg-slate-800'} flex items-center justify-center ${tt.Color || 'text-slate-400'}`}>
                      <span className="material-symbols-outlined text-xl">{tt.Icon || 'label'}</span>
                    </div>
                    <span className="font-bold text-slate-100 text-sm">{tt.TenThuocTinh}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
                    <Link to={`/admin/thuoc-tinh/edit/${tt.ThuocTinhID}`} className="p-2 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </Link>
                    <Link to={`/admin/thuoc-tinh/delete/${tt.ThuocTinhID}`} className="p-2 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-8 py-5 flex items-center justify-between bg-slate-950/20 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-medium">Hiển thị {attributes.length} trên tổng số 24 thuộc tính</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-slate-600 hover:text-white disabled:opacity-30" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/20">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 text-xs font-medium transition-colors">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 text-xs font-medium transition-colors">3</button>
            <button className="p-1.5 text-slate-500 hover:text-white">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng biến thể</p>
          <p className="font-['Space_Grotesk'] text-2xl font-bold text-white">1,482</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Dùng nhiều nhất</p>
          <p className="font-['Space_Grotesk'] text-2xl font-bold text-white">Dung lượng</p>
          <div className="mt-4 flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold">64GB</div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold">128G</div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold">256G</div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cấu hình Global</p>
          <p className="font-['Space_Grotesk'] text-2xl font-bold text-white">08</p>
          <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sức khỏe hệ thống</p>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-emerald-400">OPTIMAL</p>
            <p className="mt-4 text-[10px] text-slate-500 font-mono tracking-tighter italic">Đang đồng bộ với AWS Lambda...</p>
          </div>
        </div>
      </div>

      {/* Dynamic Background Accent */}
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}
