import axios from '../tta_axios';

// API Upload tệp tin
export const uploadApi = {
  /**
   * Tải ảnh lên máy chủ
   * @param {File} file - Tệp tin ảnh từ input
   * @returns {Promise} - Trả về đường dẫn ảnh trên máy chủ
   */
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
