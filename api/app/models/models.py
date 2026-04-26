from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class NguoiDung(Base):
    __tablename__ = 'G5_nguoidung'

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
