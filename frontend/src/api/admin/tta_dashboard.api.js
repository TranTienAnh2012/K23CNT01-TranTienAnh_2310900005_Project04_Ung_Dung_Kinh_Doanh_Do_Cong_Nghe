import axios from '../tta_axios';

/**
 * API quản lý Dashboard
 * Cung cấp các phương thức lấy dữ liệu tổng hợp cho trang chủ quản trị
 */
export const dashboardApi = {
  /**
   * Lấy dữ liệu tổng hợp gồm các chỉ số KPI và hoạt động gần đây
   * @returns {Promise} Trả về stats (counts) và recentActivities (array)
   */
  getSummary: () => axios.get('/api/dashboard'),
};
