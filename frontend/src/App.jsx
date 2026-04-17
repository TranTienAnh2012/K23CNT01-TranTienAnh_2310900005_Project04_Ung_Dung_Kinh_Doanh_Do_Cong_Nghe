import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/TtaProtectedRoute';

import AdminLayout from './components/tta_admin_layout';
import TtaLoginPage from './pages/auth/tta_login_page';

// Pages
import TtaDanhMucList      from './pages/danhmuc/tta_danhmuc_list';
import TtaSanPhamList      from './pages/sanpham/tta_sanpham_list';
import TtaUserList         from './pages/user/tta_user_list';

import TtaDonHangList      from './pages/donhang/tta_donhang_list';
import TtaDonHangThem      from './pages/donhang/tta_donhang_them';
import TtaDonHangSua       from './pages/donhang/tta_donhang_sua';
import TtaDonHangXoa       from './pages/donhang/tta_donhang_xoa';

import TtaChiTietDonHangList from './pages/chitiet/tta_chitietdonhang_list';
import TtaChiTietDonHangSua  from './pages/chitiet/tta_chitietdonhang_sua';
import TtaChiTietDonHangXoa  from './pages/chitiet/tta_chitietdonhang_xoa';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<TtaLoginPage />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<div>Dashboard Placeholder</div>} />
            
            <Route path="danh-muc"            element={<TtaDanhMucList />} />
            <Route path="san-pham"            element={<TtaSanPhamList />} />
            <Route path="user"                element={<TtaUserList />} />

            <Route path="don-hang"            element={<TtaDonHangList />} />
            <Route path="don-hang/them"       element={<TtaDonHangThem />} />
            <Route path="don-hang/edit/:ma"   element={<TtaDonHangSua />} />
            <Route path="don-hang/delete/:ma" element={<TtaDonHangXoa />} />

            <Route path="chi-tiet"            element={<TtaChiTietDonHangList />} />
            <Route path="chi-tiet/edit/:ma"   element={<TtaChiTietDonHangSua />} />
            <Route path="chi-tiet/delete/:ma" element={<TtaChiTietDonHangXoa />} />
          </Route>

          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
