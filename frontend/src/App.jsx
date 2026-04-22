import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/TtaProtectedRoute';

// --- LAYOUTS ---
import AdminLayout from './layouts/AdminLayout'; // Đường dẫn mới
import ClientLayout from './layouts/ClientLayout'; // Layout mới

// --- PAGES: AUTH ---
import TtaLoginPage from './pages/auth/tta_login_page';

// --- PAGES: ADMIN ---
import TtaDashboard from './pages/admin/dashboard/tta_dashboard';
import TtaDanhMucList from './pages/admin/tta_danhmuc/tta_danhmuc_list';
import TtaSanPhamList from './pages/admin/tta_sanpham/tta_sanpham_list';
import TtaUserList from './pages/admin/tta_nguoidung/tta_user_list';

import TtaThuocTinhList from './pages/admin/tta_thuoctinh/tta_thuoctinh_list';
import TtaDanhMucThuocTinhList from './pages/admin/tta_thuoctinh/tta_danhmuc_thuoctinh_list';
import TtaGiaTriThuocTinhList from './pages/admin/tta_thuoctinh/tta_giatrithuoctinh_list';
import TtaGiaTriThuocTinhThem from './pages/admin/tta_thuoctinh/tta_giatrithuoctinh_them';
import TtaGiaTriThuocTinhForm from './pages/admin/tta_thuoctinh/tta_giatrithuoctinh_form';

import TtaDonHangList from './pages/admin/tta_donhang/tta_donhang_list';
import TtaDonHangThem from './pages/admin/tta_donhang/tta_donhang_them';
import TtaDonHangSua from './pages/admin/tta_donhang/tta_donhang_sua';
import TtaDonHangXoa from './pages/admin/tta_donhang/tta_donhang_xoa';

import TtaChiTietDonHangList from './pages/admin/tta_chitietdonhang/tta_chitietdonhang_list';
import TtaChiTietDonHangSua from './pages/admin/tta_chitietdonhang/tta_chitietdonhang_sua';
import TtaChiTietDonHangXoa from './pages/admin/tta_chitietdonhang/tta_chitietdonhang_xoa';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* CLIENT ROUTES */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<div style={{ textAlign: 'center', padding: '100px' }}><h1>Chào mừng đến với G5 TECH STORE!</h1><p>Website đang được chuẩn hóa...</p></div>} />
            <Route path="login" element={<TtaLoginPage />} />
          </Route>

          {/* ADMIN ROUTES (Bảo vệ bởi ProtectedRoute) */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<TtaDashboard />} />
            
            <Route path="danh-muc"            element={<TtaDanhMucList />} />
            <Route path="san-pham"            element={<TtaSanPhamList />} />
            <Route path="san-pham/thong-so/:ma" element={<TtaGiaTriThuocTinhForm />} />
            <Route path="user"                element={<TtaUserList />} />
            
            <Route path="thuoc-tinh"          element={<TtaThuocTinhList />} />
            <Route path="danhmuc-thuoctinh"   element={<TtaDanhMucThuocTinhList />} />
            <Route path="giatri-thuoctinh"   element={<TtaGiaTriThuocTinhList />} />
            <Route path="giatri-thuoctinh/them" element={<TtaGiaTriThuocTinhThem />} />

            <Route path="don-hang"            element={<TtaDonHangList />} />
            <Route path="don-hang/them"       element={<TtaDonHangThem />} />
            <Route path="don-hang/edit/:ma"   element={<TtaDonHangSua />} />
            <Route path="don-hang/delete/:ma" element={<TtaDonHangXoa />} />

            <Route path="chi-tiet"            element={<TtaChiTietDonHangList />} />
            <Route path="chi-tiet/edit/:ma"   element={<TtaChiTietDonHangSua />} />
            <Route path="chi-tiet/delete/:ma" element={<TtaChiTietDonHangXoa />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
