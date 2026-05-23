import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lichTuvanNhanVienApi } from '../../../api/admin/tta_rest_modules.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhLichNhanVienList() {
  const isDark = useAdminTheme();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await lichTuvanNhanVienApi.getAll();
      if (res.data?.success) setData(res.data.data.items || res.data.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await lichTuvanNhanVienApi.delete(id);
        loadData();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Lịch Nhân Viên</h1>
        <Link to="/admin/lich-nhanvien/them" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
          + Thêm Mới
        </Link>
      </div>
      <div className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <table className="min-w-full">
          <thead className={isDark ? 'bg-slate-800/50' : 'bg-gray-50'}>
            <tr>
                <th className={`px-4 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>ID</th>
                <th className={`px-4 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Mã Lịch</th>
                <th className={`px-4 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Nhân Viên</th>
              <th className={`px-4 py-3 border-b text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.G5_Id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}>
                <td className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{item.G5_Id}</td>
                <td className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{item.G5_MaLich}</td>
                <td className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{item.G5_MaNhanVien}</td>
                <td className={`px-4 py-3 border-b text-right ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <Link to={`/admin/lich-nhanvien/edit/${item.G5_Id}`} className="text-blue-500 hover:text-blue-400 mr-4 font-medium">Sửa</Link>
                  <button onClick={() => handleDelete(item.G5_Id)} className="text-rose-500 hover:text-rose-400 font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
