import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dichvuTuvanApi } from '../../../api/admin/tta_rest_modules.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkDichVuTuVanList() {
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
      const res = await dichvuTuvanApi.getAll();
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
    if (window.confirm('Bạn có chắc chắn muốn xóa gói dịch vụ tư vấn này?')) {
      try {
        await dichvuTuvanApi.delete(id);
        loadData();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  // Filter logic
  const filteredData = data.filter(item => {
    const serviceName = (item.G5_TenDichVu || '').toLowerCase();
    const serviceDesc = (item.G5_MoTa || '').toLowerCase();
    const serviceId = String(item.G5_Id);
    const searchLower = searchTerm.toLowerCase();

    return serviceName.includes(searchLower) || serviceDesc.includes(searchLower) || serviceId.includes(searchLower);
  });

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Search and Action Bar */}
      <div className={`p-4 mb-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 h-10 rounded-xl text-xs outline-none border focus:ring-2 focus:ring-blue-500/50 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          />
        </div>

        <Link
          to="/admin/dichvu-tuvan/them"
          className="w-full md:w-auto h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Thêm dịch vụ tư vấn mới
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Đang tải danh sách dịch vụ...</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>ID</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Tên Dịch Vụ</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Giá Gói</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thời Lượng</th>
                  <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-sm text-slate-400 font-medium">
                      Không tìm thấy dịch vụ tư vấn nào.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">#{item.G5_Id}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.G5_TenDichVu}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{Number(item.G5_Gia).toLocaleString('vi-VN')} đ</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.G5_ThoiLuong} phút</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/admin/dichvu-tuvan/edit/${item.G5_Id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Sửa thông tin"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.G5_Id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Xóa dịch vụ"
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
