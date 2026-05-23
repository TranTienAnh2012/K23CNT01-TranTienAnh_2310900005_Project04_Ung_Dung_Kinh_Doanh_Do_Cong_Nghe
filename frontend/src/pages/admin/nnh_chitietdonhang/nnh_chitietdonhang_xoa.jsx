import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chitietApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaChiTietDonHangXoa() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await chitietApi.getOne(ma);
        setItem(res.data.data);
      } catch (err) {
        alert('Không tìm thấy chi tiết đơn hàng.');
        navigate('/admin/chi-tiet');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [ma, navigate]);

  const handleDelete = async () => {
    try {
      await chitietApi.delete(ma);
      alert('Đã xóa sản phẩm khỏi đơn hàng và hoàn lại kho thành công!');
      navigate('/admin/chi-tiet');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className={`p-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Đang tải...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-lg ${isDark ? 'bg-slate-900/70 border-rose-500/20 shadow-black/50' : 'bg-white border-rose-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-rose-500/5' : 'border-rose-100 bg-rose-50/30'}`}>
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-rose-500 flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">delete_forever</span>
            Xác nhận xóa sản phẩm
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1 font-medium italic`}>Hành động này sẽ xóa vĩnh viễn mục này khỏi đơn hàng.</p>
        </div>

        <div className="p-8 space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50/50 border-rose-100'} flex items-start gap-4`}>
            <span className="material-symbols-outlined text-rose-500 text-2xl">warning</span>
            <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng? Hệ thống sẽ tự động hoàn lại số lượng sản phẩm vào kho hàng.
            </p>
          </div>

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
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Số lượng hoàn trả</span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.SoLuong} sản phẩm</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-start gap-3 border ${isDark ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
            <span className="material-symbols-outlined text-lg mt-0.5">info</span>
            <p className="text-[11px] font-medium leading-relaxed italic">
              Sau khi xóa, <span className="font-bold">số tiền tổng</span> của Đơn hàng #{item.MaDonHang} sẽ được tự động tính lại.
            </p>
          </div>
          
          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/chi-tiet')} 
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Quay lại
            </button>
            <button 
              type="button" 
              onClick={handleDelete}
              className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-500 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">delete_forever</span>
              Xác nhận Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
