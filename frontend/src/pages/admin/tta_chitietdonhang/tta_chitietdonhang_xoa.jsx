import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chitietApi } from '../../api/tta_api';

export default function TtaChiTietDonHangXoa() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await chitietApi.getOne(ma);
        setItem(res.data.data);
      } catch (err) {
        alert('Không tìm thấy chi tiết đơn hàng.');
        navigate('/admin/chi-tiet');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [ma, navigate]);

  const handleDelete = async () => {
    try {
      await chitietApi.delete(ma);
      alert('Đã xóa sản phẩm khỏi đơn hàng và hoàn lại kho thành công!');
      navigate('/admin/chi-tiet');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="form-container mini">
      <div className="card danger">
        <div className="card-header">
          <h3 className="card-title">🗑 Xác nhận xóa sản phẩm</h3>
        </div>
        <div className="card-body">
          <div className="warning-msg">
            <span className="icon">⚠️</span>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?
          </div>
          <div className="item-details">
            <p><strong>Sản phẩm:</strong> {item.TenSanPham}</p>
            <p><strong>Đơn hàng:</strong> #{item.MaDonHang}</p>
            <p><strong>Số lượng hoàn trả kho:</strong> {item.SoLuong}</p>
          </div>
          <div className="info-alert">
            Sau khi xóa, <strong>số tiền tổng</strong> của Đơn hàng #{item.MaDonHang} sẽ được tự động trừ đi giá trị của sản phẩm này.
          </div>
          <div className="form-actions">
            <button onClick={() => navigate('/admin/chi-tiet')} className="btn btn-secondary">Hủy</button>
            <button onClick={handleDelete} className="btn btn-danger">Xác nhận Xóa</button>
          </div>
        </div>
      </div>
    </div>
  );
}
