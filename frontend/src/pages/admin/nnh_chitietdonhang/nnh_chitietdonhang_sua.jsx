import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chitietApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaChiTietDonHangSua() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [newQty, setNewQty] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await chitietApi.getOne(ma);
        setItem(res.data.data);
        setNewQty(res.data.data.SoLuong);
      } catch (err) {
        alert('Không tìm thấy chi tiết đơn hàng.');
        navigate('/admin/chi-tiet');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [ma, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await chitietApi.update(ma, { so_luong: newQty });
      alert('Cập nhật số lượng và tính lại đơn hàng thành công!');
      navigate('/admin/chi-tiet');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className={`p-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Đang tải...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-lg ${isDark ? 'bg-slate-900/70 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <h3 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
            <span className="material-symbols-outlined text-blue-500 text-3xl">edit_square</span>
            Chỉnh sửa số lượng
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Cập nhật lại số lượng sản phẩm trong vận đơn.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Sản phẩm</span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.TenSanPham}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800/50 pt-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Đơn hàng</span>
              <span className="text-sm text-blue-500 font-mono font-bold">#{item.MaDonHang}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800/50 pt-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Đơn giá</span>
              <span className={`text-sm font-bold ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Gia)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Số lượng mới</label>
            <div className="relative">
              <input 
                type="number" 
                min="0"
                required 
                className={`w-full px-4 py-4 rounded-xl border text-xl font-bold font-['Space_Grotesk'] ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                value={newQty}
                onChange={e => setNewQty(parseInt(e.target.value))}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold uppercase">đơn vị</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-start gap-3 border ${isDark ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
            <span className="material-symbols-outlined text-lg mt-0.5">info</span>
            <p className="text-[11px] font-medium leading-relaxed italic">
              Hệ thống sẽ tự động trừ/cộng kho và tính lại tổng tiền đơn hàng <span className="font-bold underline">#{item.MaDonHang}</span>.
            </p>
          </div>
          
          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/chi-tiet')} 
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">save_as</span>
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
