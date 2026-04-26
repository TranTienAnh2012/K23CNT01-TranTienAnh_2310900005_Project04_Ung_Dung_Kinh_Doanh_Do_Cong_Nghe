import axios from '../tta_axios';

export const shopApi = {
  // Sản phẩm công khai
  getProducts: (params) => axios.get('/api/client/tta_sanpham', { params }),
  getProductDetail: (ma) => axios.get(`/api/client/tta_sanpham/${ma}`),

  // Danh mục công khai
  getCategories: () => axios.get('/api/client/tta_danhmuc'),

  // Đặt hàng
  placeOrder: (data) => axios.post('/api/client/tta_donhang', data),
};
