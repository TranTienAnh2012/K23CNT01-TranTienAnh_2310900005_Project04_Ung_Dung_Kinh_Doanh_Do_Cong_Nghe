import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/TtaProtectedRoute';

// --- LAYOUTS ---
import AdminLayout from './layouts/AdminLayout'; // Đường dẫn mới
import ClientLayout from './layouts/ClientLayout'; // Layout mới

// --- PAGES: AUTH ---
import NnhLoginPage from './pages/auth/nnh_login_page';
import NnhRegisterPage from './pages/auth/nnh_register_page';
import NnhHomePage from './pages/shop/NnhHomePage';

// --- PAGES: ADMIN ---
import NnhDashboard from './pages/admin/dashboard/nnh_dashboard';
import NnhDanhMucList from './pages/admin/nnh_danhmuc/nnh_danhmuc_list';
import NnhSanPhamList from './pages/admin/nnh_sanpham/nnh_sanpham_list';
import NnhUserList from './pages/admin/nnh_nguoidung/nnh_user_list';

import NnhThuocTinhList from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_list';
import NnhDanhMucThuocTinhList from './pages/admin/nnh_thuoctinh/nnh_danhmuc_thuoctinh_list';
import NnhGiaTriThuocTinhList from './pages/admin/nnh_thuoctinh/nnh_giatrithuoctinh_list';
import NnhGiaTriThuocTinhThem from './pages/admin/nnh_thuoctinh/nnh_giatrithuoctinh_them';
import NnhGiaTriThuocTinhForm from './pages/admin/nnh_thuoctinh/nnh_giatrithuoctinh_form';

import NnhDonHangList from './pages/admin/nnh_donhang/nnh_donhang_list';
import NnhDonHangThem from './pages/admin/nnh_donhang/nnh_donhang_them';
import NnhDonHangSua from './pages/admin/nnh_donhang/nnh_donhang_sua';
import NnhDonHangXoa from './pages/admin/nnh_donhang/nnh_donhang_xoa';

import NnhChiTietDonHangList from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_list';
import NnhChiTietDonHangSua from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_sua';
import NnhChiTietDonHangXoa from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_xoa';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* AUTH ROUTES (Standalone) */}
          <Route path="/login" element={<NnhLoginPage />} />
          <Route path="/register" element={<NnhRegisterPage />} />

          {/* CLIENT ROUTES */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<NnhHomePage />} />
          </Route>

          {/* ADMIN ROUTES (Bảo vệ bởi ProtectedRoute) */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<NnhDashboard />} />
            
            <Route path="danh-muc"            element={<NnhDanhMucList />} />
            <Route path="san-pham"            element={<NnhSanPhamList />} />
            <Route path="san-pham/thong-so/:ma" element={<NnhGiaTriThuocTinhForm />} />
            <Route path="user"                element={<NnhUserList />} />
            
            <Route path="thuoc-tinh"          element={<NnhThuocTinhList />} />
            <Route path="danhmuc-thuoctinh"   element={<NnhDanhMucThuocTinhList />} />
            <Route path="giatri-thuoctinh"   element={<NnhGiaTriThuocTinhList />} />
            <Route path="giatri-thuoctinh/them" element={<NnhGiaTriThuocTinhThem />} />

            <Route path="don-hang"            element={<NnhDonHangList />} />
            <Route path="don-hang/them"       element={<NnhDonHangThem />} />
            <Route path="don-hang/edit/:ma"   element={<NnhDonHangSua />} />
            <Route path="don-hang/delete/:ma" element={<NnhDonHangXoa />} />

            <Route path="chi-tiet"            element={<NnhChiTietDonHangList />} />
            <Route path="chi-tiet/edit/:ma"   element={<NnhChiTietDonHangSua />} />
            <Route path="chi-tiet/delete/:ma" element={<NnhChiTietDonHangXoa />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
