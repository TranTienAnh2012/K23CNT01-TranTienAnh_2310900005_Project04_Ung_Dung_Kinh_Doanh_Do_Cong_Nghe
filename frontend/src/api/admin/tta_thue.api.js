import axios from '../tta_axios';

export const sanphamThueApi = {
  getAll: (params) => axios.get('/api/tta_sanpham_thue', { params }),
  create: (data) => axios.post('/api/tta_sanpham_thue', data),
  update: (id, data) => axios.put(`/api/tta_sanpham_thue/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_sanpham_thue/${id}`),
};

export const donhangThueApi = {
  getAll: (params) => axios.get('/api/tta_donhang_thue', { params }),
  create: (data) => axios.post('/api/tta_donhang_thue', data),
  update: (id, data) => axios.put(`/api/tta_donhang_thue/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_donhang_thue/${id}`),
};

export const chitietThueApi = {
  getAll: (params) => axios.get('/api/tta_chitiet_donhang_thue', { params }),
  create: (data) => axios.post('/api/tta_chitiet_donhang_thue', data),
  update: (id, data) => axios.put(`/api/tta_chitiet_donhang_thue/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_chitiet_donhang_thue/${id}`),
};

export const lichsuThueApi = {
  getAll: (params) => axios.get('/api/tta_lich_su_thue', { params }),
  create: (data) => axios.post('/api/tta_lich_su_thue', data),
  update: (id, data) => axios.put(`/api/tta_lich_su_thue/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_lich_su_thue/${id}`),
};

