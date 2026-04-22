import axios from '../tta_axios';

export const chitietAdminApi = {
  getAll: (params) => axios.get('/api/tta_chitiet_donhang', { params }),
  updateQty: (ma, data) => axios.put(`/api/tta_chitiet_donhang/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_chitiet_donhang/${ma}`),
};
