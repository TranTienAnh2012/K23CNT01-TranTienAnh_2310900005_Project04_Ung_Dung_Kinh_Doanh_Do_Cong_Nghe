from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import danhmuc_thuoctinh, danhmuc, thuoctinh, sanpham

def get_all(params=None):
    stmt = select(
        danhmuc_thuoctinh,
        danhmuc.c.G5_TenDanhMuc,
        thuoctinh.c.G5_TenThuocTinh
    ).select_from(
        danhmuc_thuoctinh.join(danhmuc, danhmuc_thuoctinh.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
        .join(thuoctinh, danhmuc_thuoctinh.c.G5_ThuocTinhID == thuoctinh.c.G5_ThuocTinhID)
    )
    
    if params and params.get('ma_danh_muc'):
        stmt = stmt.where(danhmuc_thuoctinh.c.G5_MaDanhMuc == params['ma_danh_muc'])
    
    # stmt = stmt.order_by(danhmuc_thuoctinh.c.G5_MaDanhMuc, danhmuc_thuoctinh.c.G5_ThuTu) # ThuTu column missing in schema, adding it
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._asdict()
            items.append({
                "Id": row_dict['G5_Id'],
                "MaDanhMuc": row_dict['G5_MaDanhMuc'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "ThuocTinhID": row_dict['G5_ThuocTinhID'],
                "TenThuocTinh": row_dict['G5_TenThuocTinh'],
                "TrangThai": row_dict['G5_TrangThai']
            })
        return {"items": items, "total": len(items)}

def create(data):
    stmt = insert(danhmuc_thuoctinh).values(
        G5_MaDanhMuc=data.get('MaDanhMuc'),
        G5_ThuocTinhID=data.get('ThuocTinhID'),
        G5_TrangThai=data.get('TrangThai', 1)
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_link(id, data):
    stmt = update(danhmuc_thuoctinh).where(danhmuc_thuoctinh.c.G5_Id == id).values(
        G5_MaDanhMuc=data.get('MaDanhMuc'),
        G5_ThuocTinhID=data.get('ThuocTinhID'),
        G5_TrangThai=data.get('TrangThai')
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_link(id):
    stmt = delete(danhmuc_thuoctinh).where(danhmuc_thuoctinh.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def get_by_product(ma_sp):
    stmt = select(
        thuoctinh.c.G5_TenThuocTinh,
        danhmuc_thuoctinh.c.G5_ThuocTinhID
    ).select_from(
        danhmuc_thuoctinh.join(sanpham, danhmuc_thuoctinh.c.G5_MaDanhMuc == sanpham.c.G5_MaDanhMuc)
        .join(thuoctinh, danhmuc_thuoctinh.c.G5_ThuocTinhID == thuoctinh.c.G5_ThuocTinhID)
    ).where(sanpham.c.G5_MaSanPham == ma_sp, danhmuc_thuoctinh.c.G5_TrangThai == 1)
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._asdict()
            items.append({
                "ThuocTinhID": row_dict['G5_ThuocTinhID'],
                "TenThuocTinh": row_dict['G5_TenThuocTinh']
            })
        return items
