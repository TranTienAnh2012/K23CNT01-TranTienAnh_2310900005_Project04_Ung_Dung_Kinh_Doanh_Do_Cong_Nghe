import axios from '../tta_axios';

export const donhangAdminApi = {
  getAll: (params) => axios.get('/api/tta_donhang', { params }),
  getOne: (ma) => axios.get(`/api/tta_donhang/${ma}`),
  create: (data) => axios.post('/api/tta_donhang', data),
  updateStatus: (ma, data) => axios.put(`/api/tta_donhang/${ma}/status`, data),
  delete: (ma) => axios.delete(`/api/tta_donhang/${ma}`),
};
