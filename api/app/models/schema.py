from sqlalchemy import Table, Column, Integer, String, Numeric, Text, DateTime, Date, ForeignKey, MetaData
from datetime import datetime

metadata = MetaData()

# Table G5_user
# Columns (actual DB): G5_MaNguoiDung, G5_HoTen, G5_Email, G5_SDT, G5_NgaySinh,
#   G5_MatKhau, G5_VaiTro, G5_NgayDangKy, G5_ResetToken, G5_ResetTokenExpiry,
#   G5_AvatarUrl, G5_IsDeleted, G5_DeletedAt, G5_DeletedBy
user = Table(
    'G5_user', metadata,
    Column('G5_MaNguoiDung', Integer, primary_key=True, autoincrement=True),
    Column('G5_HoTen', String(255)),
    Column('G5_Email', String(255), unique=True),
    Column('G5_SDT', String(20)),
    Column('G5_NgaySinh', Date),
    Column('G5_MatKhau', String(255)),
    Column('G5_VaiTro', String(50), default='user'),
    Column('G5_NgayDangKy', DateTime, default=datetime.utcnow),
    Column('G5_ResetToken', String(255)),
    Column('G5_ResetTokenExpiry', DateTime),
    Column('G5_AvatarUrl', Text),
    Column('G5_IsDeleted', Integer, default=0),
    Column('G5_DeletedAt', DateTime),
    Column('G5_DeletedBy', Integer),
)

# Table G5_danhmuc
# Columns (actual DB): G5_MaDanhMuc, G5_TenDanhMuc, G5_MoTa, G5_IsDeleted, G5_DeletedAt, G5_DeletedBy
# NOTE: G5_TrangThai and G5_NgayTao do NOT exist in the real DB table
danhmuc = Table(
    'G5_danhmuc', metadata,
    Column('G5_MaDanhMuc', Integer, primary_key=True, autoincrement=True),
    Column('G5_TenDanhMuc', String(255), nullable=False),
    Column('G5_MoTa', Text),
    Column('G5_IsDeleted', Integer, default=0),
    Column('G5_DeletedAt', DateTime),
    Column('G5_DeletedBy', Integer),
)

# Table G5_sanpham
# Columns (actual DB): G5_MaSanPham, G5_TenSanPham, G5_MaDanhMuc, G5_GiaGoc, G5_MoTa,
#   G5_HinhAnh, G5_SoLuongTon, G5_TrangThai, G5_NgayThem, G5_Loai, G5_GiaBan,
#   G5_ThuongHieu, G5_XuatXu, G5_BaoHanh, G5_IsDeleted, G5_DeletedAt, G5_DeletedBy
sanpham = Table(
    'G5_sanpham', metadata,
    Column('G5_MaSanPham', Integer, primary_key=True, autoincrement=True),
    Column('G5_TenSanPham', String(255), nullable=False),
    Column('G5_MaDanhMuc', Integer, ForeignKey('G5_danhmuc.G5_MaDanhMuc')),
    Column('G5_GiaGoc', Numeric(18, 2)),
    Column('G5_MoTa', Text),
    Column('G5_HinhAnh', String(500)),
    Column('G5_SoLuongTon', Integer, default=0),
    Column('G5_TrangThai', Integer, default=1),
    Column('G5_NgayThem', DateTime, default=datetime.utcnow),
    Column('G5_Loai', String(100)),
    Column('G5_GiaBan', Numeric(18, 2)),
    Column('G5_ThuongHieu', String(255)),
    Column('G5_XuatXu', String(255)),
    Column('G5_BaoHanh', String(100)),
    Column('G5_IsDeleted', Integer, default=0),
    Column('G5_DeletedAt', DateTime),
    Column('G5_DeletedBy', Integer),
)

# Table G5_donhang
# Columns (actual DB): G5_MaDonHang, G5_MaNguoiDung, G5_NgayDatHang, G5_TongTien,
#   G5_TrangThai, G5_DiaChiNguoiNhan, G5_EmailNguoiNhan, G5_GhiChu, G5_HoTenNguoiNhan,
#   G5_SoDienThoaiNguoiNhan, G5_PhuongThucThanhToan, G5_TrangThaiThanhToan,
#   G5_IsDeleted, G5_DeletedAt, G5_DeletedBy
donhang = Table(
    'G5_donhang', metadata,
    Column('G5_MaDonHang', Integer, primary_key=True, autoincrement=True),
    Column('G5_MaNguoiDung', Integer, ForeignKey('G5_user.G5_MaNguoiDung')),
    Column('G5_NgayDatHang', DateTime, default=datetime.utcnow),
    Column('G5_TongTien', Numeric(18, 2), nullable=False),
    Column('G5_TrangThai', String(50), default='pending'),
    Column('G5_DiaChiNguoiNhan', String(255)),
    Column('G5_EmailNguoiNhan', String(255)),
    Column('G5_GhiChu', Text),
    Column('G5_HoTenNguoiNhan', String(255)),
    Column('G5_SoDienThoaiNguoiNhan', String(20)),
    Column('G5_PhuongThucThanhToan', String(50)),
    Column('G5_TrangThaiThanhToan', String(50)),
    Column('G5_IsDeleted', Integer, default=0),
    Column('G5_DeletedAt', DateTime),
    Column('G5_DeletedBy', Integer),
)

