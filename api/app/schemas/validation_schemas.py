from marshmallow import Schema, fields, validate, ValidationError

class SanPhamCreateSchema(Schema):
    """Schema for creating a product"""
    TenSanPham = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    MaDanhMuc = fields.Int(required=True)
    GiaGoc = fields.Decimal(required=True, as_string=True)
    GiaBan = fields.Decimal(required=True, as_string=True)
    SoLuongTon = fields.Int(required=True, validate=validate.Range(min=0))
    MoTa = fields.Str(allow_none=True)
    HinhAnh = fields.Str(allow_none=True)
    TrangThai = fields.Int(validate=validate.OneOf([0, 1]), load_default=1)

class SanPhamUpdateSchema(Schema):
    """Schema for updating a product"""
    TenSanPham = fields.Str(validate=validate.Length(min=1, max=255))
    MaDanhMuc = fields.Int()
    GiaGoc = fields.Decimal(as_string=True)
    GiaBan = fields.Decimal(as_string=True)
    SoLuongTon = fields.Int(validate=validate.Range(min=0))
    MoTa = fields.Str(allow_none=True)
    HinhAnh = fields.Str(allow_none=True)
    TrangThai = fields.Int(validate=validate.OneOf([0, 1]))

class DanhMucCreateSchema(Schema):
    """Schema for creating a category"""
    TenDanhMuc = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    MoTa = fields.Str(allow_none=True)
    TrangThai = fields.Int(validate=validate.OneOf([0, 1]), load_default=1)

class DanhMucUpdateSchema(Schema):
    """Schema for updating a category"""
    TenDanhMuc = fields.Str(validate=validate.Length(min=1, max=255))
    MoTa = fields.Str(allow_none=True)
    TrangThai = fields.Int(validate=validate.OneOf([0, 1]))

class NguoiDungCreateSchema(Schema):
    """Schema for creating a user"""
    TenDangNhap = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    MatKhau = fields.Str(required=True, validate=validate.Length(min=6))
    HoTen = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    Email = fields.Email(required=True)
    SoDienThoai = fields.Str(validate=validate.Length(max=20))
    DiaChi = fields.Str(allow_none=True)
    VaiTro = fields.Str(validate=validate.OneOf(['admin', 'user']), load_default='user')

class NguoiDungUpdateSchema(Schema):
    """Schema for updating a user"""
    HoTen = fields.Str(validate=validate.Length(min=1, max=255))
    Email = fields.Email()
    SoDienThoai = fields.Str(validate=validate.Length(max=20))
    DiaChi = fields.Str(allow_none=True)
    VaiTro = fields.Str(validate=validate.OneOf(['admin', 'user']))

class LoginSchema(Schema):
    """Schema for login"""
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class DonHangCreateSchema(Schema):
    """Schema for creating an order"""
    MaNguoiDung = fields.Int(required=True)
    TongTien = fields.Decimal(required=True, as_string=True)
    TrangThai = fields.Str(validate=validate.OneOf(['pending', 'processing', 'completed', 'cancelled']), load_default='pending')
    DiaChiGiaoHang = fields.Str(required=True)
    GhiChu = fields.Str(allow_none=True)

def validate_schema(schema_class):
    """Decorator to validate request data against a schema"""
    def decorator(f):
        from functools import wraps
        from flask import request
        from app.utils.helpers import response_error

        @wraps(f)
        def decorated_function(*args, **kwargs):
            schema = schema_class()
            try:
                data = request.get_json()
                validated_data = schema.load(data)
                request.validated_data = validated_data
                return f(*args, **kwargs)
            except ValidationError as err:
                return response_error(message="Validation error", status=400)

        return decorated_function
    return decorator
