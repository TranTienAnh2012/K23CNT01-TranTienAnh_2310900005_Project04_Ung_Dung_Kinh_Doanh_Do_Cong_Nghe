from sqlalchemy import select, func, desc
from app.db.connection import engine
from app.models.schema import sanpham, user, donhang, giatrithuoctinh

def get_stats():
    """Lấy tổng số lượng của các thực thể chính trong hệ thống"""
    with engine.connect() as conn:
        # Đếm tổng sản phẩm (chưa bị xóa)
        total_products = conn.execute(select(func.count()).select_from(sanpham).where(sanpham.c.G5_IsDeleted == 0)).scalar()
        
        # Đếm tổng người dùng (chưa bị xóa)
        total_users = conn.execute(select(func.count()).select_from(user).where(user.c.G5_IsDeleted == 0)).scalar()
        
        # Đếm tổng đơn hàng (chưa bị xóa)
        total_orders = conn.execute(select(func.count()).select_from(donhang).where(donhang.c.G5_IsDeleted == 0)).scalar()
        
        # Đếm tổng thông số kỹ thuật (giá trị thuộc tính)
        total_specs = conn.execute(select(func.count()).select_from(giatrithuoctinh)).scalar()
        
        return {
            "products": total_products or 0,
            "users": total_users or 0,
            "orders": total_orders or 0,
            "specs": total_specs or 0
        }

def get_recent_activities(limit=10):
    """Lấy danh sách các hoạt động gần đây nhất từ đơn hàng và sản phẩm"""
    activities = []
    
    with engine.connect() as conn:
        # Lấy 5 đơn hàng mới nhất
        recent_orders_stmt = select(donhang).where(donhang.c.G5_IsDeleted == 0).order_by(desc(donhang.c.G5_NgayDatHang)).limit(5)
        recent_orders = conn.execute(recent_orders_stmt).fetchall()
        
        for row in recent_orders:
            r = row._mapping
            activities.append({
                "type": "order",
                "target": f"Đơn hàng #{r['G5_MaDonHang']}",
                "action": "Đơn hàng mới",
                "status": r['G5_TrangThai'],
                "time": r['G5_NgayDatHang'].isoformat() if r['G5_NgayDatHang'] else "Vừa xong",
                "icon": "shopping_cart"
            })
            
        # Lấy 5 sản phẩm mới thêm/cập nhật gần đây
        recent_products_stmt = select(sanpham).where(sanpham.c.G5_IsDeleted == 0).order_by(desc(sanpham.c.G5_NgayThem)).limit(5)
        recent_products = conn.execute(recent_products_stmt).fetchall()
        
        for row in recent_products:
            r = row._mapping
            activities.append({
                "type": "product",
                "target": r['G5_TenSanPham'],
                "action": "Sản phẩm mới",
                "status": "Active" if r['G5_TrangThai'] == 1 else "Inactive",
                "time": r['G5_NgayThem'].isoformat() if r['G5_NgayThem'] else "Vừa xong",
                "icon": "inventory_2"
            })

    # Sắp xếp lại theo thời gian (giả định list đã gần đúng, nhưng gộp chung thì nên sort)
    # Vì time là string isoformat, sort desc sẽ đưa cái mới nhất lên đầu
    activities.sort(key=lambda x: x['time'], reverse=True)
    
    return activities[:limit]
