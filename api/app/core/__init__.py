from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from app.core.config import get_config
from app.db.connection import engine
from flask.json.provider import DefaultJSONProvider
from decimal import Decimal

class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

def create_app(config_name=None):
    app = Flask(__name__, static_folder='../../static', static_url_path='/static')
    app.json_provider_class = CustomJSONProvider
    app.json = CustomJSONProvider(app)

    # Initialize Flask-RESTful
    api = Api(app, catch_all_404s=True)

    from flask import make_response
    from flask.json import dumps

    @api.representation('application/json')
    def output_json(data, code, headers=None):
        resp = make_response(dumps(data), code)
        resp.headers.extend(headers or {})
        return resp

    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)

    from app.extensions import db, jwt
    # Initialize extensions
    CORS(app, origins=config.CORS_ORIGINS)
    jwt.init_app(app)

    # Register middleware
    register_middleware(app)

    # Register error handlers
    register_error_handlers(app)

    # Register resources
    register_resources(api)
    # Client blueprints registration removed (migrated to RESTful Resources)

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Backend standardized structure with Flask-RESTful and SQLAlchemy Core is fully operational!"}

    from app.utils.tta_payment_cron import start_payment_cron
    start_payment_cron(app)

    return app

def register_middleware(app):
    """Register middleware"""
    from app.middleware.request_middleware import request_logger_middleware
    request_logger_middleware(app)

def register_error_handlers(app):
    """Register error handlers"""
    from app.utils.error_handlers import (
        handle_400, handle_401, handle_403, handle_404,
        handle_500, handle_validation_error
    )

    app.register_error_handler(400, handle_400)
    app.register_error_handler(401, handle_401)
    app.register_error_handler(403, handle_403)
    app.register_error_handler(404, handle_404)
    app.register_error_handler(500, handle_500)
    app.register_error_handler(Exception, handle_validation_error)

