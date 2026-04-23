import axios from '../tta_axios';

export const danhgiaApi = {
  getAll: (params) => axios.get('/api/tta_danhgia', { params }),
  delete: (id) => axios.delete(`/api/tta_danhgia/${id}`),
};
