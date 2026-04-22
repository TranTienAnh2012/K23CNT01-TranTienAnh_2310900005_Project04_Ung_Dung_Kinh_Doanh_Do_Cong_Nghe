import axios from '../tta_axios';

export const thuoctinhAdminApi = {
  // Thuộc tính chung
  getAll: (params) => axios.get('/api/tta_thuoctinh', { params }),
  create: (data) => axios.post('/api/tta_thuoctinh', data),
  update: (ma, data) => axios.put(`/api/tta_thuoctinh/${ma}`, data),
  delete: (ma) => axios.delete(`/api/tta_thuoctinh/${ma}`),

  // Danh mục thuộc tính (Set)
  getSets: (params) => axios.get('/api/tta_danhmuc_thuoctinh', { params }),
  createSet: (data) => axios.post('/api/tta_danhmuc_thuoctinh', data),
  updateSet: (id, data) => axios.put(`/api/tta_danhmuc_thuoctinh/${id}`, data),
  deleteSet: (id) => axios.delete(`/api/tta_danhmuc_thuoctinh/${id}`),

  // Giá trị thuộc tính
  getValues: (params) => axios.get('/api/tta_giatrithuoctinh', { params }),
  saveValue: (data) => axios.post('/api/tta_giatrithuoctinh', data),
  updateValue: (id, data) => axios.put(`/api/tta_giatrithuoctinh/${id}`, data),
  deleteValue: (id) => axios.delete(`/api/tta_giatrithuoctinh/${id}`),
};
