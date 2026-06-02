from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, update
from app.db.connection import engine
from app.models.schema import user, dichvu_tuvan, lich_tuvan
from app.utils.helpers import response_success, response_error
from app.modules.Nhanvien.nvk_lich_tuvan import nvk_lich_tuvan_service as schedule_service
from app.modules.Nhanvien.nvk_dichvu_tuvan import nvk_dichvu_tuvan_service as service_service
from datetime import datetime

class ClientDichVuTuVanListResource(Resource):
    def get(self):
        data = service_service.get_all()
        return response_success(data=data)

class ClientStaffListResource(Resource):
    def get(self):
        stmt = select(
            user.c.G5_MaNguoiDung,
            user.c.G5_HoTen,
            user.c.G5_AvatarUrl
        ).where(user.c.G5_VaiTro == 'nhanvien', user.c.G5_IsDeleted == 0)
        with engine.connect() as conn:
            result = conn.execute(stmt)
            staff_list = [dict(row._mapping) for row in result]
            return response_success(data={"items": staff_list, "total": len(staff_list)})

class ClientLichTuVanListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        params = {"G5_MaNguoiDung": int(user_id)}
        data = schedule_service.get_all(params)
        return response_success(data=data)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        if not data:
            return response_error("Dữ liệu không hợp lệ.", 400)
            
        data['G5_MaNguoiDung'] = int(user_id)
        data['G5_TrangThai'] = 'Chờ xác nhận'
        data['G5_IsDeleted'] = 0
        
        # 1. Parse dates and check staff overlap if a specific staff member is selected
        if data.get('G5_MaNhanVien') and data.get('G5_ThoiGianBatDau') and data.get('G5_ThoiGianKetThuc'):
            staff_id = int(data['G5_MaNhanVien'])
            start_str = data['G5_ThoiGianBatDau'].replace('Z', '').split('.')[0]
            end_str = data['G5_ThoiGianKetThuc'].replace('Z', '').split('.')[0]
            try:
                start_dt = datetime.fromisoformat(start_str)
                end_dt = datetime.fromisoformat(end_str)
            except ValueError:
                try:
                    start_dt = datetime.strptime(start_str, "%Y-%m-%d %H:%M:%S")
                    end_dt = datetime.strptime(end_str, "%Y-%m-%d %H:%M:%S")
                except Exception as ex:
                    return response_error(f"Định dạng thời gian không hợp lệ: {str(ex)}", 400)
                    
            from app.models.schema import lich_tuvan_nhanvien
            stmt_overlap = select(lich_tuvan).select_from(
                lich_tuvan.join(lich_tuvan_nhanvien, lich_tuvan.c.G5_Id == lich_tuvan_nhanvien.c.G5_MaLich)
            ).where(
                lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_id,
                lich_tuvan.c.G5_TrangThai.in_(['Chờ xác nhận', 'Đã xác nhận']),
                lich_tuvan.c.G5_ThoiGianBatDau < end_dt,
                lich_tuvan.c.G5_ThoiGianKetThuc > start_dt,
                lich_tuvan.c.G5_IsDeleted == 0
            )
            with engine.connect() as conn:
                overlap_row = conn.execute(stmt_overlap).fetchone()
                if overlap_row:
                    return response_error("Nhân viên tư vấn này đã có lịch hẹn trùng lặp trong khoảng thời gian này. Vui lòng chọn thời gian khác hoặc để trống phần Nhân Viên để hệ thống tự động sắp xếp.", 400)

        try:
            schedule_service.create(data)
            return response_success(message="Đặt lịch tư vấn thành công.")
        except Exception as e:
            return response_error(f"Lỗi: {str(e)}", 500)

class ClientLichTuVanCancelResource(Resource):
    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        if not data or 'G5_Id' not in data:
            return response_error("Thiếu ID lịch tư vấn.", 400)
            
        schedule_id = int(data['G5_Id'])
        # Verify the appointment belongs to the user and can be cancelled
        stmt_check = select(lich_tuvan).where(
            lich_tuvan.c.G5_Id == schedule_id,
            lich_tuvan.c.G5_MaNguoiDung == int(user_id)
        )
        with engine.connect() as conn:
            row = conn.execute(stmt_check).fetchone()
            if not row:
                return response_error("Không tìm thấy lịch tư vấn hoặc không có quyền truy cập.", 404)
            
            # Update status to 'Đã hủy'
            stmt_update = update(lich_tuvan).where(
                lich_tuvan.c.G5_Id == schedule_id
            ).values(G5_TrangThai='Đã hủy')
            conn.execute(stmt_update)
            conn.commit()
            
        return response_success(message="Đã hủy lịch tư vấn thành công.")
