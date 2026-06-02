import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaUserXoa() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const { ma } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getById(ma);
        setUser(res.data.data);
      } catch (err) {
        navigate('/admin/user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [ma, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userApi.delete(ma);
      alert("Đã xóa người dùng khỏi hệ thống.");
      navigate('/admin/user');
    } catch (err) {
      alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 italic">Đang xác minh hồ sơ...</div>;
  if (!user) return null;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex items-center justify-center`}>
      <div className={`max-w-xl w-full ${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-2xl'} backdrop-blur-md rounded-[3rem] border p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500`}>
        <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-rose-500/5">
          <span className="material-symbols-outlined text-5xl">person_remove</span>
        </div>
        
        <h2 className={`font-['Space_Grotesk'] text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Xác nhận xóa tài khoản?</h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-10 leading-relaxed`}>
          Hành động này sẽ gỡ bỏ hoàn toàn người dùng <b className="text-blue-500">{user.HoTen}</b> ({user.Email}) khỏi hệ thống. <br/>
          <span className="text-rose-500 font-bold text-xs mt-2 block uppercase tracking-widest">Cảnh báo: Dữ liệu không thể khôi phục!</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/admin/user')}
            className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            HỦY BỎ
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {deleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            XÁC NHẬN XÓA
          </button>
        </div>
      </div>
    </div>
  );
}
