import axios from '../tta_axios';

// 1. API Quản lý Thuộc tính chung (VD: Màu sắc, Kích thước)
export const thuoctinhApi = {
  // Lấy danh sách thuộc tính
  getAll: (params) => axios.get('/api/tta_thuoctinh', { params }),
  
  // Tạo thuộc tính mới
  create: (data) => axios.post('/api/tta_thuoctinh', data),
  
  // Cập nhật thuộc tính
  update: (ma, data) => axios.put(`/api/tta_thuoctinh/${ma}`, data),
  
  // Xóa thuộc tính
  delete: (ma) => axios.delete(`/api/tta_thuoctinh/${ma}`),
};

// 2. API Quản lý Cấu hình Thuộc tính theo Danh mục (VD: Laptop thì có CPU, RAM)
export const danhmucThuoctinhApi = {
  // Lấy danh sách liên kết Danh mục - Thuộc tính
  getAll: (params) => axios.get('/api/tta_danhmuc_thuoctinh', { params }),
  
  // Tạo liên kết mới
  create: (data) => axios.post('/api/tta_danhmuc_thuoctinh', data),
  
  // Cập nhật liên kết
  update: (id, data) => axios.put(`/api/tta_danhmuc_thuoctinh/${id}`, data),
  
  // Xóa liên kết
  delete: (id) => axios.delete(`/api/tta_danhmuc_thuoctinh/${id}`),

  // Lấy thuộc tính theo sản phẩm (từ danh mục)
  getBySanPham: (ma_sp) => axios.get(`/api/tta_danhmuc_thuoctinh/product/${ma_sp}`),
};

// 3. API Quản lý Giá trị Thuộc tính cụ thể của Sản phẩm (VD: iPhone 15 có RAM 8GB)
export const giatrithuoctinhApi = {
  // Lấy danh sách các giá trị thông số đã nhập
  getAll: (params) => axios.get('/api/tta_giatrithuoctinh', { params }),
  
  // Lưu giá trị thông số cho sản phẩm
  create: (data) => axios.post('/api/tta_giatrithuoctinh', data),
  
  // Cập nhật giá trị thông số
  update: (id, data) => axios.put(`/api/tta_giatrithuoctinh/${id}`, data),
  
  // Xóa giá trị thông số
  delete: (id) => axios.delete(`/api/tta_giatrithuoctinh/${id}`),
};
