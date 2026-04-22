import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../api/tta_axios';

export default function TtaDonHangXoa() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/tta_donhang/${ma}`);
      alert('Xóa đơn hàng thành công!');
      navigate('/admin/don-hang');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card max-w-md mx-auto mt-10">
        <div className="card-header bg-danger text-white">
          <h3>⚠️ Xác nhận xóa đơn hàng</h3>
        </div>
        <div className="p-6 text-center">
          <p className="mb-6">Bạn có chắc chắn muốn xóa đơn hàng <strong>#{ma}</strong>?</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleDelete} 
              disabled={loading}
              className="btn btn-danger"
            >
              {loading ? 'Đang xóa...' : 'Đồng ý xóa'}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-secondary"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
