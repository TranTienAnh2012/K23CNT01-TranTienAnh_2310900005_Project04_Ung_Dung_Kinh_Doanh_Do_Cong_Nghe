import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context để quản lý trạng thái đăng nhập trên toàn bộ ứng dụng
const AuthContext = createContext(null);

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái đang kiểm tra token

  // Kiểm tra token trong localStorage khi ứng dụng khởi chạy
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        setUser({ 
          id: payload.sub, 
          email: payload.email || 'user@gmail.com', 
          role: payload.vai_tro || 'user',
          name: payload.name || '',
          avatarUrl: payload.avatar_url || ''
        });
      } else {
        setUser({ email: 'admin@gmail.com', role: 'admin', name: 'Admin', avatarUrl: '' });
      }
    }
    setLoading(false); // Hoàn tất kiểm tra
  }, []);

  // Hàm xử lý khi đăng nhập thành công
  const login = (token) => {
    localStorage.setItem('token', token); // Lưu token vào trình duyệt
    const payload = parseJwt(token);
    if (payload) {
      setUser({ 
        id: payload.sub, 
        email: payload.email || 'user@gmail.com', 
        role: payload.vai_tro || 'user',
        name: payload.name || '',
        avatarUrl: payload.avatar_url || ''
      });
    } else {
      setUser({ email: 'admin@gmail.com', role: 'admin', name: 'Admin', avatarUrl: '' });
    }
  };

  // Hàm xử lý khi đăng xuất
  const logout = () => {
    localStorage.removeItem('token'); // Xóa token
    setUser(null); // Xóa thông tin người dùng
  };

  // Hàm cập nhật nóng thông tin user
  const updateUser = (data) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...data };
    });
  };

  return (
    // Cung cấp dữ liệu user và các hàm login/logout cho các component con
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext một cách thuận tiện
export const useAuth = () => useContext(AuthContext);
