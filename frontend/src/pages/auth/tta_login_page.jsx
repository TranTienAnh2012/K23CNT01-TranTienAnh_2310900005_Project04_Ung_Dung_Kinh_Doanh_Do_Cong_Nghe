import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/tta_axios';

export default function TtaLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tta_auth/login', { email, password });
      login(res.data.data.token);
      navigate('/admin');
    } catch (err) {
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
