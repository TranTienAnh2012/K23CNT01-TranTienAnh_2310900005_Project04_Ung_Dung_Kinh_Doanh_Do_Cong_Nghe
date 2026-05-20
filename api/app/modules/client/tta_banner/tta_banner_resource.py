from flask import request
from flask_restful import Resource
from app.modules.client.tta_banner import tta_banner_service as service
from app.utils.helpers import response_success

class ClientBannerListResource(Resource):
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_banners(params)
        return response_success(data=data)
