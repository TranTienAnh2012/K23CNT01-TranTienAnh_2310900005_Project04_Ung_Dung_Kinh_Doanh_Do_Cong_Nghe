import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sanphamApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhSanPhamXoa() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await sanphamApi.getOne(ma);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [ma]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await sanphamApi.delete(ma);
      alert("Xóa sản phẩm thành công!");
      navigate('/admin/san-pham');
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm!");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Đang kiểm tra...</div>;
  if (!product) return <div className="p-8 text-rose-400">Sản phẩm không tồn tại!</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950' : 'bg-slate-50'} flex items-center justify-center transition-colors duration-300`}>
      <div className={`max-w-md w-full ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'} border rounded-3xl p-8 shadow-2xl text-center`}>
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">delete_forever</span>
        </div>
        
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Xác Nhận Xóa?</h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-8`}>
          Bạn có chắc chắn muốn xóa sản phẩm <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>"{product.TenSanPham}"</span>? 
          Hành động này sẽ ẩn sản phẩm khỏi hệ thống.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Hủy Bỏ
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center"
          >
            {deleting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Đồng Ý Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
