import axios from './tta_axios';

export const authApi = {
  login: (data) => axios.post('/api/tta_auth/login', data),
};

export const danhmucApi = {
  getAll: (params) => axios.get('/api/tta_danhmuc', { params }),
  getOne: (ma) => axios.get(`/api/tta_danhmuc/${ma}`),
  create: (data) => axios.post('/api/tta_danhmuc', data),
  update: (ma, data) => axios.put(`/api/tta_danhmuc/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_danhmuc/${ma}`),
};

export const sanphamApi = {
  getAll: (params) => axios.get('/api/tta_sanpham', { params }),
  getOne: (ma) => axios.get(`/api/tta_sanpham/${ma}`),
  create: (data) => axios.post('/api/tta_sanpham', data),
  update: (ma, data) => axios.put(`/api/tta_sanpham/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_sanpham/${ma}`),
};

export const userApi = {
  getAll: (params) => axios.get('/api/tta_user', { params }),
  getOne: (ma) => axios.get(`/api/tta_user/${ma}`),
  create: (data) => axios.post('/api/tta_user', data),
  update: (ma, data) => axios.put(`/api/tta_user/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_user/${ma}`),
};

export const chitietApi = {
  getAll: (params) => axios.get('/api/tta_chitiet_donhang', { params }),
  getOne: (ma) => axios.get(`/api/tta_chitiet_donhang/${ma}`),
  update: (ma, data) => axios.put(`/api/tta_chitiet_donhang/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_chitiet_donhang/${ma}`),
};

export const donhangApi = {
  getAll: (params) => axios.get('/api/tta_donhang', { params }),
  getOne: (ma) => axios.get(`/api/tta_donhang/${ma}`),
  create: (data) => axios.post('/api/tta_donhang', data),
  updateStatus: (ma, data) => axios.put(`/api/tta_donhang/${ma}/status`, data),
  delete: (ma) => axios.delete(`/api/tta_donhang/${ma}`),
};
