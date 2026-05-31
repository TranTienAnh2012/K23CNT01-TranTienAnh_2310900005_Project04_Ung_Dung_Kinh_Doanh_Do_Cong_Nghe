from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# =========================================================================
# OOP TRONG QUẢN LÝ CSDL (ORM - Object Relational Mapping)
# Mỗi bảng trong CSDL được đại diện bởi một Class (Lớp).
# Mỗi dòng dữ liệu được truy vấn ra sẽ biến thành một Object (Đối tượng).
# =========================================================================

# OOP: Tính kế thừa (Class NguoiDung kế thừa các đặc tính từ class Base của SQLAlchemy)
class NguoiDung(Base):
    __tablename__ = 'G5_nguoidung'

    # OOP: Các thuộc tính (Attributes) của đối tượng NguoiDung
    G5_MaNguoiDung = Column(Integer, primary_key=True, autoincrement=True)
    G5_TenDangNhap = Column(String(50), unique=True, nullable=False)
    G5_MatKhau = Column(String(255), nullable=False)
    G5_HoTen = Column(String(255), nullable=False)
    G5_Email = Column(String(255), unique=True, nullable=False)
    G5_SoDienThoai = Column(String(20))
    G5_DiaChi = Column(Text)
    G5_VaiTro = Column(String(20), default='user')
    G5_NgayTao = Column(DateTime, default=datetime.utcnow)
    G5_IsDeleted = Column(Integer, default=0)

    # OOP: Thể hiện mối quan hệ giữa các đối tượng (1 NguoiDung có nhiều DonHang)
    don_hangs = relationship('DonHang', back_populates='nguoi_dung')

class DanhMuc(Base):
    __tablename__ = 'G5_danhmuc'

    G5_MaDanhMuc = Column(Integer, primary_key=True, autoincrement=True)
    G5_TenDanhMuc = Column(String(255), nullable=False)
    G5_MoTa = Column(Text)
    G5_TrangThai = Column(Integer, default=1)
    G5_NgayTao = Column(DateTime, default=datetime.utcnow)
    G5_IsDeleted = Column(Integer, default=0)

    san_phams = relationship('SanPham', back_populates='danh_muc')

class SanPham(Base):
    __tablename__ = 'G5_sanpham'

    G5_MaSanPham = Column(Integer, primary_key=True, autoincrement=True)
    G5_TenSanPham = Column(String(255), nullable=False)
    G5_MaDanhMuc = Column(Integer, ForeignKey('G5_danhmuc.G5_MaDanhMuc'))
    G5_GiaGoc = Column(Numeric(18, 2), nullable=False)
    G5_GiaBan = Column(Numeric(18, 2), nullable=False)
    G5_SoLuongTon = Column(Integer, default=0)
    G5_MoTa = Column(Text)
    G5_HinhAnh = Column(String(500))
    G5_TrangThai = Column(Integer, default=1)
    G5_NgayTao = Column(DateTime, default=datetime.utcnow)
    G5_IsDeleted = Column(Integer, default=0)

    danh_muc = relationship('DanhMuc', back_populates='san_phams')
    chi_tiet_don_hangs = relationship('ChiTietDonHang', back_populates='san_pham')

class DonHang(Base):
    __tablename__ = 'G5_donhang'

    G5_MaDonHang = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaNguoiDung = Column(Integer, ForeignKey('G5_nguoidung.G5_MaNguoiDung'))
    G5_NgayDat = Column(DateTime, default=datetime.utcnow)
    G5_TongTien = Column(Numeric(18, 2), nullable=False)
    G5_TrangThai = Column(String(50), default='pending')
    G5_DiaChiGiaoHang = Column(Text)
    G5_GhiChu = Column(Text)
    G5_IsDeleted = Column(Integer, default=0)

    nguoi_dung = relationship('NguoiDung', back_populates='don_hangs')
    chi_tiet_don_hangs = relationship('ChiTietDonHang', back_populates='don_hang')

