import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/TtaProtectedRoute';

// --- LAYOUTS ---
import AdminLayout from './layouts/AdminLayout'; // Đường dẫn mới
import ClientLayout from './layouts/ClientLayout'; // Layout mới

// --- PAGES: AUTH ---
import NnhLoginPage from './pages/auth/nnh_login_page';
import NnhRegisterPage from './pages/auth/nnh_register_page';
import NvtClientHome from './pages/client/NvtClientHome';
import NvtClientSanPhamChiTiet from './pages/client/NvtSanPham/NvtClientSanPhamChiTiet';
import NvtClientDatHang from './pages/client/NvtDonHang/NvtClientDatHang';
import NvtClientLichSuDonHang from './pages/client/NvtDonHang/NvtClientLichSuDonHang';
import NvtClientTrangCaNhan from './pages/client/NvtTrangCaNhan/NvtClientTrangCaNhan';
import NvtClientGioHang from './pages/client/NvtGioHang/NvtClientGioHang';

// --- PAGES: ADMIN ---
import NnhDashboard from './pages/admin/dashboard/nnh_dashboard';
import NnhDanhMucList from './pages/admin/nnh_danhmuc/nnh_danhmuc_list';
import NnhDanhMucThem from './pages/admin/nnh_danhmuc/nnh_danhmuc_them';
import NnhDanhMucSua from './pages/admin/nnh_danhmuc/nnh_danhmuc_sua';
import NnhDanhMucXoa from './pages/admin/nnh_danhmuc/nnh_danhmuc_xoa';
import NnhBannerList from './pages/admin/nnh_banner/nnh_banner_list';
import NnhBannerThem from './pages/admin/nnh_banner/nnh_banner_them';
import NnhBannerSua from './pages/admin/nnh_banner/nnh_banner_sua';
import NnhSanPhamList from './pages/admin/nnh_sanpham/nnh_sanpham_list';
import NnhSanPhamThem from './pages/admin/nnh_sanpham/nnh_sanpham_them';
import NnhSanPhamSua from './pages/admin/nnh_sanpham/nnh_sanpham_sua';
import NnhSanPhamXoa from './pages/admin/nnh_sanpham/nnh_sanpham_xoa';
import NnhSanPhamChiTiet from './pages/admin/nnh_sanpham/nnh_sanpham_chitiet';
import NnhUserList from './pages/admin/nnh_nguoidung/nnh_user_list';
import NnhUserThem from './pages/admin/nnh_nguoidung/nnh_user_them';
import NnhUserSua from './pages/admin/nnh_nguoidung/nnh_user_sua';
import NnhUserXoa from './pages/admin/nnh_nguoidung/nnh_user_xoa';

import NnhThuocTinhList from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_list';
import NnhThuocTinhThem from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_them';
import NnhThuocTinhSua from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_sua';
import NnhThuocTinhXoa from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_xoa';
import NnhDanhMucThuocTinhList from './pages/admin/nnh_danhmuc_thuoctinh/nnh_danhmuc_thuoctinh_list';
import NnhGiaTriThuocTinhList from './pages/admin/nnh_giatrithuoctinh/nnh_giatrithuoctinh_list';
import NnhGiaTriThuocTinhForm from './pages/admin/nnh_giatrithuoctinh/nnh_giatrithuoctinh_form';

import NnhDonHangList from './pages/admin/nnh_donhang/nnh_donhang_list';
import NnhDonHangThem from './pages/admin/nnh_donhang/nnh_donhang_them';
import NnhDonHangSua from './pages/admin/nnh_donhang/nnh_donhang_sua';
import NnhDonHangXoa from './pages/admin/nnh_donhang/nnh_donhang_xoa';

import NnhChiTietDonHangList from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_list';
import NnhChiTietDonHangSua from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_sua';
import NnhChiTietDonHangXoa from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_xoa';

import NnhDanhGiaList from './pages/admin/nnh_danhgia/nnh_danhgia_list';
import NnhVoucherList from './pages/admin/nnh_voucher/nnh_voucher_list';
import NnhVoucherThem from './pages/admin/nnh_voucher/nnh_voucher_them';

