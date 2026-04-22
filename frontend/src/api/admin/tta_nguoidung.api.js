import axios from '../tta_axios';

export const nguoidungAdminApi = {
  getAll: (params) => axios.get('/api/tta_user', { params }),
  getOne: (ma) => axios.get(`/api/tta_user/${ma}`),
  create: (data) => axios.post('/api/tta_user', data),
  update: (ma, data) => axios.put(`/api/tta_user/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_user/${ma}`),
};
