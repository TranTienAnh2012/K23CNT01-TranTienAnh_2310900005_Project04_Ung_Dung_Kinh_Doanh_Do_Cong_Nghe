from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_banner import tta_banner_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required
from app.schemas.validation_schemas import BannerCreateSchema, BannerUpdateSchema, validate_schema

# =========================================================================
# LỚP 3 (BACKEND): RESOURCE / CONTROLLER (Nhận Request từ Frontend)
# OOP TRONG CONTROLLER:
# Flask-RESTful sử dụng OOP để đóng gói và tái sử dụng code.
# =========================================================================

# OOP: Tính kế thừa (BannerListResource kế thừa thư viện Resource của Flask)
class BannerListResource(Resource):
    @jwt_required()
    @admin_required
    # OOP: Đây là một Phương thức (Method) gắn liền với đối tượng Class này.
    # 'self' chính là con trỏ đại diện cho đối tượng hiện tại đang chạy.
    def get(self):
        # Khi Frontend gọi axios.get('/api/tta_banner'), hàm get() này sẽ chạy
        params = request.args.to_dict()
        # Lớp này gọi xuống tầng Service -> Repo -> CSDL để lấy dữ liệu
        data = service.get_all_banners(params)
        # Hàm response_success đóng gói kết quả thành chuẩn JSON trả về cho Frontend
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(BannerCreateSchema)
    def post(self):
        data = request.validated_data
        service.create_banner(data)
        return response_success(message="Thêm banner thành công.")

class BannerResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, id):
        data = service.get_banner_detail(id)
        if not data:
            return response_error("Banner không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(BannerUpdateSchema)
    def put(self, id):
        data = request.validated_data
        service.update_banner(id, data)
        return response_success(message="Cập nhật banner thành công.")

    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete_banner(id)
        return response_success(message="Xóa banner thành công.")
