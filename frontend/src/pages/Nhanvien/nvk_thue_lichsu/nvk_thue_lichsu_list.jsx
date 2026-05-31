import React, { useState, useEffect } from 'react';
import { lichsuThueApi } from '../../../api/admin/tta_thue.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkThueLichSuList() {
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
      const res = await lichsuThueApi.getAll();
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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter history
  const filteredData = data.filter(item => {
    const orderId = String(item.G5_MaDonThue);
    const customerName = (item.G5_HoTen || '').toLowerCase();
    const productName = (item.G5_TenSanPham || '').toLowerCase();
    const phone = (item.G5_SDT || '').toLowerCase();
    const status = (item.G5_TrangThai || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return orderId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      productName.includes(searchLower) ||
      phone.includes(searchLower) ||
      status.includes(searchLower);
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Đã trả':
      case 'Returned':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Đang thuê':
      case 'Active':
      case 'Đã duyệt':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Đã hủy':
      case 'Cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Search and Filters Bar (Replaces duplicated titles) */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, sản phẩm, trạng thái..."
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
          <p className="text-xs text-slate-400 font-medium">Đang tải nhật ký lịch sử thuê...</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Nhật Ký ID</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mã Đơn</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sản Phẩm</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Khách Hàng</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Trạng Thái Giao Dịch</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thời Điểm Ghi Nhận</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-sm text-slate-400">Không tìm thấy bản ghi lịch sử nào.</td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">#{item.G5_Id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">#{item.G5_MaDonThue}</td>
                      
                      {/* Product image and title */}
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

                      {/* Customer contact info */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.G5_HoTen || `User #${item.G5_MaNguoiDung}`}</span>
                        <span className="text-xs text-slate-400 block">{item.G5_SDT}</span>
                      </td>

                      {/* Action status tags */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(item.G5_TrangThai)}`}>
                          {item.G5_TrangThai}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatDateTime(item.G5_ThoiDiem)}
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