def register_resources(api):
    """Register all Flask-RESTful resources"""
    
    # =========================================================================
    # ĐĂNG KÝ ĐƯỜNG DẪN (ROUTING) - KẾT NỐI API VỚI FRONTEND
    # Các Class Resource (Controller) được đăng ký với các URL cụ thể.
    # Khi Frontend gọi đúng chuỗi URL, Backend sẽ kích hoạt Class tương ứng.
    # =========================================================================

    # Auth resources
    from app.modules.auth.auth_resource import LoginResource, RegisterResource
    # Đăng ký URL. Ví dụ frontend gọi POST /api/tta_auth/login thì chạy LoginResource
    api.add_resource(LoginResource, '/api/tta_auth/login')
    api.add_resource(RegisterResource, '/api/tta_auth/register')

    # SanPham resources
    from app.modules.admin.tta_sanpham.tta_sanpham_resource import SanPhamListResource, SanPhamResource
    api.add_resource(SanPhamListResource, '/api/tta_sanpham')
    api.add_resource(SanPhamResource, '/api/tta_sanpham/<int:ma>')

    # DanhMuc resources
    from app.modules.admin.tta_danhmuc.tta_danhmuc_resource import DanhMucListResource, DanhMucResource
    api.add_resource(DanhMucListResource, '/api/tta_danhmuc')
    api.add_resource(DanhMucResource, '/api/tta_danhmuc/<int:ma>')

    # NguoiDung resources
    from app.modules.admin.tta_nguoidung.tta_nguoidung_resource import NguoiDungListResource, NguoiDungResource
    api.add_resource(NguoiDungListResource, '/api/tta_user')
    api.add_resource(NguoiDungResource, '/api/tta_user/<int:ma>')

    # DonHang resources
    from app.modules.admin.tta_donhang.tta_donhang_resource import DonHangListResource, DonHangResource
    api.add_resource(DonHangListResource, '/api/tta_donhang')
    api.add_resource(DonHangResource, '/api/tta_donhang/<int:ma>')

    # ThuocTinh resources
    from app.modules.admin.tta_thuoctinh.tta_thuoctinh_resource import ThuocTinhListResource, ThuocTinhResource
    api.add_resource(ThuocTinhListResource, '/api/tta_thuoctinh')
    api.add_resource(ThuocTinhResource, '/api/tta_thuoctinh/<int:ma>')

    # GiaTriThuocTinh resources
    from app.modules.admin.tta_giatrithuoctinh.tta_giatrithuoctinh_resource import GiaTriThuocTinhListResource, GiaTriThuocTinhResource, GiaTriThuocTinhProductResource
    api.add_resource(GiaTriThuocTinhListResource, '/api/tta_giatrithuoctinh')
    api.add_resource(GiaTriThuocTinhResource, '/api/tta_giatrithuoctinh/<int:id>')
    api.add_resource(GiaTriThuocTinhProductResource, '/api/tta_giatrithuoctinh/product/<int:ma_sp>')

    # DanhMucThuocTinh resources
    from app.modules.admin.tta_danhmuc_thuoctinh.tta_danhmuc_thuoctinh_resource import DanhMucThuocTinhListResource, DanhMucThuocTinhResource, ProductAttributeResource
    api.add_resource(DanhMucThuocTinhListResource, '/api/tta_danhmuc_thuoctinh')
    api.add_resource(DanhMucThuocTinhResource, '/api/tta_danhmuc_thuoctinh/<int:id>')
    api.add_resource(ProductAttributeResource, '/api/tta_danhmuc_thuoctinh/product/<int:ma_sp>')

    # ChiTietDonHang resources
    from app.modules.admin.tta_chitiet_donhang.tta_chitiet_donhang_resource import ChiTietDonHangListResource, ChiTietDonHangResource
    api.add_resource(ChiTietDonHangListResource, '/api/tta_chitiet_donhang')
    api.add_resource(ChiTietDonHangResource, '/api/tta_chitiet_donhang/<int:ma>')

    # Review (danhgia) resources
    from app.modules.admin.tta_danhgia.tta_danhgia_resource import ReviewListResource, ReviewResource
    api.add_resource(ReviewListResource, '/api/tta_danhgia')
    api.add_resource(ReviewResource, '/api/tta_danhgia/<int:id>')

    # Voucher resources
    from app.modules.admin.tta_voucher.tta_voucher_resource import VoucherListResource, VoucherResource
    api.add_resource(VoucherListResource, '/api/tta_voucher')
    api.add_resource(VoucherResource, '/api/tta_voucher/<int:id>')


    # Thue resources
    from app.modules.admin.tta_sanpham_thue.tta_sanpham_thue_resource import SanPhamThueListResource, SanPhamThueResource
    api.add_resource(SanPhamThueListResource, '/api/tta_sanpham_thue')
    api.add_resource(SanPhamThueResource, '/api/tta_sanpham_thue/<int:id>')
    from app.modules.admin.tta_donhang_thue.tta_donhang_thue_resource import DonHangThueListResource, DonHangThueResource
    api.add_resource(DonHangThueListResource, '/api/tta_donhang_thue')
    api.add_resource(DonHangThueResource, '/api/tta_donhang_thue/<int:id>')
    from app.modules.admin.tta_chitiet_donhang_thue.tta_chitiet_donhang_thue_resource import ChiTietDonHangThueListResource, ChiTietDonHangThueResource
    api.add_resource(ChiTietDonHangThueListResource, '/api/tta_chitiet_donhang_thue')
    api.add_resource(ChiTietDonHangThueResource, '/api/tta_chitiet_donhang_thue/<int:id>')
    from app.modules.admin.tta_lich_su_thue.tta_lich_su_thue_resource import LichSuThueListResource, LichSuThueResource
    api.add_resource(LichSuThueListResource, '/api/tta_lich_su_thue')
    api.add_resource(LichSuThueResource, '/api/tta_lich_su_thue/<int:id>')


    # Rest modules resources
    from app.modules.admin.tta_dichvu_tuvan.tta_dichvu_tuvan_resource import DichVuTuVanListResource, DichVuTuVanResource
    api.add_resource(DichVuTuVanListResource, '/api/tta_dichvu_tuvan')
    api.add_resource(DichVuTuVanResource, '/api/tta_dichvu_tuvan/<int:id>')
    from app.modules.admin.tta_lich_tuvan.tta_lich_tuvan_resource import LichTuVanListResource, LichTuVanResource
    api.add_resource(LichTuVanListResource, '/api/tta_lich_tuvan')
    api.add_resource(LichTuVanResource, '/api/tta_lich_tuvan/<int:id>')
    from app.modules.admin.tta_lich_tuvan_nhanvien.tta_lich_tuvan_nhanvien_resource import LichTuVanNhanVienListResource, LichTuVanNhanVienResource
    api.add_resource(LichTuVanNhanVienListResource, '/api/tta_lich_tuvan_nhanvien')
    api.add_resource(LichTuVanNhanVienResource, '/api/tta_lich_tuvan_nhanvien/<int:id>')
    from app.modules.admin.tta_sanpham_hinhanh.tta_sanpham_hinhanh_resource import SanPhamHinhAnhListResource, SanPhamHinhAnhResource
    api.add_resource(SanPhamHinhAnhListResource, '/api/tta_sanpham_hinhanh')
    api.add_resource(SanPhamHinhAnhResource, '/api/tta_sanpham_hinhanh/<int:id>')
    from app.modules.admin.tta_uservoucher.tta_uservoucher_resource import UserVoucherListResource, UserVoucherResource
    api.add_resource(UserVoucherListResource, '/api/tta_uservoucher')
    api.add_resource(UserVoucherResource, '/api/tta_uservoucher/<int:id>')
    from app.modules.admin.tta_giohangtam.tta_giohangtam_resource import GioHangTamListResource, GioHangTamResource
    api.add_resource(GioHangTamListResource, '/api/tta_giohangtam')
    api.add_resource(GioHangTamResource, '/api/tta_giohangtam/<int:id>')

    # Dashboard resources
    from app.modules.admin.tta_dashboard.dashboard_resource import DashboardResource
    api.add_resource(DashboardResource, '/api/dashboard')

    # Upload resources
    from app.modules.admin.tta_upload.upload_resource import UploadResource
    api.add_resource(UploadResource, '/api/upload')

    # Banner resources
    from app.modules.admin.tta_banner.tta_banner_resource import BannerListResource, BannerResource
    api.add_resource(BannerListResource, '/api/tta_banner')      # Ánh xạ GET / POST cho danh sách
    api.add_resource(BannerResource, '/api/tta_banner/<int:id>') # Ánh xạ GET / PUT / DELETE cho chi tiết
    # Client resources
    from app.modules.client.tta_sanpham.tta_sanpham_resource import ClientSanPhamListResource, ClientSanPhamResource
    from app.modules.client.tta_danhmuc.tta_danhmuc_resource import ClientDanhMucListResource
    from app.modules.client.tta_banner.tta_banner_resource import ClientBannerListResource
    from app.modules.client.tta_donhang.tta_donhang_resource import ClientDonHangListResource, ClientDonHangResource, ClientDonHangCancelResource
    from app.modules.client.tta_giohang.tta_giohang_resource import ClientGioHangListResource, ClientGioHangResource
    from app.modules.client.tta_danhgia.tta_danhgia_resource import ClientReviewListResource, ClientReviewCheckResource, ClientReviewCreateResource
    from app.modules.client.tta_voucher.tta_voucher_resource import ClientVoucherPublicResource, ClientVoucherClaimResource, ClientVoucherMyResource
    from app.modules.client.tta_profile.tta_profile_resource import ClientProfileResource, ClientChangePasswordResource, ClientUploadResource
    from app.modules.client.tta_thue.tta_thue_resource import (
        ClientSanPhamThueListResource,
        ClientDonHangThueListResource,
        ClientDonHangThueCancelResource
    )
    from app.modules.client.tta_tuvan.tta_tuvan_resource import (
        ClientDichVuTuVanListResource,
        ClientStaffListResource,
        ClientLichTuVanListResource,
        ClientLichTuVanCancelResource
    )

    api.add_resource(ClientSanPhamListResource, '/api/client/tta_sanpham')
    api.add_resource(ClientSanPhamResource, '/api/client/tta_sanpham/<int:ma>')
    api.add_resource(ClientDanhMucListResource, '/api/client/tta_danhmuc')
    api.add_resource(ClientBannerListResource, '/api/client/tta_banner')
    api.add_resource(ClientDonHangListResource, '/api/client/tta_donhang')
    api.add_resource(ClientDonHangResource, '/api/client/tta_donhang/<int:ma>')
    api.add_resource(ClientDonHangCancelResource, '/api/client/tta_donhang/cancel/<int:ma>')
    api.add_resource(ClientGioHangListResource, '/api/client/tta_giohang')
    api.add_resource(ClientGioHangResource, '/api/client/tta_giohang/<int:id>')
    api.add_resource(ClientReviewListResource, '/api/client/tta_danhgia/<int:ma_sp>')
    api.add_resource(ClientReviewCheckResource, '/api/client/tta_danhgia/check/<int:ma_sp>')
    api.add_resource(ClientReviewCreateResource, '/api/client/tta_danhgia')
    api.add_resource(ClientVoucherPublicResource, '/api/client/tta_voucher/public')
    api.add_resource(ClientVoucherClaimResource, '/api/client/tta_voucher/claim')
    api.add_resource(ClientVoucherMyResource, '/api/client/tta_voucher/my-vouchers')
    api.add_resource(ClientProfileResource, '/api/client/profile')
    api.add_resource(ClientChangePasswordResource, '/api/client/profile/change-password')
    api.add_resource(ClientUploadResource, '/api/client/upload')
    api.add_resource(ClientSanPhamThueListResource, '/api/client/tta_sanpham_thue')
    api.add_resource(ClientDonHangThueListResource, '/api/client/tta_donhang_thue')
    api.add_resource(ClientDonHangThueCancelResource, '/api/client/tta_donhang_thue/cancel/<int:id>')
    api.add_resource(ClientDichVuTuVanListResource, '/api/client/tta_dichvu_tuvan')
    api.add_resource(ClientStaffListResource, '/api/client/tta_staff')
    api.add_resource(ClientLichTuVanListResource, '/api/client/tta_lich_tuvan')
    api.add_resource(ClientLichTuVanCancelResource, '/api/client/tta_lich_tuvan/cancel')


    # Nhanvien (Staff) resources
    from app.modules.Nhanvien.nvk_sanpham_thue.nvk_sanpham_thue_resource import (
        SanPhamThueListResource as StaffSanPhamThueListResource,
        SanPhamThueResource as StaffSanPhamThueResource
    )
    api.add_resource(StaffSanPhamThueListResource, '/api/nvk_sanpham_thue', endpoint='staff_sanpham_thue_list')
    api.add_resource(StaffSanPhamThueResource, '/api/nvk_sanpham_thue/<int:id>', endpoint='staff_sanpham_thue_detail')

    from app.modules.Nhanvien.nvk_donhang_thue.nvk_donhang_thue_resource import (
        DonHangThueListResource as StaffDonHangThueListResource,
        DonHangThueResource as StaffDonHangThueResource
    )
    api.add_resource(StaffDonHangThueListResource, '/api/nvk_donhang_thue', endpoint='staff_donhang_thue_list')
    api.add_resource(StaffDonHangThueResource, '/api/nvk_donhang_thue/<int:id>', endpoint='staff_donhang_thue_detail')

    from app.modules.Nhanvien.nvk_chitiet_donhang_thue.nvk_chitiet_donhang_thue_resource import (
        ChiTietDonHangThueListResource as StaffChiTietDonHangThueListResource,
        ChiTietDonHangThueResource as StaffChiTietDonHangThueResource
    )
    api.add_resource(StaffChiTietDonHangThueListResource, '/api/nvk_chitiet_donhang_thue', endpoint='staff_chitiet_donhang_thue_list')
    api.add_resource(StaffChiTietDonHangThueResource, '/api/nvk_chitiet_donhang_thue/<int:id>', endpoint='staff_chitiet_donhang_thue_detail')

    from app.modules.Nhanvien.nvk_lich_su_thue.nvk_lich_su_thue_resource import (
        LichSuThueListResource as StaffLichSuThueListResource,
        LichSuThueResource as StaffLichSuThueResource
    )
    api.add_resource(StaffLichSuThueListResource, '/api/nvk_lich_su_thue', endpoint='staff_lich_su_thue_list')
    api.add_resource(StaffLichSuThueResource, '/api/nvk_lich_su_thue/<int:id>', endpoint='staff_lich_su_thue_detail')

    from app.modules.Nhanvien.nvk_dichvu_tuvan.nvk_dichvu_tuvan_resource import (
        DichVuTuVanListResource as StaffDichVuTuVanListResource,
        DichVuTuVanResource as StaffDichVuTuVanResource
    )
    api.add_resource(StaffDichVuTuVanListResource, '/api/nvk_dichvu_tuvan', endpoint='staff_dichvu_tuvan_list')
    api.add_resource(StaffDichVuTuVanResource, '/api/nvk_dichvu_tuvan/<int:id>', endpoint='staff_dichvu_tuvan_detail')

    from app.modules.Nhanvien.nvk_lich_tuvan.nvk_lich_tuvan_resource import (
        LichTuVanListResource as StaffLichTuVanListResource,
        LichTuVanResource as StaffLichTuVanResource
    )
    api.add_resource(StaffLichTuVanListResource, '/api/nvk_lich_tuvan', endpoint='staff_lich_tuvan_list')
    api.add_resource(StaffLichTuVanResource, '/api/nvk_lich_tuvan/<int:id>', endpoint='staff_lich_tuvan_detail')

    from app.modules.Nhanvien.nvk_nhanvien.nvk_nhanvien_resource import (
        LichTuVanNhanVienListResource as StaffLichTuVanNhanVienListResource,
        LichTuVanNhanVienResource as StaffLichTuVanNhanVienResource
    )
    api.add_resource(StaffLichTuVanNhanVienListResource, '/api/nvk_nhanvien', endpoint='staff_lich_tuvan_nhanvien_list')
    api.add_resource(StaffLichTuVanNhanVienResource, '/api/nvk_nhanvien/<int:id>', endpoint='staff_lich_tuvan_nhanvien_detail')

