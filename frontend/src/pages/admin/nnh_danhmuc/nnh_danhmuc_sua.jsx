import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { danhmucApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhDanhMucSua() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    TenDanhMuc: '',
    MoTa: '',
    TrangThai: 1
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await danhmucApi.getOne(ma);
        const data = res.data.data;
        setFormData({
          TenDanhMuc: data.TenDanhMuc,
          MoTa: data.MoTa || '',
          TrangThai: data.TrangThai
        });
      } catch (err) {
        alert("Không tìm thấy danh mục!");
        navigate('/admin/danh-muc');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [ma, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await danhmucApi.update(ma, formData);
      alert("Cập nhật danh mục thành công!");
      navigate('/admin/danh-muc');
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={`p-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Đang tải...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-2xl ${isDark ? 'bg-slate-900/70 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <h3 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
            <span className="material-symbols-outlined text-blue-500 text-3xl">edit_note</span>
            Cập Nhật Danh Mục
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Chỉnh sửa thông tin định danh mã thực thể #{ma}.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên danh mục</label>
              <input 
                required
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                value={formData.TenDanhMuc}
                onChange={e => setFormData({...formData, TenDanhMuc: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả chi tiết</label>
              <textarea 
                rows="4"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all resize-none`}
                value={formData.MoTa}
                onChange={e => setFormData({...formData, MoTa: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-950/30">
               <div>
                  <p className="text-sm font-bold text-slate-200">Kích hoạt hiển thị</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Cho phép người dùng thấy danh mục này</p>
               </div>
               <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, TrangThai: prev.TrangThai === 1 ? 0 : 1 }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.TrangThai === 1 ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.TrangThai === 1 ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/danh-muc')} 
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-900/20 hover:bg-amber-500 active:scale-95 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save_as</span>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
