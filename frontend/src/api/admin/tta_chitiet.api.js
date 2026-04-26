import axios from '../tta_axios';

// API quản lý chi tiết đơn hàng (Admin)
export const chitietApi = {
  // Lấy toàn bộ danh sách chi tiết đơn hàng
  getAll: (params) => axios.get('/api/tta_chitiet_donhang', { params }),
  
  // Lấy chi tiết của một mục cụ thể
  getOne: (ma) => axios.get(`/api/tta_chitiet_donhang/${ma}`),
  
  // Cập nhật số lượng sản phẩm trong đơn hàng
  update: (ma, data) => axios.put(`/api/tta_chitiet_donhang/${ma}`, data),
  
  // Xóa sản phẩm khỏi đơn hàng
  delete: (ma) => axios.delete(`/api/tta_chitiet_donhang/${ma}`),
};
