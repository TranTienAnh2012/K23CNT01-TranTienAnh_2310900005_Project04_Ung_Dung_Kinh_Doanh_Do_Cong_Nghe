import axios from '../tta_axios';

// API quản lý người dùng / tài khoản (Admin)
export const userApi = {
  // Lấy danh sách người dùng
  getAll: (params) => axios.get('/api/tta_user', { params }),
  
  // Lấy thông tin chi tiết một người dùng
  getOne: (ma) => axios.get(`/api/tta_user/${ma}`),
  
  // Tạo tài khoản mới
  create: (data) => axios.post('/api/tta_user', data),
  
  // Cập nhật thông tin người dùng
  update: (ma, data) => axios.put(`/api/tta_user/${ma}`, data),
  
  // Xóa tài khoản
  delete: (ma) => axios.delete(`/api/tta_user/${ma}`),
};
