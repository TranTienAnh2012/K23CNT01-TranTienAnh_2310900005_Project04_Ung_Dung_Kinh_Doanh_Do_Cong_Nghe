import React, { useState, useEffect } from 'react';
import { userApi } from '../../../api/tta_api';

export default function TtaUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Đang tải người dùng...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">👥 Quản lý người dùng ({users.length})</h3>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>HỌ TÊN</th>
                <th>EMAIL</th>
                <th>VAI TRÒ</th>
                <th>NGÀY ĐĂNG KÝ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.MaNguoiDung}>
                  <td>#{u.MaNguoiDung}</td>
                  <td><strong>{u.HoTen}</strong></td>
                  <td>{u.Email}</td>
                  <td>
                    <span className={`role-badge ${u.VaiTro === 'admin' ? 'admin' : 'user'}`}>
                      {u.VaiTro === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td>{new Date(u.NgayDangKy).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
