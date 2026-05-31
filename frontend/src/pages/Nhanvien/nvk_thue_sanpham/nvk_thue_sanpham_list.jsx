import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanphamThueApi } from '../../../api/admin/tta_thue.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkThueSanPhamList() {
  const isDark = useAdminTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await sanphamThueApi.getAll();
      if (res.data?.success) {
        setData(res.data.data.items || res.data.data);
      }
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách thuê?')) {
      try {
        await sanphamThueApi.delete(id);
        loadData();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  // Filter products by search term
  const filteredData = data.filter(item => {
    const productName = (item.G5_TenSanPham || '').toLowerCase();
    const productId = String(item.G5_MaSanPham);
    const searchLower = searchTerm.toLowerCase();

    return productName.includes(searchLower) || productId.includes(searchLower);
  });

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Search and Action Bar (Replaces duplicated page titles) */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 h-10 rounded-xl text-xs outline-none border focus:ring-2 focus:ring-blue-500/50 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          />
        </div>

        <Link
          to="/admin/sanpham-thue/them"
          className="w-full md:w-auto h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Thêm sản phẩm thuê mới
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Đang tải danh sách sản phẩm...</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>ID</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Hình Ảnh</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sản Phẩm</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Giá Thuê Theo Ngày</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Tiền Đặt Cọc</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Trạng Thái</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Số Lượng Cho Thuê</th>
                  <th className={`px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thao Tác</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-sm text-slate-400">Không tìm thấy sản phẩm nào.</td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">#{item.G5_Id}</td>
                      
                      {/* Product image */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-lg p-1 bg-white border border-slate-200/60 shrink-0">
                          <img
                            src={getImageUrl(item.G5_HinhAnh)}
                            alt={item.G5_TenSanPham}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>

                      {/* Product details */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.G5_TenSanPham}</span>
                        <span className="text-xs text-slate-400">Mã SP: #{item.G5_MaSanPham}</span>
                      </td>

                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {Number(item.G5_GiaThueNgay || 0).toLocaleString('vi-VN')} đ/ngày
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                        {Number(item.G5_TienCoc || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {item.G5_SoLuongChoThue > 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Còn hàng</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">Hết hàng</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm text-center font-medium ${isDark ? 'text-slate-350 text-slate-300' : 'text-slate-600'}`}>
                        {item.G5_SoLuongChoThue}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/admin/sanpham-thue/edit/${item.G5_Id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Sửa thông tin"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.G5_Id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