# Table G5_chitietdonhang
# Columns (actual DB): G5_MaChiTiet, G5_MaDonHang, G5_MaSanPham, G5_SoLuong
# NOTE: G5_Gia and G5_ThanhTien do NOT exist in the real DB table
chitietdonhang = Table(
    'G5_chitietdonhang', metadata,
    Column('G5_MaChiTiet', Integer, primary_key=True, autoincrement=True),
    Column('G5_MaDonHang', Integer, ForeignKey('G5_donhang.G5_MaDonHang')),
    Column('G5_MaSanPham', Integer, ForeignKey('G5_sanpham.G5_MaSanPham')),
    Column('G5_SoLuong', Integer, nullable=False),
)

# Table G5_thuoctinh
# Columns (actual DB): G5_ThuocTinhID, G5_TenThuocTinh, G5_IsDeleted, G5_DeletedAt, G5_DeletedBy
thuoctinh = Table(
    'G5_thuoctinh', metadata,
    Column('G5_ThuocTinhID', Integer, primary_key=True, autoincrement=True),
    Column('G5_TenThuocTinh', String(255), nullable=False),
    Column('G5_IsDeleted', Integer, default=0),
    Column('G5_DeletedAt', DateTime),
    Column('G5_DeletedBy', Integer),
)

# Table G5_giatrithuoctinh
# Columns (actual DB): G5_GiaTriID, G5_MaSanPham, G5_ThuocTinhID, G5_GiaTri
# NOTE: G5_IsDeleted does NOT exist in the real DB table
giatrithuoctinh = Table(
    'G5_giatrithuoctinh', metadata,
    Column('G5_GiaTriID', Integer, primary_key=True, autoincrement=True),
    Column('G5_MaSanPham', Integer, ForeignKey('G5_sanpham.G5_MaSanPham')),
    Column('G5_ThuocTinhID', Integer, ForeignKey('G5_thuoctinh.G5_ThuocTinhID')),
    Column('G5_GiaTri', String(255), nullable=False),
)

# Table G5_danhmuc_thuoctinh
# Columns (actual DB): G5_Id, G5_MaDanhMuc, G5_ThuocTinhID, G5_ThuTu, G5_TrangThai
# NOTE: G5_IsDeleted does NOT exist in the real DB table
danhmuc_thuoctinh = Table(
    'G5_danhmuc_thuoctinh', metadata,
    Column('G5_Id', Integer, primary_key=True, autoincrement=True),
    Column('G5_MaDanhMuc', Integer, ForeignKey('G5_danhmuc.G5_MaDanhMuc')),
    Column('G5_ThuocTinhID', Integer, ForeignKey('G5_thuoctinh.G5_ThuocTinhID')),
    Column('G5_ThuTu', Integer),
    Column('G5_TrangThai', Integer, default=1),
)

# Table G5_danhgia
# Columns: G5_MaDanhGia, G5_MaSanPham, G5_MaNguoiDung, G5_SoSao, G5_BinhLuan, G5_NgayDanhGia
danhgia = Table(
    'G5_danhgia', metadata,
    Column('G5_MaDanhGia', Integer, primary_key=True, autoincrement=True),
    Column('G5_MaSanPham', Integer, ForeignKey('G5_sanpham.G5_MaSanPham')),
    Column('G5_MaNguoiDung', Integer, ForeignKey('G5_user.G5_MaNguoiDung')),
    Column('G5_SoSao', Integer),
    Column('G5_BinhLuan', Text),
    Column('G5_NgayDanhGia', DateTime, default=datetime.utcnow),
)

# Table G5_voucher
# Columns: G5_Id, G5_ApplyToAll, G5_CategoryIds, G5_Code, G5_CreatedAt, G5_Description,
#   G5_DiscountType, G5_DiscountValue, G5_EndDate, G5_UserIdCreate, G5_MaxDiscount,
#   G5_MinOrderValue, G5_Name, G5_ProductIds, G5_StartDate, G5_Status, G5_TotalQuantity, G5_UsedQuantity
voucher = Table(
    'G5_voucher', metadata,
    Column('G5_Id', Integer, primary_key=True, autoincrement=True),
    Column('G5_ApplyToAll', Integer, default=0),
    Column('G5_CategoryIds', Text),
    Column('G5_Code', String(100), unique=True),
    Column('G5_CreatedAt', DateTime, default=datetime.utcnow),
    Column('G5_Description', Text),
    Column('G5_DiscountType', String(50)), # percent, fixed
    Column('G5_DiscountValue', Numeric(18, 2)),
    Column('G5_EndDate', DateTime),
    Column('G5_UserIdCreate', Integer, ForeignKey('G5_user.G5_MaNguoiDung')),
    Column('G5_MaxDiscount', Numeric(18, 2)),
    Column('G5_MinOrderValue', Numeric(18, 2)),
    Column('G5_Name', String(255)),
    Column('G5_ProductIds', Text),
    Column('G5_StartDate', DateTime),
    Column('G5_Status', String(50), default='active'),
    Column('G5_TotalQuantity', Integer),
    Column('G5_UsedQuantity', Integer, default=0),
)

# Table G5_uservoucher
# Columns: G5_Id, G5_ClaimedAt, G5_ExpiredAt, G5_IsUsed, G5_UsedAt, G5_OrderId, G5_UserId, G5_VoucherId
uservoucher = Table(
    'G5_uservoucher', metadata,
    Column('G5_Id', Integer, primary_key=True, autoincrement=True),
    Column('G5_ClaimedAt', DateTime, default=datetime.utcnow),
    Column('G5_ExpiredAt', DateTime),
    Column('G5_IsUsed', Integer, default=0),
    Column('G5_UsedAt', DateTime),
    Column('G5_OrderId', Integer, ForeignKey('G5_donhang.G5_MaDonHang')),
    Column('G5_UserId', Integer, ForeignKey('G5_user.G5_MaNguoiDung')),
    Column('G5_VoucherId', Integer, ForeignKey('G5_voucher.G5_Id')),
)
