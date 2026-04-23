from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import giatrithuoctinh, sanpham, thuoctinh

def get_all(params=None):
    stmt = select(
        giatrithuoctinh,
        sanpham.c.G5_TenSanPham,
        thuoctinh.c.G5_TenThuocTinh
    ).select_from(
        giatrithuoctinh.join(sanpham, giatrithuoctinh.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        .join(thuoctinh, giatrithuoctinh.c.G5_ThuocTinhID == thuoctinh.c.G5_ThuocTinhID)
    )
    
    if params and params.get('ma_sp'):
        stmt = stmt.where(giatrithuoctinh.c.G5_MaSanPham == params['ma_sp'])
    
    stmt = stmt.order_by(giatrithuoctinh.c.G5_GiaTriID.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "GiaTriID": row_dict['G5_GiaTriID'],
                "MaSanPham": row_dict['G5_MaSanPham'],
                "TenSanPham": row_dict['G5_TenSanPham'],
                "ThuocTinhID": row_dict['G5_ThuocTinhID'],
                "TenThuocTinh": row_dict['G5_TenThuocTinh'],
                "GiaTri": row_dict['G5_GiaTri']
            })
        return {"items": items, "total": len(items)}

def get_by_sanpham(ma_sp):
    stmt = select(
        giatrithuoctinh,
        thuoctinh.c.G5_TenThuocTinh
    ).select_from(
        giatrithuoctinh.join(thuoctinh, giatrithuoctinh.c.G5_ThuocTinhID == thuoctinh.c.G5_ThuocTinhID)
    ).where(giatrithuoctinh.c.G5_MaSanPham == ma_sp)
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "GiaTriID": row_dict['G5_GiaTriID'],
                "MaSanPham": row_dict['G5_MaSanPham'],
                "ThuocTinhID": row_dict['G5_ThuocTinhID'],
                "TenThuocTinh": row_dict['G5_TenThuocTinh'],
                "GiaTri": row_dict['G5_GiaTri']
            })
        return items

def create(data):
    ma_sp = data.get('MaSanPham')
    tt_id = data.get('ThuocTinhID')
    ten_tt = data.get('TenThuocTinh')
    gia_tri = data.get('GiaTri')
    
    with engine.connect() as conn:
        if not tt_id and ten_tt:
            # Check if attribute exists
            check_stmt = select(thuoctinh.c.G5_ThuocTinhID).where(thuoctinh.c.G5_TenThuocTinh == ten_tt)
            res = conn.execute(check_stmt).fetchone()
            if res:
                tt_id = res.G5_ThuocTinhID
            else:
                # Insert new attribute
                ins_stmt = insert(thuoctinh).values(G5_TenThuocTinh=ten_tt)
                conn.execute(ins_stmt)
                conn.commit()
                res = conn.execute(check_stmt).fetchone()
                tt_id = res.G5_ThuocTinhID

        stmt = insert(giatrithuoctinh).values(
            G5_MaSanPham=ma_sp,
            G5_ThuocTinhID=tt_id,
            G5_GiaTri=gia_tri
        )
        conn.execute(stmt)
        conn.commit()

def update_value(id, data):
    stmt = update(giatrithuoctinh).where(giatrithuoctinh.c.G5_GiaTriID == id).values(
        G5_GiaTri=data.get('GiaTri')
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_value(id):
    stmt = delete(giatrithuoctinh).where(giatrithuoctinh.c.G5_GiaTriID == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
