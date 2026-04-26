import React, { useState } from 'react'; // Sử dụng React hooks
import { useNavigate } from 'react-router-dom'; // Hook để điều hướng giữa các trang
import { useAuth } from '../../context/AuthContext'; // Hook tùy chỉnh để quản lý xác thực
import axios from '../../api/tta_axios'; // Instance axios đã cấu hình


export default function TtaLoginPage() {
  // Quản lý trạng thái nhập liệu của email và password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth(); // Lấy hàm login từ AuthContext
  const navigate = useNavigate(); // Khởi tạo điều hướng

  // Hàm xử lý sự kiện khi người dùng nhấn nút "Đăng nhập"
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi load lại trang mặc định của form
    try {
      // Gửi yêu cầu POST tới API đăng nhập
      const res = await axios.post('/api/tta_auth/login', { email, password });
      
      // Nếu thành công, lưu token vào context/localStorage và cập nhật trạng thái đăng nhập
      login(res.data.data.token);
      
      // Chuyển hướng người dùng về trang quản trị
      navigate('/admin');
    } catch (err) {
      // Hiển thị thông báo lỗi nếu đăng nhập thất bại
      alert('Đăng nhập thất bại: ' + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>⚡ Dien Tu Store</h2>
          <p>Hệ thống quản trị G5</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="123"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}
