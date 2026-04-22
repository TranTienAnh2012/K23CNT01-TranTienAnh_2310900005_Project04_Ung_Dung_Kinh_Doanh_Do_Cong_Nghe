import axios from '../tta_axios';

export const danhmucAdminApi = {
  getAll: (params) => axios.get('/api/tta_danhmuc', { params }),
  getOne: (ma) => axios.get(`/api/tta_danhmuc/${ma}`),
  create: (data) => axios.post('/api/tta_danhmuc', data),
  update: (ma, data) => axios.put(`/api/tta_danhmuc/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_danhmuc/${ma}`),
};
