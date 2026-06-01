import React, { useState, useEffect } from 'react';
import { donhangThueApi } from '../../../api/nhanvien/tta_thue.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkThueDonHangList() {
  const isDark = useAdminTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await donhangThueApi.getAll();
      if (res.data?.success) {
        setData(res.data.data.items || res.data.data);
      }
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (item, newStatus) => {
    try {
      const updatedItem = { ...item, G5_TrangThai: newStatus };
      delete updatedItem.items; // Clean nested items before updating database row
      
      const res = await donhangThueApi.update(item.G5_MaDonThue, updatedItem);
      if (res.data?.success) {
        alert(`Đã cập nhật trạng thái đơn hàng sang "${newStatus}" thành công!`);
        loadData();
      } else {
        alert(res.data?.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      console.error("Error updating status", err);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
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

  // Filter logic
  const filteredData = data.filter(item => {
    const orderId = String(item.G5_MaDonThue);
    const customerName = (item.G5_HoTen || item.G5_HoTenNguoiNhan || '').toLowerCase();
    const phone = (item.G5_SDT || item.G5_SoDienThoaiNguoiNhan || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = orderId.includes(searchLower) || customerName.includes(searchLower) || phone.includes(searchLower);
    const matchesStatus = statusFilter === 'all' || item.G5_TrangThai === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Search and Filters Bar (Replaces duplicated titles) */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 h-10 rounded-xl text-xs outline-none border focus:ring-2 focus:ring-blue-500/50 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`h-10 px-3 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang thuê">Đang thuê</option>
            <option value="Đã trả">Đã trả</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Đang tải danh sách đơn thuê...</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mã Đơn</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sản Phẩm Rented</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Khách Hàng</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thời Gian Thuê</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Tiền Cọc</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Tổng Tiền</th>
                  <th className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-sm text-slate-400">Không tìm thấy đơn đặt thuê nào.</td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const mainItem = item.items?.[0];
                    const hasMore = item.items?.length > 1;

                    return (
                      <tr key={item.G5_MaDonThue} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/50'}`}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">#{item.G5_MaDonThue}</td>
                        
                        {/* Rented Product Image and Name */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {mainItem ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg p-1 bg-white border border-slate-200/60 shrink-0">
                                <img
                                  src={getImageUrl(mainItem.G5_HinhAnh)}
                                  alt={mainItem.G5_TenSanPham}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="max-w-[200px]">
                                <span className={`font-semibold text-xs block truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`} title={mainItem.G5_TenSanPham}>
                                  {mainItem.G5_TenSanPham}
                                </span>
                                {hasMore && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-bold border border-purple-100 mt-0.5 inline-block">
                                    và {item.items.length - 1} sản phẩm khác
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">N/A</span>
                          )}
                        </td>

                        {/* Customer Information */}
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

                        <td className="px-4 py-4 whitespace-nowrap text-xs font-medium">
                          {formatDate(item.G5_NgayBatDau)} - {formatDate(item.G5_NgayKetThuc)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                          {Number(item.G5_TienCoc || 0).toLocaleString('vi-VN')} đ
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {Number(item.G5_TongTien || 0).toLocaleString('vi-VN')} đ
                        </td>

                        {/* Status (Direct interaction column) */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={item.G5_TrangThai || ''}
                            onChange={(e) => handleUpdateStatus(item, e.target.value)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border outline-none bg-white cursor-pointer transition-all ${
                              item.G5_TrangThai === 'Đã trả' ? 'text-purple-700 border-purple-200 bg-purple-50' :
                              item.G5_TrangThai === 'Đang thuê' ? 'text-blue-700 border-blue-200 bg-blue-50' :
                              item.G5_TrangThai === 'Đã hủy' ? 'text-rose-700 border-rose-200 bg-rose-50' :
                              'text-amber-700 border-amber-200 bg-amber-50'
                            }`}
                          >
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đang thuê">Đang thuê</option>
                            <option value="Đã trả">Đã trả</option>
                            <option value="Đã hủy">Đã hủy</option>
                          </select>
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
