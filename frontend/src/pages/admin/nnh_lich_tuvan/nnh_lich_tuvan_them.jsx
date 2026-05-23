import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lichTuvanApi } from '../../../api/admin/tta_rest_modules.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhLichTuVanThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (false && id) {
      lichTuvanApi.getAll().then(res => {
        if(res.data?.success) {
          const items = res.data.data.items || res.data.data;
          const item = items.find(x => String(x.G5_Id) === String(id));
          if(item) setFormData(item);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (false) {
        await lichTuvanApi.update(id, formData);
      } else {
        await lichTuvanApi.create(formData);
      }
      navigate('/admin/lich-tuvan');
    } catch (err) {
      console.error("Error saving data", err);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Thêm Lịch Tư Vấn</h1>
        <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Mã Dịch Vụ</label>
          <input type="text" name="G5_MaDichVu" value={formData.G5_MaDichVu || ''} onChange={handleChange} className={`w-full p-2 rounded border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Người Dùng</label>
          <input type="text" name="G5_MaNguoiDung" value={formData.G5_MaNguoiDung || ''} onChange={handleChange} className={`w-full p-2 rounded border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Trạng Thái</label>
          <input type="text" name="G5_TrangThai" value={formData.G5_TrangThai || ''} onChange={handleChange} className={`w-full p-2 rounded border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
        </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className={`px-4 py-2 border rounded font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Hủy</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition-colors font-medium">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
