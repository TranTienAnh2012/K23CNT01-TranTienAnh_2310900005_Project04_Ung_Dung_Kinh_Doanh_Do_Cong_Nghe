import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donhangApi } from '../../../api/tta_api';

export default function TtaDonHangList() {
  const [data, setData] = useState({ orders: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async (query = '') => {
    setLoading(true);
    try {
      const res = await donhangApi.getAll({ q: query });
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(search);
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      <div className="action-bar">
        <Link to="/admin/don-hang/them" className="btn btn-primary">
          <span>➕</span> Tạo đơn hàng mới
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🚛 Quản lý Đơn hàng ({data.total})</h3>
          <form className="search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn hàng..." 
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
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Tổng cộng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order.MaDonHang}>
                  <td># {order.MaDonHang}</td>
                  <td>
                    <div className="user-cell">
                      <strong>{order.HoTenNguoiNhan}</strong>
                      <small>{order.SoDienThoai}</small>
                    </div>
                  </td>
                  <td className="price-cell">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TongTien)}
                  </td>
                  <td>{new Date(order.NgayDatHang).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`status-badge ${order.TrangThai.toLowerCase()}`}>
                      {order.TrangThai}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/admin/don-hang/edit/${order.MaDonHang}`} className="btn-icon">✎</Link>
                    <Link to={`/admin/don-hang/delete/${order.MaDonHang}`} className="btn-icon delete">🗑</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