import NnhThueSanPhamList from './pages/admin/nnh_thue_sanpham/nnh_thue_sanpham_list';
import NnhThueSanPhamThem from './pages/admin/nnh_thue_sanpham/nnh_thue_sanpham_them';
import NnhThueSanPhamSua from './pages/admin/nnh_thue_sanpham/nnh_thue_sanpham_sua';
import NnhThueDonHangList from './pages/admin/nnh_thue_donhang/nnh_thue_donhang_list';
import NnhThueDonHangThem from './pages/admin/nnh_thue_donhang/nnh_thue_donhang_them';
import NnhThueDonHangSua from './pages/admin/nnh_thue_donhang/nnh_thue_donhang_sua';
import NnhThueChiTietList from './pages/admin/nnh_thue_chitiet/nnh_thue_chitiet_list';
import NnhThueChiTietThem from './pages/admin/nnh_thue_chitiet/nnh_thue_chitiet_them';
import NnhThueChiTietSua from './pages/admin/nnh_thue_chitiet/nnh_thue_chitiet_sua';
import NnhThueLichSuList from './pages/admin/nnh_thue_lichsu/nnh_thue_lichsu_list';
import NnhThueLichSuThem from './pages/admin/nnh_thue_lichsu/nnh_thue_lichsu_them';
import NnhThueLichSuSua from './pages/admin/nnh_thue_lichsu/nnh_thue_lichsu_sua';

