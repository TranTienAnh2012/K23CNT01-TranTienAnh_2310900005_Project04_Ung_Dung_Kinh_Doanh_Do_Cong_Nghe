import axios from '../tta_axios';

// API quản lý đơn hàng (Admin)
export const donhangApi = {
  // Lấy danh sách toàn bộ đơn hàng
  getAll: (params) => axios.get('/api/tta_donhang', { params }),
  
  // Lấy chi tiết một đơn hàng
  getOne: (ma) => axios.get(`/api/tta_donhang/${ma}`),
  
  // Tạo đơn hàng mới (nếu cần)
  create: (data) => axios.post('/api/tta_donhang', data),
  
  // Cập nhật trạng thái đơn hàng (đã thanh toán, đang giao, v.v.)
  updateStatus: (ma, data) => axios.put(`/api/tta_donhang/${ma}/status`, data),
  
  // Xóa đơn hàng
  delete: (ma) => axios.delete(`/api/tta_donhang/${ma}`),
};
