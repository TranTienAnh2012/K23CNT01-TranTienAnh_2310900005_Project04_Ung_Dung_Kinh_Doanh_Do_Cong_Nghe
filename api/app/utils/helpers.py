from flask import jsonify

def response_success(data=None, message="Success", status=200):
    res = {"success": True, "status": "success", "message": message}
    if data is not None:
        res["data"] = data
    return res, status

def response_error(message="Error", status=400):
    return {"success": False, "status": "error", "message": message}, status
