import axios from '../tta_axios';

export const shopApi = {
  // Sản phẩm công khai
  getProducts: (params) => axios.get('/api/client/tta_sanpham', { params }),
  getProductDetail: (ma) => axios.get(`/api/client/tta_sanpham/${ma}`),

  // Danh mục công khai
  getCategories: () => axios.get('/api/client/tta_danhmuc'),

  // Banner công khai
  getBanners: (params) => axios.get('/api/client/tta_banner', { params }),

  // Đặt hàng
  placeOrder: (data) => axios.post('/api/client/tta_donhang', data),
  getOrders: () => axios.get('/api/client/tta_donhang'),

  // Giỏ hàng
  getCart: () => axios.get('/api/client/tta_giohang'),
  addToCart: (data) => axios.post('/api/client/tta_giohang', data),
  updateCartItem: (id, data) => axios.put(`/api/client/tta_giohang/${id}`, data),
  deleteCartItem: (id) => axios.delete(`/api/client/tta_giohang/${id}`),

  // Đánh giá
  getProductReviews: (ma_sp) => axios.get(`/api/client/tta_danhgia/${ma_sp}`),
  checkCanReview: (ma_sp) => axios.get(`/api/client/tta_danhgia/check/${ma_sp}`),
  submitReview: (data) => axios.post('/api/client/tta_danhgia', data),
};
