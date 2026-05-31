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

// Helper function to decode JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Request interceptor to add JWT token
// Tự động chạy TRƯỚC KHI request được gửi đi: Lấy token từ localStorage gắn vào Header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Dynamic URL rewriting for employee (nhanvien) role
      try {
        const payload = parseJwt(token);
        if (payload && payload.vai_tro && payload.vai_tro.toLowerCase() === 'nhanvien') {
          const urlRewriteMap = {
            '/api/tta_sanpham_thue': '/api/nvk_sanpham_thue',
            '/api/tta_donhang_thue': '/api/nvk_donhang_thue',
            '/api/tta_chitiet_donhang_thue': '/api/nvk_chitiet_donhang_thue',
            '/api/tta_lich_su_thue': '/api/nvk_lich_su_thue',
            '/api/tta_dichvu_tuvan': '/api/nvk_dichvu_tuvan',
            '/api/tta_lich_tuvan': '/api/nvk_lich_tuvan',
            '/api/tta_lich_tuvan_nhanvien': '/api/nvk_nhanvien',
          };
          for (const [adminUrl, staffUrl] of Object.entries(urlRewriteMap)) {
            if (config.url && config.url.startsWith(adminUrl)) {
              config.url = config.url.replace(adminUrl, staffUrl);
              break;
            }
          }
        }
      } catch (err) {
        console.error('Error rewriting URL for staff role:', err);
      }
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
