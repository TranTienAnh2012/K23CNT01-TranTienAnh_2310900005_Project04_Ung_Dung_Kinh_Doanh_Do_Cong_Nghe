import axios from '../tta_axios';

// API quản lý sản phẩm (Admin)
export const sanphamApi = {
  // Lấy danh sách sản phẩm quản trị (có phân trang/tìm kiếm)
  getAll: (params) => axios.get('/api/tta_sanpham', { params }),
  
  // Lấy chi tiết thông tin một sản phẩm
  getOne: (ma) => axios.get(`/api/tta_sanpham/${ma}`),
  
  // Thêm mới sản phẩm vào hệ thống
  create: (data) => axios.post('/api/tta_sanpham', data),
  
  // Cập nhật thông tin sản phẩm (Giá, số lượng, mô tả...)
  update: (ma, data) => axios.put(`/api/tta_sanpham/${ma}`, data),
  
  // Xóa sản phẩm khỏi hệ thống
  delete: (ma) => axios.delete(`/api/tta_sanpham/${ma}`),
};
