import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaUserSua() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const { ma } = useParams();
  const [formData, setFormData] = useState({
    HoTen: '',
    Email: '',
    VaiTro: 'customer',
    Status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getById(ma);
        const u = res.data.data;
        setFormData({
          HoTen: u.HoTen,
          Email: u.Email,
          VaiTro: u.VaiTro,
          Status: u.Status || 'active'
        });
      } catch (err) {
        alert("Lỗi tải thông tin: " + err.message);
        navigate('/admin/user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [ma, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.update(ma, formData);
      alert("Cập nhật thông tin thành công!");
      navigate('/admin/user');
    } catch (err) {
      const msg = err.response?.data?.message;
      const errorText = typeof msg === 'object' ? JSON.stringify(msg) : (msg || err.message);
      alert("Lỗi khi cập nhật: " + errorText);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-bold tracking-widest">Đang tải hồ sơ...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter']`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className={`font-['Space_Grotesk'] text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Hiệu Chỉnh Tài Khoản</h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cập nhật thông tin định danh và phân quyền hệ thống.</p>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-[2.5rem] border p-10 shadow-2xl`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Họ và tên</label>
                <input 
                  type="text" 
                  required
                  value={formData.HoTen}
                  onChange={(e) => setFormData({...formData, HoTen: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                />
              </div>
              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email liên hệ</label>
                <input 
                  type="email" 
                  required
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Trạng thái</label>
                <select 
                  value={formData.Status}
                  onChange={(e) => setFormData({...formData, Status: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="locked">Bị khóa</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Vai trò hệ thống</label>
                <select 
                  value={formData.VaiTro}
                  onChange={(e) => setFormData({...formData, VaiTro: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/admin/user')}
                className={`px-8 py-4 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                HỦY BỎ
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                CẬP NHẬT HỒ SƠ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
