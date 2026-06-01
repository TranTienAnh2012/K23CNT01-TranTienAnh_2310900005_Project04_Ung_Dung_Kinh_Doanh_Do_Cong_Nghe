import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lichTuvanNhanVienApi, lichTuvanApi } from '../../../api/admin/tta_rest_modules.api';
import { shopApi } from '../../../api/client/tta_shop.api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhLichNhanVienThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    G5_MaLich: '',
    G5_MaNhanVien: ''
  });
  const [staffList, setStaffList] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [resStaff, resAppt] = await Promise.all([
          shopApi.getStaffList(),
          lichTuvanApi.getAll()
        ]);
        if (resStaff.data?.success) {
          setStaffList(resStaff.data.data.items || []);
        }
        if (resAppt.data?.success) {
          setAppointmentList(resAppt.data.data.items || resAppt.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching helper lists:", err);
      }
    };
    fetchSelectData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        G5_MaLich: parseInt(formData.G5_MaLich, 10),
        G5_MaNhanVien: parseInt(formData.G5_MaNhanVien, 10),
      };
      await lichTuvanNhanVienApi.create(payload);
      navigate('/admin/lich-nhanvien');
    } catch (err) {
      console.error("Error saving data", err);
      alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Thêm Lịch Nhân Viên</h1>
        <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Lịch Hẹn Tư Vấn</label>
            <select 
              name="G5_MaLich" 
              value={formData.G5_MaLich || ''} 
              onChange={handleChange} 
              className={`w-full p-2 rounded border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              required
            >
              <option value="">-- Chọn lịch hẹn tư vấn --</option>
              {appointmentList.map((app) => (
                <option key={app.G5_Id} value={app.G5_Id}>
                  Lịch #{app.G5_Id} - Khách: {app.G5_TenKhachHang || `User #${app.G5_MaNguoiDung}`} ({app.G5_TenDichVu || 'Dịch vụ tư vấn'})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nhân Viên Phụ Trách</label>
            <select 
              name="G5_MaNhanVien" 
              value={formData.G5_MaNhanVien || ''} 
              onChange={handleChange} 
              className={`w-full p-2 rounded border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              required
            >
              <option value="">-- Chọn nhân viên phụ trách --</option>
              {staffList.map((staff) => (
                <option key={staff.G5_MaNguoiDung} value={staff.G5_MaNguoiDung}>
                  {staff.G5_HoTen} (ID: #{staff.G5_MaNguoiDung})
                </option>
              ))}
            </select>
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
