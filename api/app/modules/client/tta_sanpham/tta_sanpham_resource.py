from flask import request
from flask_restful import Resource
from app.modules.client.tta_sanpham import tta_sanpham_service as service
from app.utils.helpers import response_success, response_error

class ClientSanPhamListResource(Resource):
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_products(params)
        return response_success(data=data)

class ClientSanPhamResource(Resource):
    def get(self, ma):
        data = service.get_product_detail(ma)
        if not data:
            return response_error("Sản phẩm không tồn tại.", 404)
        return response_success(data=data)
