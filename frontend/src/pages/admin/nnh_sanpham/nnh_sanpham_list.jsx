import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanphamApi } from '../../../api/tta_api';

export default function TtaSanPhamList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async (q = '') => {
    setLoading(true);
    try {
      const res = await sanphamApi.getAll({ q });
      setProducts(res.data.data.items);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '/placeholder-prod.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="p-8 text-slate-400">Đang tải sản phẩm...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-slate-950 font-['Inter']">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">Quản Lý Sản Phẩm</h2>
          <p className="text-slate-400 max-w-xl">Theo dõi danh mục sản phẩm, mức độ tồn kho và thông số kỹ thuật trên toàn hệ thống trung tâm phân phối.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/60 backdrop-blur-md p-1 rounded-xl flex border border-white/5">
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium">Tất cả ({products.length})</button>
            <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Sắp hết</button>
            <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Đã ẩn</button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg pl-4 pr-10 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option>Tất cả danh mục</option>
                <option>Điện thoại</option>
                <option>Laptop</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-lg">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tìm kiếm mã/tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <Link to="/admin/san-pham/them" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors active:scale-95">
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm Mới
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 font-['Space_Grotesk'] uppercase text-[10px] tracking-widest border-b border-slate-800">
                <th className="px-6 py-4 font-semibold">Hình</th>
                <th className="px-6 py-4 font-semibold">Tên Sản Phẩm</th>
                <th className="px-6 py-4 font-semibold">Danh Mục</th>
                <th className="px-6 py-4 font-semibold">Giá Gốc</th>
                <th className="px-6 py-4 font-semibold">Giá Bán</th>
                <th className="px-6 py-4 font-semibold">Số Lượng</th>
                <th className="px-6 py-4 font-semibold">Loại</th>
                <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {products.map((sp) => (
                <tr key={sp.MaSanPham} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                      <img src={getImageUrl(sp.HinhAnh)} alt={sp.TenSanPham} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-50 text-sm">{sp.TenSanPham}</p>
                    <p className="text-xs text-slate-500">{sp.brand || 'SKU-0000'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{sp.TenDanhMuc}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 line-through">{formatPrice(sp.Gia)}</td>
                  <td className="px-6 py-4 text-sm font-['Space_Grotesk'] text-emerald-400 font-bold">{formatPrice(sp.GiaBan)}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{sp.SoLuongTon} <span className="text-xs">sp</span></td>
                  <td className="px-6 py-4 text-sm text-slate-400">Cả hai</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
                      sp.TrangThai 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {sp.TrangThai ? 'Hiển Thị' : 'Đã Ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/admin/san-pham/view/${sp.MaSanPham}`} className="inline-flex items-center justify-center p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Xem">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                    <Link to={`/admin/san-pham/edit/${sp.MaSanPham}`} className="inline-flex items-center justify-center p-1.5 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Sửa">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </Link>
                    <Link to={`/admin/san-pham/thong-so/${sp.MaSanPham}`} className="inline-flex items-center justify-center p-1.5 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors" title="Thông số">
                      <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
                    </Link>
                    <Link to={`/admin/san-pham/delete/${sp.MaSanPham}`} className="inline-flex items-center justify-center p-1.5 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Xóa">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">Hiển thị 1-{products.length} sản phẩm</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-950 text-slate-400 rounded-lg text-sm hover:text-white border border-slate-800 transition-colors">Trang trước</button>
            <div className="flex items-center px-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm font-bold">1</span>
            </div>
            <button className="px-4 py-2 bg-slate-950 text-slate-400 rounded-lg text-sm hover:text-white border border-slate-800 transition-colors">Trang sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
