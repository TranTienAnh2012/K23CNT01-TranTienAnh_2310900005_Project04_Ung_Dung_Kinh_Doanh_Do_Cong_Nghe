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
  getOrder: (ma) => axios.get(`/api/client/tta_donhang/${ma}`),
  cancelOrder: (ma) => axios.put(`/api/client/tta_donhang/cancel/${ma}`),

  // Giỏ hàng
  getCart: () => axios.get('/api/client/tta_giohang'),
  addToCart: (data) => axios.post('/api/client/tta_giohang', data),
  updateCartItem: (id, data) => axios.put(`/api/client/tta_giohang/${id}`, data),
  deleteCartItem: (id) => axios.delete(`/api/client/tta_giohang/${id}`),

  // Đánh giá
  getProductReviews: (ma_sp) => axios.get(`/api/client/tta_danhgia/${ma_sp}`),
  checkCanReview: (ma_sp) => axios.get(`/api/client/tta_danhgia/check/${ma_sp}`),
  submitReview: (data) => axios.post('/api/client/tta_danhgia', data),

  // Voucher / Khuyến mãi
  getPublicVouchers: () => axios.get('/api/client/tta_voucher/public'),
  claimVoucher: (data) => axios.post('/api/client/tta_voucher/claim', data),
  getMyVouchers: () => axios.get('/api/client/tta_voucher/my-vouchers'),

  // Hồ sơ cá nhân / Profile
  getProfile: () => axios.get('/api/client/profile'),
  updateProfile: (data) => axios.put('/api/client/profile', data),
  changePassword: (data) => axios.put('/api/client/profile/change-password', data),
  uploadAvatar: (formData) => axios.post('/api/client/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // Dịch vụ cho thuê (Rental client APIs)
  getSanPhamThue: () => axios.get('/api/client/tta_sanpham_thue'),
  getDonHangThue: () => axios.get('/api/client/tta_donhang_thue'),
  createDonHangThue: (data) => axios.post('/api/client/tta_donhang_thue', data),
  cancelDonHangThue: (id) => axios.put(`/api/client/tta_donhang_thue/cancel/${id}`),

  // Dịch vụ tư vấn (Consulting client APIs)
  getDichVuTuVan: () => axios.get('/api/client/tta_dichvu_tuvan'),
  getStaffList: () => axios.get('/api/client/tta_staff'),
  getLichTuVan: () => axios.get('/api/client/tta_lich_tuvan'),
  bookLichTuVan: (data) => axios.post('/api/client/tta_lich_tuvan', data),
  cancelLichTuVan: (data) => axios.put('/api/client/tta_lich_tuvan/cancel', data),
};
