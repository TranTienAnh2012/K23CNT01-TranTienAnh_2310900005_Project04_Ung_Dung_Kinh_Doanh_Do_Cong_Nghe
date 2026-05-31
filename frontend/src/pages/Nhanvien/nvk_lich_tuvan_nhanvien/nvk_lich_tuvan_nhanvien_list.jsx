import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lichTuvanNhanVienApi } from '../../../api/admin/tta_rest_modules.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkLichNhanVienList() {
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
      const res = await lichTuvanNhanVienApi.getAll();
      if (res.data?.success) {
        setData(res.data.data.items || res.data.data);
      }
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phân công này?')) {
      try {
        await lichTuvanNhanVienApi.delete(id);
        loadData();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  // Filter logic
  const filteredData = data.filter(item => {
    const recordId = String(item.G5_Id);
    const scheduleId = String(item.G5_MaLich);
    const staffId = String(item.G5_MaNhanVien);
    const searchLower = searchTerm.toLowerCase();

    return recordId.includes(searchLower) || scheduleId.includes(searchLower) || staffId.includes(searchLower);
  });

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      

      {/* Search and Action Bar */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo ID, Mã Lịch, Mã Nhân Viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 h-10 rounded-xl text-xs outline-none border focus:ring-2 focus:ring-blue-500/50 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          />
        </div>

        <Link
          to="/admin/lich-nhanvien/them"
          className="w-full md:w-auto h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Thêm phân công mới
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Đang tải danh sách phân công...</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>ID</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mã Lịch Hẹn</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mã Nhân Viên</th>
                  <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-sm text-slate-400 font-medium">
                      Không tìm thấy bản ghi phân công nào.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">#{item.G5_Id}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Mã Lịch #{item.G5_MaLich}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Mã NV #{item.G5_MaNhanVien}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/admin/lich-nhanvien/edit/${item.G5_Id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Sửa phân công"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.G5_Id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Xóa phân công"
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
