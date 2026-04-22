import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { thuoctinhApi } from '../../../api/tta_api';

export default function TtaThuocTinhList() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await thuoctinhApi.getAll();
      setAttributes(res.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  if (loading) return <div>Đang tải thuộc tính...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🏷️ Danh sách thuộc tính ({attributes.length})</h3>
          <Link to="/admin/thuoc-tinh/them" className="btn btn-primary">
            <span>➕</span> Thêm mới
          </Link>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN THUỘC TÍNH</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((tt) => (
                <tr key={tt.ThuocTinhID}>
                  <td>#{tt.ThuocTinhID}</td>
                  <td><strong>{tt.TenThuocTinh}</strong></td>
                  <td className="actions">
                    <Link to={`/admin/thuoc-tinh/edit/${tt.ThuocTinhID}`} className="btn-icon edit">✎ Sửa</Link>
                    <Link to={`/admin/thuoc-tinh/delete/${tt.ThuocTinhID}`} className="btn-icon delete">🗑 Xóa</Link>
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
