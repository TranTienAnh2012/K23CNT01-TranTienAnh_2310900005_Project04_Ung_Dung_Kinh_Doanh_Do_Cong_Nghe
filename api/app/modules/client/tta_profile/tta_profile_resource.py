from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.client.tta_profile import tta_profile_service as service
from app.utils.helpers import response_success, response_error
from werkzeug.utils import secure_filename
import os
import uuid
from app.core.config import get_config

class ClientProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        try:
            profile = service.get_profile(user_id)
            if not profile:
                return response_error("Không tìm thấy hồ sơ người dùng.", 404)
            return response_success(data=profile, message="Lấy thông tin hồ sơ thành công.")
        except Exception as e:
            return response_error(f"Lỗi lấy thông tin hồ sơ: {str(e)}", 500)

    @jwt_required()
    def put(self):
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        try:
            service.update_profile(user_id, data)
            profile = service.get_profile(user_id)
            return response_success(data=profile, message="Cập nhật hồ sơ thành công.")
        except Exception as e:
            return response_error(f"Lỗi cập nhật hồ sơ: {str(e)}", 400)

class ClientChangePasswordResource(Resource):
    @jwt_required()
    def put(self):
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        current_pwd = data.get('currentPassword')
        new_pwd = data.get('newPassword')
        
        if not current_pwd or not new_pwd:
            return response_error("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.", 400)
            
        try:
            service.change_password(user_id, current_pwd, new_pwd)
            return response_success(message="Thay đổi mật khẩu thành công.")
        except Exception as e:
            return response_error(str(e), 400)

class ClientUploadResource(Resource):
    @jwt_required()
    def post(self):
        if 'file' not in request.files:
            return response_error("Không tìm thấy tệp tin trong yêu cầu.", 400)
        
        file = request.files['file']
        if file.filename == '':
            return response_error("Tên tệp tin không hợp lệ.", 400)

        # Config upload folder
        config = get_config()
        upload_folder = config.UPLOAD_FOLDER
        
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        # Safe and unique filename
        filename = secure_filename(file.filename)
        extension = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{extension}"
        
        file_path = os.path.join(upload_folder, unique_filename)
        
        try:
            file.save(file_path)
            relative_path = f"/{upload_folder}/{unique_filename}"
            return response_success(
                data={"url": relative_path},
                message="Tải ảnh đại diện lên thành công."
            )
        except Exception as e:
            return response_error(f"Lỗi khi lưu tệp tin: {str(e)}", 500)
