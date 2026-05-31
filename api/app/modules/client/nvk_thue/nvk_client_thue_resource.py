from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import sanpham_thue, donhang_thue, chitiet_donhang_thue, lich_su_thue, sanpham
from app.utils.helpers import response_success, response_error
from datetime import datetime
import decimal

class NvkClientSanPhamThueListResource(Resource):
    def get(self):
        stmt = select(
            sanpham_thue.c.G5_Id,
            sanpham_thue.c.G5_MaSanPham,
            sanpham_thue.c.G5_GiaThueNgay,
            sanpham_thue.c.G5_GiaThueGio,
            sanpham_thue.c.G5_SoLuongChoThue,
            sanpham_thue.c.G5_TienCoc,
            sanpham.c.G5_TenSanPham,
            sanpham.c.G5_HinhAnh
        ).select_from(
            sanpham_thue.join(sanpham, sanpham_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        )
        
        with engine.connect() as conn:
            result = conn.execute(stmt)
            items = []
            for row in result:
                item_dict = dict(row._mapping)
                for k, v in item_dict.items():
                    if isinstance(v, decimal.Decimal):
                        item_dict[k] = float(v)
                items.append(item_dict)
            return response_success(data={"items": items, "total": len(items)})

class NvkClientDonHangThueListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        stmt = select(donhang_thue).where(
            donhang_thue.c.G5_MaNguoiDung == int(user_id),
            donhang_thue.c.G5_IsDeleted == 0
        ).order_by(donhang_thue.c.G5_MaDonThue.desc())
        
        with engine.connect() as conn:
            result = conn.execute(stmt).fetchall()
            orders = []
            for row in result:
                row_dict = dict(row._mapping)
                order_id = row_dict['G5_MaDonThue']
                
                # Fetch items for this order
                stmt_items = select(
                    chitiet_donhang_thue.c.G5_SoLuong,
                    chitiet_donhang_thue.c.G5_GiaThue,
                    sanpham.c.G5_MaSanPham,
                    sanpham.c.G5_TenSanPham,
                    sanpham.c.G5_HinhAnh
                ).select_from(
                    chitiet_donhang_thue.join(sanpham, chitiet_donhang_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
                ).where(chitiet_donhang_thue.c.G5_MaDonThue == order_id)
                
                items_res = conn.execute(stmt_items)
                items = []
                for item_row in items_res:
                    item_dict = dict(item_row._mapping)
                    for k, v in item_dict.items():
                        if isinstance(v, decimal.Decimal):
                            item_dict[k] = float(v)
                    items.append(item_dict)
                
                # Convert decimal and datetime values
                for k, v in row_dict.items():
                    if isinstance(v, decimal.Decimal):
                        row_dict[k] = float(v)
                    elif isinstance(v, datetime):
                        row_dict[k] = v.isoformat()
                
                row_dict['items'] = items
                orders.append(row_dict)
            
            return response_success(data=orders)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        if not data:
            return response_error("Dữ liệu không hợp lệ.", 400)
            
        ngay_bd_str = data.get('G5_NgayBatDau')
        ngay_kt_str = data.get('G5_NgayKetThuc')
        
        try:
            ngay_bd = datetime.fromisoformat(ngay_bd_str.replace('Z', '')) if ngay_bd_str else datetime.utcnow()
            ngay_kt = datetime.fromisoformat(ngay_kt_str.replace('Z', '')) if ngay_kt_str else datetime.utcnow()
        except Exception:
            return response_error("Định dạng ngày không hợp lệ.", 400)
            
        tong_tien = data.get('G5_TongTien') or 0
        tien_coc = data.get('G5_TienCoc') or 0
        items = data.get('items') or []
        
        hoten = data.get('HoTenNguoiNhan') or ''
        sdt = data.get('SoDienThoaiNguoiNhan') or ''
        diachi = data.get('DiaChiNguoiNhan') or ''
        email = data.get('EmailNguoiNhan') or ''
        ghichu = data.get('GhiChu') or data.get('G5_GhiChu') or ''
        
        if not items:
            return response_error("Không có sản phẩm nào được chọn để thuê.", 400)
            
        try:
            with engine.begin() as conn:
                # 1. Insert order
                stmt_order = insert(donhang_thue).values(
                    G5_MaNguoiDung=int(user_id),
                    G5_NgayBatDau=ngay_bd,
                    G5_NgayKetThuc=ngay_kt,
                    G5_TongTien=tong_tien,
                    G5_TienCoc=tien_coc,
                    G5_TrangThai='Chờ xác nhận',
                    G5_TrangThaiThanhToan='Chưa thanh toán',
                    G5_HoTenNguoiNhan=hoten,
                    G5_SoDienThoaiNguoiNhan=sdt,
                    G5_DiaChiNguoiNhan=diachi,
                    G5_EmailNguoiNhan=email,
                    G5_GhiChu=ghichu,
                    G5_IsDeleted=0
                )
                res_order = conn.execute(stmt_order)
                order_id = res_order.inserted_primary_key[0]
                
                # 2. Insert items, update inventory, and log history
                for item in items:
                    ma_sp = item.get('G5_MaSanPham') or item.get('MaSanPham')
                    qty = item.get('G5_SoLuong') or item.get('SoLuong') or 1
                    gia_thue = item.get('G5_GiaThue') or item.get('GiaThue') or 0
                    
                    # Validate product stock availability
                    stmt_check_qty = select(sanpham_thue.c.G5_SoLuongChoThue).where(sanpham_thue.c.G5_MaSanPham == ma_sp)
                    avail_row = conn.execute(stmt_check_qty).fetchone()
                    if not avail_row or avail_row._mapping['G5_SoLuongChoThue'] < qty:
                        raise ValueError(f"Sản phẩm ID {ma_sp} không đủ số lượng cho thuê.")
                    
                    stmt_detail = insert(chitiet_donhang_thue).values(
                        G5_MaDonThue=order_id,
                        G5_MaSanPham=ma_sp,
                        G5_SoLuong=qty,
                        G5_GiaThue=gia_thue
                    )
                    conn.execute(stmt_detail)
                    
                    # Decrease stock quantity
                    stmt_dec_stock = update(sanpham_thue).where(
                        sanpham_thue.c.G5_MaSanPham == ma_sp
                    ).values(
                        G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue - qty
                    )
                    conn.execute(stmt_dec_stock)
                    
                    # Insert rental history entry
                    stmt_history = insert(lich_su_thue).values(
                        G5_MaSanPham=ma_sp,
                        G5_MaDonThue=order_id,
                        G5_TrangThai='Đã đặt',
                        G5_ThoiDiem=datetime.utcnow()
                    )
                    conn.execute(stmt_history)
                    
                return response_success(data={"id": order_id}, message="Đặt thuê sản phẩm thành công.")
        except ValueError as val_err:
            return response_error(str(val_err), 400)
        except Exception as e:
            return response_error(f"Lỗi hệ thống: {str(e)}", 500)

class NvkClientDonHangThueCancelResource(Resource):
    @jwt_required()
    def put(self, id):
        user_id = get_jwt_identity()
        stmt_check = select(donhang_thue.c.G5_TrangThai).where(
            donhang_thue.c.G5_MaDonThue == id,
            donhang_thue.c.G5_MaNguoiDung == int(user_id),
            donhang_thue.c.G5_IsDeleted == 0
        )
        with engine.begin() as conn:
            row = conn.execute(stmt_check).fetchone()
            if not row:
                return response_error("Đơn hàng không tồn tại.", 404)
            status = row._mapping['G5_TrangThai']
            if status not in ['Chờ xác nhận', 'Pending']:
                return response_error("Không thể hủy đơn hàng này. Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận.", 400)
                
            stmt_cancel = update(donhang_thue).where(
                donhang_thue.c.G5_MaDonThue == id
            ).values(G5_TrangThai='Đã hủy')
            conn.execute(stmt_cancel)
            
            # Restore quantity of products and log history
            stmt_details = select(
                chitiet_donhang_thue.c.G5_MaSanPham,
                chitiet_donhang_thue.c.G5_SoLuong
            ).where(chitiet_donhang_thue.c.G5_MaDonThue == id)
            p_rows = conn.execute(stmt_details).fetchall()
            for p_row in p_rows:
                ma_sp = p_row._mapping['G5_MaSanPham']
                qty = p_row._mapping['G5_SoLuong']
                
                # Increase back stock quantity
                stmt_inc_stock = update(sanpham_thue).where(
                    sanpham_thue.c.G5_MaSanPham == ma_sp
                ).values(
                    G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue + qty
                )
                conn.execute(stmt_inc_stock)
                
                stmt_history = insert(lich_su_thue).values(
                    G5_MaSanPham=ma_sp,
                    G5_MaDonThue=id,
                    G5_TrangThai='Đã hủy',
                    G5_ThoiDiem=datetime.utcnow()
                )
                conn.execute(stmt_history)
                
            return response_success(message="Hủy đặt thuê thành công.")
