import axios from '../tta_axios';

// API quản lý danh mục sản phẩm (Admin)
export const danhmucApi = {
  // Lấy danh sách danh mục
  getAll: (params) => axios.get('/api/tta_danhmuc', { params }),
  
  // Lấy chi tiết một danh mục
  getOne: (ma) => axios.get(`/api/tta_danhmuc/${ma}`),
  
  // Tạo danh mục mới
  create: (data) => axios.post('/api/tta_danhmuc', data),
  
  // Cập nhật thông tin danh mục
  update: (ma, data) => axios.put(`/api/tta_danhmuc/${ma}`, data),
  
  // Xóa danh mục
  delete: (ma) => axios.delete(`/api/tta_danhmuc/${ma}`),
};
