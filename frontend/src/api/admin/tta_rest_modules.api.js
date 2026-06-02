import axios from '../tta_axios';

export const dichvuTuvanApi = {
  getAll: (params) => axios.get('/api/tta_dichvu_tuvan', { params }),
  create: (data) => axios.post('/api/tta_dichvu_tuvan', data),
  update: (id, data) => axios.put(`/api/tta_dichvu_tuvan/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_dichvu_tuvan/${id}`),
};

export const lichTuvanApi = {
  getAll: (params) => axios.get('/api/tta_lich_tuvan', { params }),
  create: (data) => axios.post('/api/tta_lich_tuvan', data),
  update: (id, data) => axios.put(`/api/tta_lich_tuvan/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_lich_tuvan/${id}`),
};

export const lichTuvanNhanVienApi = {
  getAll: (params) => axios.get('/api/tta_lich_tuvan_nhanvien', { params }),
  create: (data) => axios.post('/api/tta_lich_tuvan_nhanvien', data),
  update: (id, data) => axios.put(`/api/tta_lich_tuvan_nhanvien/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_lich_tuvan_nhanvien/${id}`),
};

export const sanphamHinhAnhApi = {
  getAll: (params) => axios.get('/api/tta_sanpham_hinhanh', { params }),
  create: (data) => axios.post('/api/tta_sanpham_hinhanh', data),
  update: (id, data) => axios.put(`/api/tta_sanpham_hinhanh/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_sanpham_hinhanh/${id}`),
};

export const userVoucherApi = {
  getAll: (params) => axios.get('/api/tta_uservoucher', { params }),
  create: (data) => axios.post('/api/tta_uservoucher', data),
  update: (id, data) => axios.put(`/api/tta_uservoucher/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_uservoucher/${id}`),
};

export const giohangTamApi = {
  getAll: (params) => axios.get('/api/tta_giohangtam', { params }),
  create: (data) => axios.post('/api/tta_giohangtam', data),
  update: (id, data) => axios.put(`/api/tta_giohangtam/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_giohangtam/${id}`),
};

