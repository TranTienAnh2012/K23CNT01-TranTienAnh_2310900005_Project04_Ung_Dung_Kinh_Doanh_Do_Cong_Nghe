import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanphamApi } from '../../api/tta_api';

export default function TtaSanPhamList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async (q = '') => {
    setLoading(true);
    try {
      const res = await sanphamApi.getAll({ q });
      setProducts(res.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '/placeholder-prod.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div>Đang tải sản phẩm...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📦 Danh sách sản phẩm ({products.length})</h3>
          <div className="header-actions">
            <form className="search-box" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">Tìm</button>
            </form>
            <Link to="/admin/san-pham/them" className="btn btn-primary">
              <span>➕</span> Thêm mới
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>HÌNH</th>
                <th>TÊN SẢN PHẨM</th>
                <th>DANH MỤC</th>
                <th>GIÁ GỐC</th>
                <th>GIÁ BÁN</th>
                <th>SỐ LƯỢNG</th>
                <th>LOẠI</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {products.map((sp) => (
                <tr key={sp.MaSanPham}>
                  <td>
                    <img src={getImageUrl(sp.HinhAnh)} alt={sp.TenSanPham} className="prod-thumb" />
                  </td>
                  <td>
                    <div className="prod-name-cell">
                      <strong>{sp.TenSanPham}</strong>
                      <small>{sp.brand || 'xiaomi'}</small>
                    </div>
                  </td>
                  <td>
                    <span className="badge-outline">{sp.TenDanhMuc}</span>
                  </td>
                  <td className="price-old">{formatPrice(sp.Gia)}</td>
                  <td className="price-new">{formatPrice(sp.GiaBan)}</td>
                  <td>{sp.SoLuongTon}</td>
                  <td>Cả hai</td>
                  <td>
                    <span className={`status-pill ${sp.TrangThai ? 'active' : 'inactive'}`}>
                      {sp.TrangThai ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/admin/san-pham/view/${sp.MaSanPham}`} className="btn-icon">👁️ Xem</Link>
                    <Link to={`/admin/san-pham/edit/${sp.MaSanPham}`} className="btn-icon edit">✎ Sửa</Link>
                    <Link to={`/admin/san-pham/delete/${sp.MaSanPham}`} className="btn-icon delete">🗑 Xóa</Link>
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
