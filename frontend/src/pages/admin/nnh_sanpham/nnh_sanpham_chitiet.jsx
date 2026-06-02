import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { sanphamApi, giatrithuoctinhApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhSanPhamChiTiet() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, attrRes] = await Promise.all([
          sanphamApi.getOne(ma),
          giatrithuoctinhApi.getAll({ ma_sp: ma })
        ]);
        setProduct(prodRes.data.data);
        setAttributes(attrRes.data.data.items || []);
      } catch (err) {
        console.error("Lỗi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ma]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getImageUrl = (path) => {
    if (!path) return '/placeholder-prod.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  if (loading) return <div className="p-8 text-slate-400">Đang tải chi tiết...</div>;
  if (!product) return <div className="p-8 text-rose-400">Không tìm thấy sản phẩm!</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter']`}>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'} border flex items-center justify-center transition-colors`}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h2 className={`font-['Space_Grotesk'] text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chi Tiết Sản Phẩm</h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Xem toàn bộ thông số và cấu hình của thực thể mã #{ma}.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Link to={`/admin/san-pham/edit/${ma}`} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-sm">edit</span>
                Chỉnh sửa
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Hình ảnh */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-lg'} backdrop-blur-md p-4 rounded-3xl border shadow-2xl`}>
              <div className={`aspect-square ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} rounded-2xl overflow-hidden border`}>
                <img 
                  src={getImageUrl(product.HinhAnh)} 
                  alt={product.TenSanPham} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'} backdrop-blur-md p-6 rounded-3xl border shadow-xl`}>
               <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Trạng thái</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
                    product.TrangThai 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {product.TrangThai ? 'Đang kinh doanh' : 'Đã ngừng bán'}
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tồn kho</span>
                  <span className="text-white font-['Space_Grotesk'] font-bold">{product.SoLuongTon} <span className="text-xs text-slate-500">sản phẩm</span></span>
               </div>
            </div>
          </div>

          {/* Cột phải: Thông tin chi tiết */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'} backdrop-blur-md p-8 rounded-3xl border shadow-xl`}>
              <div className="mb-6">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">{product.TenDanhMuc}</span>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>{product.TenSanPham}</h1>
                <div className="flex items-baseline gap-4">
                   <span className="text-4xl font-['Space_Grotesk'] font-bold text-emerald-400">{formatPrice(product.GiaBan)}</span>
                   <span className="text-xl text-slate-500 line-through">{formatPrice(product.Gia)}</span>
                </div>
              </div>

              <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} pt-6 mt-6`}>
                <h3 className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest mb-4`}>Mô tả sản phẩm</h3>
                <div className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed space-y-4 text-sm`}>
                  {product.MoTa ? (
                    product.MoTa.split('\\n').map((line, i) => <p key={i}>{line}</p>)
                  ) : (
                    <p className="italic text-slate-500 text-sm">Chưa có thông tin mô tả chi tiết cho sản phẩm này.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className={`p-4 ${isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'} rounded-2xl border`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Thương hiệu</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>{product.ThuongHieu || "Chưa xác định"}</p>
                </div>
                <div className={`p-4 ${isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'} rounded-2xl border`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Xuất xứ</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>{product.XuatXu || "Chưa xác định"}</p>
                </div>
                <div className={`p-4 ${isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'} rounded-2xl border`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bảo hành</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>{product.BaoHanh || "12 tháng"}</p>
                </div>
                <div className={`p-4 ${isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'} rounded-2xl border`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Phân loại</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>{product.Loai || "Tiêu chuẩn"}</p>
                </div>
              </div>
            </div>

            {/* Thông số kỹ thuật (Thực tế) */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'} backdrop-blur-md p-8 rounded-3xl border shadow-xl`}>
               <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                    <span className="material-symbols-outlined text-purple-400">settings_suggest</span>
                    Thông số kỹ thuật chi tiết
                  </h3>
                  <Link to={`/admin/san-pham/thong-so/${ma}`} className="text-blue-400 text-xs font-bold hover:underline">Quản lý thông số</Link>
               </div>
               
               {attributes.length > 0 ? (
                 <div className="grid grid-cols-1 gap-4">
                   {attributes.map((attr, idx) => (
                     <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-100'} border transition-colors hover:border-blue-500/30`}>
                       <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{attr.TenThuocTinh}</span>
                       <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{attr.GiaTri}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className={`p-8 text-center border-2 border-dashed ${isDark ? 'border-slate-800' : 'border-slate-100'} rounded-2xl`}>
                   <span className="material-symbols-outlined text-4xl text-slate-700 mb-3">inventory_2</span>
                   <p className="text-sm text-slate-500 italic">Chưa có thông số kỹ thuật mở rộng cho sản phẩm này.</p>
                   <Link to={`/admin/san-pham/thong-so/${ma}`} className="mt-4 inline-block text-xs font-bold text-blue-500 hover:underline">Thiết lập thông số ngay →</Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
