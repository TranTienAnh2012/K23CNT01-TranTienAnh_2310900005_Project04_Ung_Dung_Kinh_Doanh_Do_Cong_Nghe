import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donhangApi } from '../../../api/tta_api';

export default function TtaDonHangThem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: '',
    tong_tien: '',
    ma_nguoi_dung: 1, // Default to admin for test
    ghi_chu: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await donhangApi.create(formData);
      alert('Tạo đơn hàng thành công!');
      navigate('/admin/don-hang');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">➕ Tạo đơn hàng mới</h3>
        </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-group">
            <label>Họ tên người nhận</label>
            <input 
              type="text" 
              required 
              value={formData.ho_ten}
              onChange={e => setFormData({...formData, ho_ten: e.target.value})}
              placeholder="Nhập tên người nhận..."
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="text" 
              required 
              value={formData.so_dien_thoai}
              onChange={e => setFormData({...formData, so_dien_thoai: e.target.value})}
              placeholder="0123.456.789"
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea 
              required 
              value={formData.dia_chi}
              onChange={e => setFormData({...formData, dia_chi: e.target.value})}
              placeholder="Địa chỉ cụ thể..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mã người dùng (ID)</label>
              <input 
                type="number" 
                value={formData.ma_nguoi_dung}
                onChange={e => setFormData({...formData, ma_nguoi_dung: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Tổng tiền (VND)</label>
              <input 
                type="number" 
                required
                value={formData.tong_tien}
                onChange={e => setFormData({...formData, tong_tien: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Ghi chú</label>
            <textarea 
              value={formData.ghi_chu}
              onChange={e => setFormData({...formData, ghi_chu: e.target.value})}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/don-hang')} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu đơn hàng</button>
          </div>
        </form>
      </div>
    </div>
  );
}
