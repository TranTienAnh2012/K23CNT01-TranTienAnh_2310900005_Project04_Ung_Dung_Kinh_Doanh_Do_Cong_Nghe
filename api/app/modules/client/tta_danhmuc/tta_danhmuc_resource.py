from flask import request
from flask_restful import Resource
from app.modules.client.tta_danhmuc import tta_danhmuc_service as service
from app.utils.helpers import response_success

class ClientDanhMucListResource(Resource):
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_categories(params)
        return response_success(data=data)