class ChiTietDonHang(Base):
    __tablename__ = 'G5_chitiet_donhang'

    G5_MaChiTiet = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaDonHang = Column(Integer, ForeignKey('G5_donhang.G5_MaDonHang'))
    G5_MaSanPham = Column(Integer, ForeignKey('G5_sanpham.G5_MaSanPham'))
    G5_SoLuong = Column(Integer, nullable=False)
    G5_DonGia = Column(Numeric(18, 2), nullable=False)
    G5_ThanhTien = Column(Numeric(18, 2), nullable=False)

    don_hang = relationship('DonHang', back_populates='chi_tiet_don_hangs')
    san_pham = relationship('SanPham', back_populates='chi_tiet_don_hangs')

class ThuocTinh(Base):
    __tablename__ = 'G5_thuoctinh'

    G5_MaThuocTinh = Column(Integer, primary_key=True, autoincrement=True)
    G5_TenThuocTinh = Column(String(255), nullable=False)
    G5_MoTa = Column(Text)
    G5_IsDeleted = Column(Integer, default=0)

class GiaTriThuocTinh(Base):
    __tablename__ = 'G5_giatrithuoctinh'

    G5_MaGiaTri = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaThuocTinh = Column(Integer, ForeignKey('G5_thuoctinh.G5_MaThuocTinh'))
    G5_GiaTri = Column(String(255), nullable=False)
    G5_IsDeleted = Column(Integer, default=0)

class DanhMucThuocTinh(Base):
    __tablename__ = 'G5_danhmuc_thuoctinh'

    G5_MaDanhMucThuocTinh = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaDanhMuc = Column(Integer, ForeignKey('G5_danhmuc.G5_MaDanhMuc'))
    G5_MaThuocTinh = Column(Integer, ForeignKey('G5_thuoctinh.G5_MaThuocTinh'))
    G5_IsDeleted = Column(Integer, default=0)

class SanPhamThue(Base):
    __tablename__ = 'G5_sanpham_thue'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaSanPham = Column(Integer, ForeignKey('G5_sanpham.G5_MaSanPham'))
    G5_GiaThueNgay = Column(Numeric(18, 2))
    G5_GiaThueGio = Column(Numeric(18, 2))
    G5_SoLuongChoThue = Column(Integer)
    G5_TienCoc = Column(Numeric(18, 2))

    san_pham = relationship('SanPham', backref='sanpham_thue')

class DonHangThue(Base):
    __tablename__ = 'G5_donhang_thue'

    G5_MaDonThue = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaNguoiDung = Column(Integer, ForeignKey('G5_nguoidung.G5_MaNguoiDung'))
    G5_MaNhanVien = Column(Integer)
    G5_NgayBatDau = Column(DateTime)
    G5_NgayKetThuc = Column(DateTime)
    G5_TongTien = Column(Numeric(18, 2))
    G5_TrangThai = Column(String(50))
    G5_TienCoc = Column(Numeric(18, 2))
    G5_TrangThaiThanhToan = Column(String(50))
    G5_NgayTraThucTe = Column(DateTime)
    G5_HoTenNguoiNhan = Column(String(255))
    G5_SoDienThoaiNguoiNhan = Column(String(50))
    G5_DiaChiNguoiNhan = Column(String(500))
    G5_EmailNguoiNhan = Column(String(255))
    G5_GhiChu = Column(Text)
    G5_IsDeleted = Column(Integer, default=0)
    G5_DeletedAt = Column(DateTime)
    G5_DeletedBy = Column(Integer)

    nguoi_dung = relationship('NguoiDung')

class ChiTietDonHangThue(Base):
    __tablename__ = 'G5_chitiet_donhang_thue'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaDonThue = Column(Integer, ForeignKey('G5_donhang_thue.G5_MaDonThue'))
    G5_MaSanPham = Column(Integer, ForeignKey('G5_sanpham.G5_MaSanPham'))
    G5_SoLuong = Column(Integer)
    G5_GiaThue = Column(Numeric(18, 2))

    don_hang_thue = relationship('DonHangThue', backref='chi_tiet_don_hang_thue')
    san_pham = relationship('SanPham')

