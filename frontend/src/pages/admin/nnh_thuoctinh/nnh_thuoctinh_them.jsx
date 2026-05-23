import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { thuoctinhApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhThuocTinhThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    TenThuocTinh: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await thuoctinhApi.create(formData);
      alert("Thêm thuộc tính thành công!");
      navigate('/admin/thuoc-tinh');
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-xl ${isDark ? 'bg-slate-900/70 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <h3 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
            <span className="material-symbols-outlined text-blue-500 text-3xl">add_box</span>
            Thêm Thuộc Tính Gốc
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Định nghĩa các tiêu chuẩn kỹ thuật mới (VD: RAM, CPU, Màu sắc).</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên thuộc tính</label>
              <input 
                required
                type="text"
                className={`w-full px-4 py-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all text-lg font-bold font-['Space_Grotesk']`}
                placeholder="VD: Dung lượng RAM, Màu sắc..."
                value={formData.TenThuocTinh}
                onChange={e => setFormData({...formData, TenThuocTinh: e.target.value})}
              />
            </div>

            <div className={`p-4 rounded-xl flex items-start gap-3 border ${isDark ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              <span className="material-symbols-outlined text-lg mt-0.5">info</span>
              <p className="text-[11px] font-medium leading-relaxed italic">
                Sau khi thêm, bạn có thể gán thuộc tính này vào từng danh mục cụ thể để quản lý thông số kỹ thuật động.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/thuoc-tinh')} 
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Lưu thuộc tính
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
