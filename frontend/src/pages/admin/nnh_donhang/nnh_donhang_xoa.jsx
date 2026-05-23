import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../api/tta_axios';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaDonHangXoa() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/tta_donhang/${ma}`);
      alert('Xóa đơn hàng thành công!');
      navigate('/admin/don-hang');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-md ${isDark ? 'bg-slate-900/70 border-rose-500/20 shadow-black/50' : 'bg-white border-rose-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-rose-500/5' : 'border-rose-100 bg-rose-50/30'} text-center`}>
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">warning</span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-rose-500">Xác nhận xóa vận đơn</h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>Hành động này không thể hoàn tác. Dữ liệu vận chuyển sẽ bị xóa vĩnh viễn.</p>
        </div>

        <div className="p-8">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} mb-8`}>
             <p className={`text-center text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
               Bạn đang yêu cầu xóa vĩnh viễn đơn hàng mang mã định danh:
             </p>
             <h4 className="text-center text-2xl font-black font-['Space_Grotesk'] text-blue-500 mt-2">#{ma}</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleDelete} 
              disabled={loading}
              className="px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">delete_forever</span>
                  Xác nhận Xóa
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