class LichSuThue(Base):
    __tablename__ = 'G5_lich_su_thue'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaSanPham = Column(Integer, ForeignKey('G5_sanpham.G5_MaSanPham'))
    G5_MaDonThue = Column(Integer, ForeignKey('G5_donhang_thue.G5_MaDonThue'))
    G5_TrangThai = Column(String(50))
    G5_ThoiDiem = Column(DateTime, default=datetime.utcnow)

    san_pham = relationship('SanPham')
    don_hang_thue = relationship('DonHangThue')

class DichVuTuVan(Base):
    __tablename__ = 'G5_dichvu_tuvan'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_TenDichVu = Column(String(255))
    G5_MoTa = Column(Text)
    G5_Gia = Column(Numeric(18, 2))
    G5_ThoiLuong = Column(Integer)
    G5_IsDeleted = Column(Integer, default=0)
    G5_DeletedAt = Column(DateTime)
    G5_DeletedBy = Column(Integer)

class LichTuVan(Base):
    __tablename__ = 'G5_lich_tuvan'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaNguoiDung = Column(Integer, ForeignKey('G5_nguoidung.G5_MaNguoiDung'))
    G5_MaDichVu = Column(Integer, ForeignKey('G5_dichvu_tuvan.G5_Id'))
    G5_ThoiGianBatDau = Column(DateTime)
    G5_ThoiGianKetThuc = Column(DateTime)
    G5_TrangThai = Column(String(50))
    G5_GhiChu = Column(Text)
    G5_IsDeleted = Column(Integer, default=0)
    G5_DeletedAt = Column(DateTime)
    G5_DeletedBy = Column(Integer)

    nguoi_dung = relationship('NguoiDung')
    dich_vu = relationship('DichVuTuVan')

class LichTuVanNhanVien(Base):
    __tablename__ = 'G5_lich_tuvan_nhanvien'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaLich = Column(Integer, ForeignKey('G5_lich_tuvan.G5_Id'))
    G5_MaNhanVien = Column(Integer, ForeignKey('G5_nguoidung.G5_MaNguoiDung'))

    lich_tuvan = relationship('LichTuVan')
    nhan_vien = relationship('NguoiDung')

class SanPhamHinhAnh(Base):
    __tablename__ = 'G5_sanpham_hinhanh'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaSanPham = Column(Integer, ForeignKey('G5_sanpham.G5_MaSanPham'))
    G5_UrlAnh = Column(Text)
    G5_AltText = Column(String(255))
    G5_ThuTu = Column(Integer)
    G5_NgayTao = Column(DateTime, default=datetime.utcnow)
    G5_TrangThai = Column(Integer, default=1)

    san_pham = relationship('SanPham')

class UserVoucher(Base):
    __tablename__ = 'G5_uservoucher'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_ClaimedAt = Column(DateTime)
    G5_ExpiredAt = Column(DateTime)
    G5_IsUsed = Column(Integer, default=0)
    G5_UsedAt = Column(DateTime)
    G5_OrderId = Column(Integer)
    G5_UserId = Column(Integer, ForeignKey('G5_nguoidung.G5_MaNguoiDung'))
    G5_VoucherId = Column(Integer)

    nguoi_dung = relationship('NguoiDung')

class GioHangTam(Base):
    __tablename__ = 'G5_giohangtam'

    G5_Id = Column(Integer, primary_key=True, autoincrement=True)
    G5_MaNguoiDung = Column(Integer, ForeignKey('G5_nguoidung.G5_MaNguoiDung'))
    G5_MaSanPham = Column(Integer, ForeignKey('G5_sanpham.G5_MaSanPham'))
    G5_SoLuong = Column(Integer)

    nguoi_dung = relationship('NguoiDung')
    san_pham = relationship('SanPham')