import NnhDichVuTuVanList from './pages/admin/nnh_dichvu_tuvan/nnh_dichvu_tuvan_list';
import NnhDichVuTuVanThem from './pages/admin/nnh_dichvu_tuvan/nnh_dichvu_tuvan_them';
import NnhDichVuTuVanSua from './pages/admin/nnh_dichvu_tuvan/nnh_dichvu_tuvan_sua';
import NnhLichTuVanList from './pages/admin/nnh_lich_tuvan/nnh_lich_tuvan_list';
import NnhLichTuVanThem from './pages/admin/nnh_lich_tuvan/nnh_lich_tuvan_them';
import NnhLichTuVanSua from './pages/admin/nnh_lich_tuvan/nnh_lich_tuvan_sua';
import NnhLichNhanVienList from './pages/admin/nnh_lich_tuvan_nhanvien/nnh_lich_tuvan_nhanvien_list';
import NnhLichNhanVienThem from './pages/admin/nnh_lich_tuvan_nhanvien/nnh_lich_tuvan_nhanvien_them';
import NnhLichNhanVienSua from './pages/admin/nnh_lich_tuvan_nhanvien/nnh_lich_tuvan_nhanvien_sua';
import NnhSanPhamHinhAnhList from './pages/admin/nnh_sanpham_hinhanh/nnh_sanpham_hinhanh_list';
import NnhSanPhamHinhAnhThem from './pages/admin/nnh_sanpham_hinhanh/nnh_sanpham_hinhanh_them';
import NnhSanPhamHinhAnhSua from './pages/admin/nnh_sanpham_hinhanh/nnh_sanpham_hinhanh_sua';
import NnhUserVoucherList from './pages/admin/nnh_user_voucher/nnh_user_voucher_list';
import NnhUserVoucherThem from './pages/admin/nnh_user_voucher/nnh_user_voucher_them';
import NnhUserVoucherSua from './pages/admin/nnh_user_voucher/nnh_user_voucher_sua';
import NnhGioHangTamList from './pages/admin/nnh_giohang_tam/nnh_giohang_tam_list';
import NnhGioHangTamThem from './pages/admin/nnh_giohang_tam/nnh_giohang_tam_them';
import NnhGioHangTamSua from './pages/admin/nnh_giohang_tam/nnh_giohang_tam_sua';

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
            <Route index element={<NvtClientHome />} />
            <Route path="san-pham/:ma" element={<NvtClientSanPhamChiTiet />} />
            <Route path="dat-hang/:ma" element={<NvtClientDatHang />} />
            <Route path="lich-su-don-hang" element={<NvtClientLichSuDonHang />} />
            <Route path="trang-ca-nhan" element={<NvtClientTrangCaNhan />} />
            <Route path="gio-hang" element={<NvtClientGioHang />} />
          </Route>

          {/* ADMIN ROUTES (Bảo vệ bởi ProtectedRoute) */}
          {/* Khi gặp đường dẫn /admin, React Router sẽ dựng cái khung AdminLayout lên trước. */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            
            {/* Nếu chỉ gõ /admin, tự động chuyển hướng sang /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Tất cả các Route con này chính là nội dung sẽ được ném vào vị trí <Outlet /> của AdminLayout */}
            <Route path="dashboard" element={<NnhDashboard />} />
            
            <Route path="danh-muc"            element={<NnhDanhMucList />} />
            <Route path="danh-muc/them"       element={<NnhDanhMucThem />} />
            <Route path="danh-muc/edit/:ma"   element={<NnhDanhMucSua />} />
            <Route path="danh-muc/delete/:ma" element={<NnhDanhMucXoa />} />
            <Route path="banner"              element={<NnhBannerList />} />
            <Route path="banner/them"         element={<NnhBannerThem />} />
            <Route path="banner/edit/:ma"     element={<NnhBannerSua />} />
            <Route path="san-pham"            element={<NnhSanPhamList />} />
            <Route path="san-pham/them"       element={<NnhSanPhamThem />} />
            <Route path="san-pham/edit/:ma"   element={<NnhSanPhamSua />} />
            <Route path="san-pham/delete/:ma" element={<NnhSanPhamXoa />} />
            <Route path="san-pham/view/:ma"   element={<NnhSanPhamChiTiet />} />
            <Route path="san-pham/thong-so/:ma" element={<NnhGiaTriThuocTinhForm />} />
            <Route path="user"                element={<NnhUserList />} />
            <Route path="user/them"           element={<NnhUserThem />} />
            <Route path="user/edit/:ma"       element={<NnhUserSua />} />
            <Route path="user/delete/:ma"     element={<NnhUserXoa />} />
            
            <Route path="thuoc-tinh"          element={<NnhThuocTinhList />} />
            <Route path="thuoc-tinh/them"     element={<NnhThuocTinhThem />} />
            <Route path="thuoc-tinh/edit/:ma" element={<NnhThuocTinhSua />} />
            <Route path="thuoc-tinh/delete/:ma" element={<NnhThuocTinhXoa />} />
            <Route path="danhmuc-thuoctinh"   element={<NnhDanhMucThuocTinhList />} />
            <Route path="giatri-thuoctinh"   element={<NnhGiaTriThuocTinhList />} />
            <Route path="giatri-thuoctinh/them" element={<NnhGiaTriThuocTinhForm />} />

            <Route path="don-hang"            element={<NnhDonHangList />} />
            <Route path="don-hang/them"       element={<NnhDonHangThem />} />
            <Route path="don-hang/edit/:ma"   element={<NnhDonHangSua />} />
            <Route path="don-hang/delete/:ma" element={<NnhDonHangXoa />} />

            <Route path="chi-tiet"            element={<NnhChiTietDonHangList />} />
            <Route path="chi-tiet/edit/:ma"   element={<NnhChiTietDonHangSua />} />
            <Route path="chi-tiet/delete/:ma" element={<NnhChiTietDonHangXoa />} />

            <Route path="danh-gia"            element={<NnhDanhGiaList />} />
            <Route path="voucher"             element={<NnhVoucherList />} />
            <Route path="voucher/them"        element={<NnhVoucherThem />} />

            <Route path="sanpham-thue" element={<NnhThueSanPhamList />} />
            <Route path="sanpham-thue/them" element={<NnhThueSanPhamThem />} />
            <Route path="sanpham-thue/edit/:id" element={<NnhThueSanPhamSua />} />
            <Route path="donhang-thue" element={<NnhThueDonHangList />} />
            <Route path="donhang-thue/them" element={<NnhThueDonHangThem />} />
            <Route path="donhang-thue/edit/:id" element={<NnhThueDonHangSua />} />
            <Route path="chitiet-thue" element={<NnhThueChiTietList />} />
            <Route path="chitiet-thue/them" element={<NnhThueChiTietThem />} />
            <Route path="chitiet-thue/edit/:id" element={<NnhThueChiTietSua />} />
            <Route path="lichsu-thue" element={<NnhThueLichSuList />} />
            <Route path="lichsu-thue/them" element={<NnhThueLichSuThem />} />
            <Route path="lichsu-thue/edit/:id" element={<NnhThueLichSuSua />} />

            <Route path="dichvu-tuvan" element={<NnhDichVuTuVanList />} />
            <Route path="dichvu-tuvan/them" element={<NnhDichVuTuVanThem />} />
            <Route path="dichvu-tuvan/edit/:id" element={<NnhDichVuTuVanSua />} />
            <Route path="lich-tuvan" element={<NnhLichTuVanList />} />
            <Route path="lich-tuvan/them" element={<NnhLichTuVanThem />} />
            <Route path="lich-tuvan/edit/:id" element={<NnhLichTuVanSua />} />
            <Route path="lich-nhanvien" element={<NnhLichNhanVienList />} />
            <Route path="lich-nhanvien/them" element={<NnhLichNhanVienThem />} />
            <Route path="lich-nhanvien/edit/:id" element={<NnhLichNhanVienSua />} />
            <Route path="sanpham-hinhanh" element={<NnhSanPhamHinhAnhList />} />
            <Route path="sanpham-hinhanh/them" element={<NnhSanPhamHinhAnhThem />} />
            <Route path="sanpham-hinhanh/edit/:id" element={<NnhSanPhamHinhAnhSua />} />
            <Route path="user-voucher" element={<NnhUserVoucherList />} />
            <Route path="user-voucher/them" element={<NnhUserVoucherThem />} />
            <Route path="user-voucher/edit/:id" element={<NnhUserVoucherSua />} />
            <Route path="giohang-tam" element={<NnhGioHangTamList />} />
            <Route path="giohang-tam/them" element={<NnhGioHangTamThem />} />
            <Route path="giohang-tam/edit/:id" element={<NnhGioHangTamSua />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
