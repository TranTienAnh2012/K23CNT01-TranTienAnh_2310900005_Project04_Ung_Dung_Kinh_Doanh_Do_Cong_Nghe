import axios from '../tta_axios';

// =========================================================================
// LỚP 2 (FRONTEND): ĐỊNH NGHĨA CÁC API THEO CHỨC NĂNG (API Modules)
// Thay vì viết URL rải rác trong Component, các API được gom lại theo module.
// File này cung cấp các phương thức CRUD chuẩn (GET, POST, PUT, DELETE) cho Banner.
// Component ở Lớp 3 chỉ cần gọi "bannerApi.getAll()" thay vì viết lại axios.get('/api/tta_banner').
// =========================================================================

// API quản lý banner (Admin)
export const bannerApi = {
  // Lấy danh sách banner (sẽ gọi về Backend qua axios cấu hình sẵn)
  getAll: (params) => axios.get('/api/tta_banner', { params }),
  
  // Lấy chi tiết một banner
  getOne: (id) => axios.get(`/api/tta_banner/${id}`),
  
  // Tạo banner mới
  create: (data) => axios.post('/api/tta_banner', data),
  
  // Cập nhật banner
  update: (id, data) => axios.put(`/api/tta_banner/${id}`, data),
  
  // Xóa banner
  delete: (id) => axios.delete(`/api/tta_banner/${id}`),
};
