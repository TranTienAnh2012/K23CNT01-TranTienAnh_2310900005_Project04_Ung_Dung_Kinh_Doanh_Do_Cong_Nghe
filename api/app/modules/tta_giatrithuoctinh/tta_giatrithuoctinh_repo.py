from sqlalchemy import text
from app.db.connection import engine

def get_all(params=None):
    query = """
        SELECT gt.*, sp.G5_TenSanPham, tt.G5_TenThuocTinh
        FROM G5_giatrithuoctinh gt
        JOIN G5_sanpham sp ON gt.G5_MaSanPham = sp.G5_MaSanPham
        JOIN G5_thuoctinh tt ON gt.G5_ThuocTinhID = tt.G5_ThuocTinhID
    """
    args = {}
    if params and params.get('ma_sp'):
        query += " WHERE gt.G5_MaSanPham = :ma_sp"
        args['ma_sp'] = params['ma_sp']
    
    query += " ORDER BY gt.G5_GiaTriID DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "GiaTriID": row.G5_GiaTriID,
                "MaSanPham": row.G5_MaSanPham,
                "TenSanPham": row.G5_TenSanPham,
                "ThuocTinhID": row.G5_ThuocTinhID,
                "TenThuocTinh": row.G5_TenThuocTinh,
                "GiaTri": row.G5_GiaTri
            })
        return {"items": items, "total": len(items)}

def get_by_sanpham(ma_sp):
    query = """
        SELECT gt.*, tt.G5_TenThuocTinh
        FROM G5_giatrithuoctinh gt
        JOIN G5_thuoctinh tt ON gt.G5_ThuocTinhID = tt.G5_ThuocTinhID
        WHERE gt.G5_MaSanPham = :ma_sp
    """
    with engine.connect() as conn:
        result = conn.execute(text(query), {"ma_sp": ma_sp})
        items = []
        for row in result:
            items.append({
                "GiaTriID": row.G5_GiaTriID,
                "MaSanPham": row.G5_MaSanPham,
                "ThuocTinhID": row.G5_ThuocTinhID,
                "TenThuocTinh": row.G5_TenThuocTinh,
                "GiaTri": row.G5_GiaTri
            })
        return items

def create(data):
    ma_sp = data.get('MaSanPham')
    tt_id = data.get('ThuocTinhID')
    ten_tt = data.get('TenThuocTinh')
    gia_tri = data.get('GiaTri')
    
    with engine.connect() as conn:
        if not tt_id and ten_tt:
            check_q = "SELECT G5_ThuocTinhID FROM G5_thuoctinh WHERE G5_TenThuocTinh = :name"
            res = conn.execute(text(check_q), {"name": ten_tt}).fetchone()
            if res:
                tt_id = res.G5_ThuocTinhID
            else:
                ins_tt = "INSERT INTO G5_thuoctinh (G5_TenThuocTinh, G5_TrangThai) VALUES (:name, 1)"
                conn.execute(text(ins_tt), {"name": ten_tt})
                conn.commit()
                res = conn.execute(text(check_q), {"name": ten_tt}).fetchone()
                tt_id = res.G5_ThuocTinhID

        query = """
            INSERT INTO G5_giatrithuoctinh (G5_MaSanPham, G5_ThuocTinhID, G5_GiaTri)
            VALUES (:ma_sp, :ma_tt, :gia_tri)
        """
        conn.execute(text(query), {
            "ma_sp": ma_sp,
            "ma_tt": tt_id,
            "gia_tri": gia_tri
        })
        conn.commit()

def update(id, data):
    query = """
        UPDATE G5_giatrithuoctinh 
        SET G5_GiaTri = :gia_tri
        WHERE G5_GiaTriID = :id
    """
    with engine.connect() as conn:
        conn.execute(text(query), {
            "gia_tri": data.get('GiaTri'),
            "id": id
        })
        conn.commit()

def delete(id):
    query = "DELETE FROM G5_giatrithuoctinh WHERE G5_GiaTriID = :id"
    with engine.connect() as conn:
        conn.execute(text(query), {"id": id})
        conn.commit()
