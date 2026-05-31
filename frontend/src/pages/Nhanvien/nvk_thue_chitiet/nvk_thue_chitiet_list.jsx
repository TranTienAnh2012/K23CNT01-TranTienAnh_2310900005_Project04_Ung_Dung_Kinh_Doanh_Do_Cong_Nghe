import React, { useState, useEffect } from 'react';
import { chitietThueApi } from '../../../api/admin/tta_thue.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkThueChiTietList() {
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
      const res = await chitietThueApi.getAll();
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getRentalDays = (startStr, endStr) => {
    if (!startStr || !endStr) return 1;
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 0 ? 1 : diffDays;
    } catch (e) {
      return 1;
    }
  };

  // Search logic
  const filteredData = data.filter(item => {
    const orderId = String(item.G5_MaDonThue);
    const customerName = (item.G5_HoTen || '').toLowerCase();
    const productName = (item.G5_TenSanPham || '').toLowerCase();
    const phone = (item.G5_SDT || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return orderId.includes(searchLower) || customerName.includes(searchLower) || productName.includes(searchLower) || phone.includes(searchLower);
  });

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Search and Filters Bar (Replaces duplicated titles) */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 h-10 rounded-xl text-xs outline-none border focus:ring-2 focus:ring-blue-500/50 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Đang tải chi tiết đơn hàng...</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mã Đơn</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sản Phẩm</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Khách Hàng</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thời Hạn Thuê</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Ghi Chú</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Giá Thuê</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Số Lượng</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thành Tiền</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-sm text-slate-400">Không tìm thấy chi tiết giao dịch nào.</td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const days = getRentalDays(item.G5_NgayBatDau, item.G5_NgayKetThuc);
                    const subtotal = (item.G5_GiaThue || 0) * (item.G5_SoLuong || 0) * days;

                    return (
                      <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/50'}`}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">#{item.G5_MaDonThue}</td>
                        
                        {/* Rented Product info */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg p-1 bg-white border border-slate-200/60 shrink-0">
                              <img
                                src={getImageUrl(item.G5_HinhAnh)}
                                alt={item.G5_TenSanPham}
                                className="w-full h-full object-contain"
                              />
                            </div>
                             <div>
                               <span className={`font-semibold text-xs block max-w-[200px] truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`} title={item.G5_TenSanPham}>
                                 {item.G5_TenSanPham}
                               </span>
                               <span className="text-[10px] text-slate-400">Mã SP: #{item.G5_MaSanPham}</span>
                             </div>
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                           <div className="flex flex-col">
                             <span className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                               {item.G5_HoTen || `Khách hàng #${item.G5_MaNguoiDung}`} ({item.G5_SDT || 'N/A'})
                             </span>
                             <span className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                               Người nhận: {item.G5_HoTenNguoiNhan || 'N/A'} - {item.G5_SoDienThoaiNguoiNhan || 'N/A'}
                             </span>
                             {item.G5_DiaChiNguoiNhan && (
                               <span className="text-[9px] text-slate-400 max-w-[200px] truncate" title={item.G5_DiaChiNguoiNhan}>
                                 ĐC: {item.G5_DiaChiNguoiNhan}
                               </span>
                             )}
                           </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-xs">
                          <div className="flex flex-col gap-0.5 font-medium">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                              BĐ: {formatDate(item.G5_NgayBatDau)}
                            </span>
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                              KT: {formatDate(item.G5_NgayKetThuc)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">({days} ngày)</span>
                          </div>
                        </td>
                        
                        <td className={`px-4 py-4 text-xs max-w-[150px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`} title={item.G5_GhiChu || ''}>
                          {item.G5_GhiChu || '-'}
                        </td>

                         <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                           {Number(item.G5_GiaThue || 0).toLocaleString('vi-VN')} đ
                         </td>
                         <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                           {item.G5_SoLuong}
                         </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          {subtotal.toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
