import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chitietApi } from '../../../api/tta_api';

export default function TtaChiTietDonHangSua() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [newQty, setNewQty] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await chitietApi.getOne(ma);
        setItem(res.data.data);
        setNewQty(res.data.data.SoLuong);
      } catch (err) {
        alert('Không tìm thấy chi tiết đơn hàng.');
        navigate('/admin/chi-tiet');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [ma, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await chitietApi.update(ma, { so_luong: newQty });
      alert('Cập nhật số lượng và tính lại đơn hàng thành công!');
      navigate('/admin/chi-tiet');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="form-container mini">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">✎ Chỉnh sửa số lượng</h3>
        </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="item-summary">
            <p><strong>Sản phẩm:</strong> {item.TenSanPham}</p>
            <p><strong>Đơn hàng:</strong> #{item.MaDonHang}</p>
            <p><strong>Đơn giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Gia)}</p>
          </div>
          <hr />
          <div className="form-group">
            <label>Số lượng mới</label>
            <input 
              type="number" 
              min="0"
              required 
              value={newQty}
              onChange={e => setNewQty(parseInt(e.target.value))}
            />
          </div>
          <div className="info-alert">
            Hệ thống sẽ tự động trừ/cộng kho và tính lại tổng tiền đơn hàng #{item.MaDonHang}.
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/chi-tiet')} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  );
}
