import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chitietApi } from '../../../api/tta_api';

export default function TtaChiTietDonHangList() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDetails = async (query = '') => {
    setLoading(true);
    try {
      const res = await chitietApi.getAll({ q: query });
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDetails(search);
  };

  if (loading) return <div className="loading">Đang tải nhật ký...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📖 Chi tiết đơn hàng ({data.total})</h3>
          <form className="search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Mã ĐH hoặc Tên SP..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Tìm</button>
          </form>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Mã CT</th>
                <th>ĐƠN HÀNG</th>
                <th>SẢN PHẨM</th>
                <th>NGƯỜI NHẬN</th>
                <th>NGÀY ĐẶT</th>
                <th>SỐ LƯỢNG</th>
                <th>THÀNH TIỀN</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.MaChiTiet}>
                  <td>#{item.MaChiTiet}</td>
                  <td>
                    <Link to={`/admin/don-hang/edit/${item.MaDonHang}`} className="order-link">
                      <strong>#{item.MaDonHang}</strong>
                    </Link>
                  </td>
                  <td>
                    <div className="product-cell">
                      <span>{item.TenSanPham}</span>
                      <small>Mã SP: #{item.MaSanPham}</small>
                    </div>
                  </td>
                  <td>{item.HoTenNguoiNhan}</td>
                  <td>{new Date(item.NgayDatHang).toLocaleDateString('vi-VN')}</td>
                  <td>x{item.SoLuong}</td>
                  <td className="price-cell">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.SoLuong * item.DonGia)}
                  </td>
                  <td className="actions">
                    <Link to={`/admin/chi-tiet/edit/${item.MaChiTiet}`} className="btn-icon">✎</Link>
                    <Link to={`/admin/chi-tiet/delete/${item.MaChiTiet}`} className="btn-icon delete">🗑</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="note">
        * Lưu ý: Thay đổi số lượng tại đây sẽ ảnh hưởng trực tiếp đến Tổng tiền của Đơn hàng gốc và Số lượng tồn kho.
      </p>
    </div>
  );
}
