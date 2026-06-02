import React, { useState, useEffect } from 'react';
import { lichTuvanApi } from '../../../api/nhanvien/tta_rest_modules.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkLichTuVanList() {
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
      const res = await lichTuvanApi.getAll();
      if (res.data?.success) {
        setData(res.data.data.items || res.data.data);
      }
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const item = data.find(x => x.G5_Id === id);
      if (!item) return;

      const payload = {
        G5_TrangThai: newStatus
      };
      
      const res = await lichTuvanApi.update(id, payload);
      if (res.data?.success) {
        loadData();
      } else {
        alert(res.data?.message || 'Không thể cập nhật trạng thái.');
      }
    } catch (err) {
      console.error("Error updating status", err);
      alert('Đã xảy ra lỗi khi kết nối.');
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Đã xác nhận':
      case 'Đã duyệt':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Đã hủy':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'Đã hoàn thành':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    }
  };

  const filteredData = data.filter(item => {
    const scheduleId = String(item.G5_Id);
    const serviceName = (item.G5_TenDichVu || '').toLowerCase();
    const customerName = (item.G5_TenKhachHang || '').toLowerCase();
    const staffName = (item.G5_TenNhanVien || '').toLowerCase();
    const note = (item.G5_GhiChu || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = scheduleId.includes(searchLower) ||
                          serviceName.includes(searchLower) ||
                          customerName.includes(searchLower) ||
                          staffName.includes(searchLower) ||
                          note.includes(searchLower);
                          
    const matchesStatus = statusFilter === 'all' || item.G5_TrangThai === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>

      {/* Search and Filters Bar */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo ID, dịch vụ, khách, nhân viên..."
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
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className={`rounded-xl shadow overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>ID</th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Dịch vụ</th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Khách hàng</th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Tư vấn viên</th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Thời gian</th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Trạng thái</th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-500 font-medium">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-sm text-slate-400 font-medium">
                    Không tìm thấy lịch tư vấn phù hợp.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">#{item.G5_Id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.G5_TenDichVu}</div>
                      <div className="text-xs text-purple-600 font-semibold">{Number(item.G5_Gia).toLocaleString('vi-VN')} đ</div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {item.G5_TenKhachHang || `Mã KH: ${item.G5_MaNguoiDung}`}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {item.G5_TenNhanVien || <span className="text-slate-400 italic">Chưa chỉ định</span>}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-xs space-y-0.5 ${isDark ? 'text-slate-350 text-slate-300' : 'text-slate-600'}`}>
                      <div><strong>Bắt đầu:</strong> {formatDateTime(item.G5_ThoiGianBatDau)}</div>
                      <div><strong>Kết thúc:</strong> {formatDateTime(item.G5_ThoiGianKetThuc)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5 max-w-[150px]">
                        <select
                          value={item.G5_TrangThai || 'Chờ xác nhận'}
                          onChange={(e) => handleStatusChange(item.G5_Id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer focus:ring-1 focus:ring-blue-500 ${getStatusClass(item.G5_TrangThai)}`}
                        >
                          <option value="Chờ xác nhận" className="text-amber-600 bg-white">Chờ xác nhận</option>
                          <option value="Đã xác nhận" className="text-emerald-600 bg-white">Đã xác nhận</option>
                          <option value="Đã hoàn thành" className="text-blue-600 bg-white">Đã hoàn thành</option>
                          <option value="Đã hủy" className="text-rose-600 bg-white">Đã hủy</option>
                        </select>
                        {['Đã xác nhận', 'Đã duyệt'].includes(item.G5_TrangThai) && (
                          <a
                            href="https://meet.google.com/g5-store-consulting"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[12px]">video_call</span>
                            Bắt đầu Meet
                          </a>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-xs max-w-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`} title={item.G5_GhiChu}>
                      {item.G5_GhiChu || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
