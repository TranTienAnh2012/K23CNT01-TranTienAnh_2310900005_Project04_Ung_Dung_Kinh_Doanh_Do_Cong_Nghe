from flask import request
from flask_restful import Resource
from app.modules.auth import auth_service as service
from app.utils.helpers import response_success, response_error
from app.schemas.validation_schemas import LoginSchema, validate_schema

class LoginResource(Resource):
    @validate_schema(LoginSchema)
    def post(self):
        data = request.validated_data
        result = service.authenticate_user(data['email'], data['password'])
        
        if result:
            return response_success(data=result, message="Đăng nhập thành công.")
        return response_error("Email hoặc mật khẩu không chính xác.", 401)
