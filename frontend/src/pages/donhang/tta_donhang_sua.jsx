import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/tta_axios';

export default function TtaDonHangSua() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/tta_donhang/${ma}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [ma]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tta_donhang/${ma}`, order);
      alert('Cập nhật thành công!');
      navigate('/admin/don-hang');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3>✏️ Chỉnh sửa đơn hàng #{ma}</h3>
        </div>
        <form onSubmit={handleUpdate} className="p-4">
          <div className="form-group">
            <label>Trạng thái</label>
            <select 
              value={order.G5_TrangThai}
              onChange={e => setOrder({...order, G5_TrangThai: e.target.value})}
              className="form-control"
            >
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary ml-2">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
