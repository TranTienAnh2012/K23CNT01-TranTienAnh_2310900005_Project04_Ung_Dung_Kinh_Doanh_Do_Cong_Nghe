import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { thuoctinhApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhThuocTinhXoa() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [attribute, setAttribute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const res = await thuoctinhApi.getAll();
        const items = res.data.data.items;
        const item = items.find(i => i.ThuocTinhID === parseInt(ma));
        if (item) {
          setAttribute(item);
        } else {
          alert("Không tìm thấy thuộc tính!");
          navigate('/admin/thuoc-tinh');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttribute();
  }, [ma, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await thuoctinhApi.delete(ma);
      alert("Xóa thuộc tính thành công!");
      navigate('/admin/thuoc-tinh');
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className={`p-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Đang kiểm tra...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-md ${isDark ? 'bg-slate-900/70 border-rose-500/20 shadow-black/50' : 'bg-white border-rose-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-rose-500/5' : 'border-rose-100 bg-rose-50/30'} text-center`}>
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">delete_sweep</span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-rose-500">Xóa thuộc tính gốc</h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>Hành động này sẽ gỡ bỏ tiêu chuẩn kỹ thuật này khỏi hệ thống.</p>
        </div>

        <div className="p-8">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} mb-8`}>
             <p className={`text-center text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
               Bạn đang yêu cầu xóa thuộc tính:
             </p>
             <h4 className="text-center text-xl font-bold font-['Space_Grotesk'] text-white mt-2">"{attribute.TenThuocTinh}"</h4>
             <p className="text-[10px] text-center text-rose-400 uppercase mt-4 font-bold tracking-tighter">Cảnh báo: Sẽ ảnh hưởng đến các danh mục đang dùng thuộc tính này!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/thuoc-tinh')} 
              className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleDelete} 
              disabled={deleting}
              className="px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {deleting ? (
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
