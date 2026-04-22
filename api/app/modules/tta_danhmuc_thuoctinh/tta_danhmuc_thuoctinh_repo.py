from sqlalchemy import text
from app.db.connection import engine

def get_all(params=None):
    query = """
        SELECT dt.*, dm.G5_TenDanhMuc, tt.G5_TenThuocTinh
        FROM G5_danhmuc_thuoctinh dt
        JOIN G5_danhmuc dm ON dt.G5_MaDanhMuc = dm.G5_MaDanhMuc
        JOIN G5_thuoctinh tt ON dt.G5_ThuocTinhID = tt.G5_ThuocTinhID
    """
    args = {}
    if params and params.get('ma_danh_muc'):
        query += " WHERE dt.G5_MaDanhMuc = :ma_dm"
        args['ma_dm'] = params['ma_danh_muc']
    
    query += " ORDER BY dt.G5_MaDanhMuc, dt.G5_ThuTu"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "Id": row.G5_Id,
                "MaDanhMuc": row.G5_MaDanhMuc,
                "TenDanhMuc": row.G5_TenDanhMuc,
                "ThuocTinhID": row.G5_ThuocTinhID,
                "TenThuocTinh": row.G5_TenThuocTinh,
                "ThuTu": row.G5_ThuTu,
                "TrangThai": row.G5_TrangThai
            })
        return {"items": items, "total": len(items)}

def create(data):
    query = """
        INSERT INTO G5_danhmuc_thuoctinh (G5_MaDanhMuc, G5_ThuocTinhID, G5_ThuTu, G5_TrangThai)
        VALUES (:ma_dm, :ma_tt, :thu_tu, :trang_thai)
    """
    with engine.connect() as conn:
        conn.execute(text(query), {
            "ma_dm": data.get('MaDanhMuc'),
            "ma_tt": data.get('ThuocTinhID'),
            "thu_tu": data.get('ThuTu', 0),
            "trang_thai": data.get('TrangThai', True)
        })
        conn.commit()

def update(id, data):
    query = """
        UPDATE G5_danhmuc_thuoctinh 
        SET G5_MaDanhMuc = :ma_dm, G5_ThuocTinhID = :ma_tt, G5_ThuTu = :thu_tu, G5_TrangThai = :trang_thai
        WHERE G5_Id = :id
    """
    with engine.connect() as conn:
        conn.execute(text(query), {
            "ma_dm": data.get('MaDanhMuc'),
            "ma_tt": data.get('ThuocTinhID'),
            "thu_tu": data.get('ThuTu'),
            "trang_thai": data.get('TrangThai'),
            "id": id
        })
        conn.commit()

def delete(id):
    query = "DELETE FROM G5_danhmuc_thuoctinh WHERE G5_Id = :id"
    with engine.connect() as conn:
        conn.execute(text(query), {"id": id})
        conn.commit()

def get_by_product(ma_sp):
    query = """
        SELECT tt.G5_TenThuocTinh, dt.G5_ThuocTinhID
        FROM G5_danhmuc_thuoctinh dt
        JOIN G5_sanpham sp ON dt.G5_MaDanhMuc = sp.G5_MaDanhMuc
        JOIN G5_thuoctinh tt ON dt.G5_ThuocTinhID = tt.G5_ThuocTinhID
        WHERE sp.G5_MaSanPham = :ma_sp AND dt.G5_TrangThai = 1
        ORDER BY dt.G5_ThuTu
    """
    with engine.connect() as conn:
        result = conn.execute(text(query), {"ma_sp": ma_sp})
        items = []
        for row in result:
            items.append({
                "ThuocTinhID": row.G5_ThuocTinhID,
                "TenThuocTinh": row.G5_TenThuocTinh
            })
        return items
