import axios from '../tta_axios';

export const sanphamAdminApi = {
  // Lấy danh sách sản phẩm quản trị
  getAll: (params) => axios.get('/api/tta_sanpham', { params }),
  // Lấy chi tiết
  getOne: (ma) => axios.get(`/api/tta_sanpham/${ma}`),
  // Thêm mới
  create: (data) => axios.post('/api/tta_sanpham', data),
  // Sửa
  update: (ma, data) => axios.put(`/api/tta_sanpham/${ma}`, data),
  // Xóa
  delete: (ma) => axios.delete(`/api/tta_sanpham/${ma}`),
};
