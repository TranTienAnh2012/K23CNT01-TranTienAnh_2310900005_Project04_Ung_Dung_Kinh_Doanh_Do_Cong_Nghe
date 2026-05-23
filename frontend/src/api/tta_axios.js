import axios from 'axios';

// =========================================================================
// LỚP 1 (FRONTEND): CẤU HÌNH GỐC (Axios Instance)
// Mọi cuộc gọi API từ Frontend xuống Backend đều đi qua file này.
// File này thiết lập địa chỉ gốc của server backend (localhost:5000).
// Đóng vai trò "người gác cổng" bằng cách tự động gắn Token vào Request.
// =========================================================================

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
});

// Request interceptor to add JWT token
// Tự động chạy TRƯỚC KHI request được gửi đi: Lấy token từ localStorage gắn vào Header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
// Tự động chạy SAU KHI backend trả kết quả về: Xử lý lỗi bảo mật, hết hạn token...
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Token hết hạn -> Tự động đuổi về trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default instance;
