from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import chitiet_donhang_thue

import datetime
import decimal

def serialize_row(row_dict):
    if not row_dict:
        return None
    new_dict = {}
    for k, v in row_dict.items():
        if isinstance(v, (datetime.datetime, datetime.date)):
            new_dict[k] = v.isoformat()
        elif isinstance(v, decimal.Decimal):
            new_dict[k] = float(v)
        else:
            new_dict[k] = v
    return new_dict

def get_all(params=None):
    from app.models.schema import donhang_thue, user, sanpham
    
    stmt = select(
        chitiet_donhang_thue.c.G5_Id,
        chitiet_donhang_thue.c.G5_MaDonThue,
        chitiet_donhang_thue.c.G5_MaSanPham,
        chitiet_donhang_thue.c.G5_SoLuong,
        chitiet_donhang_thue.c.G5_GiaThue,
        donhang_thue.c.G5_MaNguoiDung,
        donhang_thue.c.G5_NgayBatDau,
        donhang_thue.c.G5_NgayKetThuc,
        user.c.G5_HoTen,
        user.c.G5_Email,
        user.c.G5_SDT,
        donhang_thue.c.G5_HoTenNguoiNhan,
        donhang_thue.c.G5_SoDienThoaiNguoiNhan,
        donhang_thue.c.G5_DiaChiNguoiNhan,
        donhang_thue.c.G5_EmailNguoiNhan,
        donhang_thue.c.G5_GhiChu,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh
    ).select_from(
        chitiet_donhang_thue
        .join(donhang_thue, chitiet_donhang_thue.c.G5_MaDonThue == donhang_thue.c.G5_MaDonThue)
        .outerjoin(user, donhang_thue.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
        .join(sanpham, chitiet_donhang_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    )
    
    if 'G5_IsDeleted' in [c.name for c in chitiet_donhang_thue.columns]:
        stmt = stmt.where(chitiet_donhang_thue.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(chitiet_donhang_thue.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [serialize_row(dict(row._mapping)) for row in result]
        return {"items": items, "total": len(items)}

def get_by_id(id):
    from app.models.schema import donhang_thue, user, sanpham
    
    stmt = select(
        chitiet_donhang_thue.c.G5_Id,
        chitiet_donhang_thue.c.G5_MaDonThue,
        chitiet_donhang_thue.c.G5_MaSanPham,
        chitiet_donhang_thue.c.G5_SoLuong,
        chitiet_donhang_thue.c.G5_GiaThue,
        donhang_thue.c.G5_MaNguoiDung,
        donhang_thue.c.G5_NgayBatDau,
        donhang_thue.c.G5_NgayKetThuc,
        user.c.G5_HoTen,
        user.c.G5_Email,
        user.c.G5_SDT,
        donhang_thue.c.G5_HoTenNguoiNhan,
        donhang_thue.c.G5_SoDienThoaiNguoiNhan,
        donhang_thue.c.G5_DiaChiNguoiNhan,
        donhang_thue.c.G5_EmailNguoiNhan,
        donhang_thue.c.G5_GhiChu,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh
    ).select_from(
        chitiet_donhang_thue
        .join(donhang_thue, chitiet_donhang_thue.c.G5_MaDonThue == donhang_thue.c.G5_MaDonThue)
        .outerjoin(user, donhang_thue.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
        .join(sanpham, chitiet_donhang_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    ).where(chitiet_donhang_thue.c.G5_Id == id)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        return serialize_row(dict(row._mapping))

def is_order_active(conn, order_id):
    from app.models.schema import donhang_thue
    stmt = select(donhang_thue.c.G5_TrangThai).where(donhang_thue.c.G5_MaDonThue == order_id)
    row = conn.execute(stmt).fetchone()
    if not row:
        return False
    status = row._mapping['G5_TrangThai']
    return status in [None, 'Chờ xác nhận', 'Đang thuê', 'Đã duyệt', 'Pending', 'Active', 'Approved']

def recalculate_order_total(conn, order_id):
    from app.models.schema import donhang_thue, chitiet_donhang_thue
    import math
    
    stmt_order = select(donhang_thue.c.G5_NgayBatDau, donhang_thue.c.G5_NgayKetThuc).where(donhang_thue.c.G5_MaDonThue == order_id)
    order_row = conn.execute(stmt_order).fetchone()
    if not order_row:
        return
    
    ngay_bd = order_row._mapping['G5_NgayBatDau']
    ngay_kt = order_row._mapping['G5_NgayKetThuc']
    
    days = 1
    if ngay_bd and ngay_kt:
        try:
            diff = ngay_kt - ngay_bd
            days = math.ceil(diff.total_seconds() / (24 * 3600))
            if days <= 0:
                days = 1
        except Exception:
            days = 1
            
    from app.models.schema import sanpham_thue
    stmt_details = select(
        chitiet_donhang_thue.c.G5_GiaThue,
        chitiet_donhang_thue.c.G5_SoLuong,
        sanpham_thue.c.G5_TienCoc
    ).select_from(
        chitiet_donhang_thue.outerjoin(sanpham_thue, chitiet_donhang_thue.c.G5_MaSanPham == sanpham_thue.c.G5_MaSanPham)
    ).where(chitiet_donhang_thue.c.G5_MaDonThue == order_id)
    # Filter out deleted items if column exists
    if 'G5_IsDeleted' in [c.name for c in chitiet_donhang_thue.columns]:
        stmt_details = stmt_details.where(chitiet_donhang_thue.c.G5_IsDeleted == 0)
        
    details = conn.execute(stmt_details).fetchall()
    
    total = 0
    total_deposit = 0
    for detail in details:
        price = float(detail._mapping['G5_GiaThue'] or 0)
        qty = int(detail._mapping['G5_SoLuong'] or 0)
        dep = float(detail._mapping['G5_TienCoc'] or 0)
        total += price * qty * days
        total_deposit += dep * qty
        
    stmt_update = update(donhang_thue).where(donhang_thue.c.G5_MaDonThue == order_id).values(
        G5_TongTien=total,
        G5_TienCoc=total_deposit
    )
    conn.execute(stmt_update)

def create(data):
    from app.models.schema import sanpham_thue
    
    ma_sp = data.get('G5_MaSanPham')
    qty = int(data.get('G5_SoLuong') or 1)
    
    with engine.begin() as conn:
        if 'G5_GiaThue' not in data or data['G5_GiaThue'] is None:
            stmt_price = select(sanpham_thue.c.G5_GiaThueNgay).where(sanpham_thue.c.G5_MaSanPham == ma_sp)
            price_row = conn.execute(stmt_price).fetchone()
            if price_row and price_row._mapping['G5_GiaThueNgay'] is not None:
                data['G5_GiaThue'] = price_row._mapping['G5_GiaThueNgay']
            else:
                data['G5_GiaThue'] = 0
                
        stmt = insert(chitiet_donhang_thue).values(**data)
        conn.execute(stmt)
        
        order_id = data.get('G5_MaDonThue')
        if order_id and is_order_active(conn, order_id):
            stmt_dec = update(sanpham_thue).where(
                sanpham_thue.c.G5_MaSanPham == ma_sp
            ).values(
                G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue - qty
            )
            conn.execute(stmt_dec)
            
        if order_id:
            recalculate_order_total(conn, order_id)

def update_item(id, data):
    from app.models.schema import sanpham_thue
    
    with engine.begin() as conn:
        stmt_old = select(chitiet_donhang_thue).where(chitiet_donhang_thue.c.G5_Id == id)
        old_row = conn.execute(stmt_old).fetchone()
        if not old_row:
            return
        
        old_qty = int(old_row._mapping['G5_SoLuong'] or 0)
        ma_sp = old_row._mapping['G5_MaSanPham']
        order_id = old_row._mapping['G5_MaDonThue']
        
        stmt = update(chitiet_donhang_thue).where(chitiet_donhang_thue.c.G5_Id == id).values(**data)
        conn.execute(stmt)
        
        new_qty = int(data.get('G5_SoLuong') if 'G5_SoLuong' in data else old_qty)
        if order_id and is_order_active(conn, order_id):
            diff = new_qty - old_qty
            if diff != 0:
                stmt_adjust = update(sanpham_thue).where(
                    sanpham_thue.c.G5_MaSanPham == ma_sp
                ).values(
                    G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue - diff
                )
                conn.execute(stmt_adjust)
                
        if order_id:
            recalculate_order_total(conn, order_id)

def delete_item(id):
    from app.models.schema import sanpham_thue
    
    with engine.begin() as conn:
        stmt_old = select(chitiet_donhang_thue).where(chitiet_donhang_thue.c.G5_Id == id)
        old_row = conn.execute(stmt_old).fetchone()
        if not old_row:
            return
            
        qty = int(old_row._mapping['G5_SoLuong'] or 0)
        ma_sp = old_row._mapping['G5_MaSanPham']
        order_id = old_row._mapping['G5_MaDonThue']
        
        if 'G5_IsDeleted' in [c.name for c in chitiet_donhang_thue.columns]:
            stmt = update(chitiet_donhang_thue).where(chitiet_donhang_thue.c.G5_Id == id).values(G5_IsDeleted=1)
        else:
            stmt = delete(chitiet_donhang_thue).where(chitiet_donhang_thue.c.G5_Id == id)
        conn.execute(stmt)
        
        if order_id and is_order_active(conn, order_id):
            stmt_inc = update(sanpham_thue).where(
                sanpham_thue.c.G5_MaSanPham == ma_sp
            ).values(
                G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue + qty
            )
            conn.execute(stmt_inc)
            
        if order_id:
            recalculate_order_total(conn, order_id)
