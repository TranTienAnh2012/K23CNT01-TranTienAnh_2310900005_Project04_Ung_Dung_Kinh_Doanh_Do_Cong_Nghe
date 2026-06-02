from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import sanpham_thue, sanpham, donhang_thue, chitiet_donhang_thue, user
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

def get_sanpham_thue():
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
    
    if 'G5_IsDeleted' in [c.name for c in sanpham_thue.columns]:
        stmt = stmt.where(sanpham_thue.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(sanpham_thue.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            items.append(serialize_row(dict(row._mapping)))
        return {"items": items, "total": len(items)}

def get_donhang_thue(user_id):
    stmt = select(
        donhang_thue.c.G5_MaDonThue,
        donhang_thue.c.G5_MaNguoiDung,
        donhang_thue.c.G5_NgayBatDau,
        donhang_thue.c.G5_NgayKetThuc,
        donhang_thue.c.G5_TongTien,
        donhang_thue.c.G5_TrangThai,
        donhang_thue.c.G5_TienCoc,
        donhang_thue.c.G5_TrangThaiThanhToan,
        donhang_thue.c.G5_NgayTraThucTe,
        donhang_thue.c.G5_HoTenNguoiNhan,
        donhang_thue.c.G5_SoDienThoaiNguoiNhan,
        donhang_thue.c.G5_DiaChiNguoiNhan,
        donhang_thue.c.G5_EmailNguoiNhan,
        donhang_thue.c.G5_GhiChu
    ).where(
        donhang_thue.c.G5_MaNguoiDung == user_id
    )
    
    if 'G5_IsDeleted' in [c.name for c in donhang_thue.columns]:
        stmt = stmt.where(donhang_thue.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(donhang_thue.c.G5_MaDonThue.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt).fetchall()
        items = []
        for row in result:
            row_dict = serialize_row(dict(row._mapping))
            order_id = row_dict['G5_MaDonThue']
            
            # Fetch nested items
            stmt_details = select(
                chitiet_donhang_thue.c.G5_SoLuong,
                chitiet_donhang_thue.c.G5_GiaThue,
                sanpham.c.G5_MaSanPham,
                sanpham.c.G5_TenSanPham,
                sanpham.c.G5_HinhAnh
            ).select_from(
                chitiet_donhang_thue.join(sanpham, chitiet_donhang_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
            ).where(chitiet_donhang_thue.c.G5_MaDonThue == order_id)
            
            details_res = conn.execute(stmt_details)
            details = [serialize_row(dict(d_row._mapping)) for d_row in details_res]
            row_dict['items'] = details
            items.append(row_dict)
            
        return items

def create_donhang_thue(user_id, data):
    order_data = {
        'G5_MaNguoiDung': user_id,
        'G5_NgayBatDau': datetime.datetime.fromisoformat(data.get('G5_NgayBatDau')),
        'G5_NgayKetThuc': datetime.datetime.fromisoformat(data.get('G5_NgayKetThuc')),
        'G5_TongTien': float(data.get('G5_TongTien')),
        'G5_TienCoc': float(data.get('G5_TienCoc')),
        'G5_TrangThai': 'Chờ xác nhận',
        'G5_TrangThaiThanhToan': 'Chưa thanh toán',
        'G5_HoTenNguoiNhan': data.get('HoTenNguoiNhan'),
        'G5_SoDienThoaiNguoiNhan': data.get('SoDienThoaiNguoiNhan'),
        'G5_EmailNguoiNhan': data.get('EmailNguoiNhan'),
        'G5_DiaChiNguoiNhan': data.get('DiaChiNguoiNhan'),
        'G5_GhiChu': data.get('GhiChu'),
        'G5_IsDeleted': 0
    }
    
    with engine.begin() as conn:
        # 1. Insert order
        stmt_order = insert(donhang_thue).values(**order_data)
        result = conn.execute(stmt_order)
        order_id = result.inserted_primary_key[0]
        
        # 2. Insert items and decrease inventory
        for item in data.get('items', []):
            ma_sp = int(item.get('G5_MaSanPham'))
            qty = int(item.get('G5_SoLuong'))
            gia_thue = float(item.get('G5_GiaThue'))
            
            stmt_detail = insert(chitiet_donhang_thue).values(
                G5_MaDonThue=order_id,
                G5_MaSanPham=ma_sp,
                G5_SoLuong=qty,
                G5_GiaThue=gia_thue
            )
            conn.execute(stmt_detail)
            
            stmt_dec = update(sanpham_thue).where(
                sanpham_thue.c.G5_MaSanPham == ma_sp
            ).values(
                G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue - qty
            )
            conn.execute(stmt_dec)
            
        return order_id

def cancel_donhang_thue(user_id, order_id):
    # Fetch order to verify ownership and current status
    stmt_order = select(donhang_thue.c.G5_TrangThai).where(
        (donhang_thue.c.G5_MaDonThue == order_id) & 
        (donhang_thue.c.G5_MaNguoiDung == user_id)
    )
    
    with engine.begin() as conn:
        row = conn.execute(stmt_order).fetchone()
        if not row:
            return False, "Không tìm thấy đơn đặt thuê."
            
        status = row._mapping['G5_TrangThai']
        if status not in ['Chờ xác nhận', 'Pending']:
            return False, "Chỉ có thể hủy đơn đặt thuê ở trạng thái Chờ xác nhận."
            
        # Update order status to Cancelled
        stmt_cancel = update(donhang_thue).where(
            donhang_thue.c.G5_MaDonThue == order_id
        ).values(
            G5_TrangThai='Đã hủy'
        )
        conn.execute(stmt_cancel)
        
        # Fetch details to restore inventory
        stmt_details = select(
            chitiet_donhang_thue.c.G5_MaSanPham,
            chitiet_donhang_thue.c.G5_SoLuong
        ).where(
            chitiet_donhang_thue.c.G5_MaDonThue == order_id
        )
        details = conn.execute(stmt_details).fetchall()
        for d in details:
            ma_sp = d._mapping['G5_MaSanPham']
            qty = d._mapping['G5_SoLuong']
            
            stmt_inc = update(sanpham_thue).where(
                sanpham_thue.c.G5_MaSanPham == ma_sp
            ).values(
                G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue + qty
            )
            conn.execute(stmt_inc)
            
        return True, "Hủy đơn đặt thuê thành công."
