import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { danhmucApi } from '../../../api/tta_api';

export default function TtaDanhMucList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await danhmucApi.getAll();
      setCategories(res.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Đang tải danh mục...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📁 Danh mục sản phẩm ({categories.length})</h3>
          <Link to="/admin/danh-muc/them" className="btn btn-primary">
            <span>➕</span> Thêm mới
          </Link>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN DANH MỤC</th>
                <th>MÔ TẢ</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((dm) => (
                <tr key={dm.MaDanhMuc}>
                  <td>#{dm.MaDanhMuc}</td>
                  <td><strong>{dm.TenDanhMuc}</strong></td>
                  <td>{dm.MoTa || '(Không có mô tả)'}</td>
                  <td className="actions">
                    <Link to={`/admin/danh-muc/edit/${dm.MaDanhMuc}`} className="btn-icon edit">✎ Sửa</Link>
                    <Link to={`/admin/danh-muc/delete/${dm.MaDanhMuc}`} className="btn-icon delete">🗑 Xóa</Link>
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
