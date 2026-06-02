import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dichvuTuvanApi } from '../../../api/nhanvien/tta_rest_modules.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NvkDichVuTuVanThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    G5_TenDichVu: '',
    G5_Gia: '',
    G5_ThoiLuong: '',
    G5_MoTa: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dichvuTuvanApi.create(formData);
      navigate('/admin/dichvu-tuvan');
    } catch (err) {
      console.error("Error saving data", err);
      alert("Có lỗi xảy ra khi tạo dịch vụ.");
    }
  };

  return (
    <div className={`p-6 min-h-screen font-['Inter'] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Thêm Dịch Vụ Tư Vấn</h1>
          <p className="text-xs text-slate-500 mt-1">Tạo gói dịch vụ tư vấn công nghệ mới cho hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className={`p-6 rounded-2xl shadow-xl border space-y-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-655 text-slate-600'}`}>Tên Dịch Vụ</label>
            <input
              type="text"
              name="G5_TenDichVu"
              value={formData.G5_TenDichVu || ''}
              onChange={handleChange}
              placeholder="Ví dụ: Tư vấn cài đặt mạng Lan/Wifi"
              className={`w-full h-11 px-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phí dịch vụ (VNĐ)</label>
              <input
                type="number"
                name="G5_Gia"
                value={formData.G5_Gia || ''}
                onChange={handleChange}
                placeholder="Ví dụ: 150000"
                className={`w-full h-11 px-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Thời lượng (Phút)</label>
              <input
                type="number"
                name="G5_ThoiLuong"
                value={formData.G5_ThoiLuong || ''}
                onChange={handleChange}
                placeholder="Ví dụ: 45"
                className={`w-full h-11 px-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Mô tả dịch vụ</label>
            <textarea
              name="G5_MoTa"
              value={formData.G5_MoTa || ''}
              onChange={handleChange}
              placeholder="Mô tả nội dung hỗ trợ của gói tư vấn này..."
              rows="4"
              className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
            ></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-5 h-11 rounded-xl border font-bold text-xs uppercase tracking-wider transition-colors ${
                isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-xl shadow font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
