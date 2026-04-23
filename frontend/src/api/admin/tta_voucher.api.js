import axios from '../tta_axios';

export const voucherApi = {
  getAll: (params) => axios.get('/api/tta_voucher', { params }),
  getOne: (id) => axios.get(`/api/tta_voucher/${id}`),
  create: (data) => axios.post('/api/tta_voucher', data),
  update: (id, data) => axios.put(`/api/tta_voucher/${id}`, data),
  delete: (id) => axios.delete(`/api/tta_voucher/${id}`),
};
