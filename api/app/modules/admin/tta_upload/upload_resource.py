from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os
import uuid
from app.core.config import get_config
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class UploadResource(Resource):
    @jwt_required()
    @admin_required
    def post(self):
        # Kiểm tra file trong request
        if 'file' not in request.files:
            return response_error("Không tìm thấy tệp tin trong yêu cầu.", 400)
        
        file = request.files['file']
        if file.filename == '':
            return response_error("Tên tệp tin không hợp lệ.", 400)

        # Cấu hình thư mục upload
        config = get_config()
        upload_folder = config.UPLOAD_FOLDER
        
        # Đảm bảo thư mục tồn tại (tương đối với root project)
        # Trong config là 'static/uploads'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        # Xử lý tên file an toàn và duy nhất
        filename = secure_filename(file.filename)
        extension = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{extension}"
        
        file_path = os.path.join(upload_folder, unique_filename)
        
        try:
            file.save(file_path)
            # Trả về đường dẫn tương đối để lưu vào DB (ví dụ: /static/uploads/abc.jpg)
            relative_path = f"/{upload_folder}/{unique_filename}"
            return response_success(
                data={"url": relative_path},
                message="Tải tệp tin lên thành công."
            )
        except Exception as e:
            return response_error(f"Lỗi khi lưu tệp tin: {str(e)}", 500)
