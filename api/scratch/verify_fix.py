import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def verify_sql():
    print("\n--- Verifying Order Details SQL ---")
    query = """
        SELECT ct.G5_MaChiTiet AS MaChiTiet, ct.G5_MaDonHang AS MaDonHang, 
               ct.G5_MaSanPham AS MaSanPham, ct.G5_SoLuong AS SoLuong,
               sp.G5_TenSanPham AS TenSanPham, sp.G5_HinhAnh AS HinhAnh, sp.G5_GiaBan AS DonGia,
               dh.G5_HoTenNguoiNhan AS HoTenNguoiNhan, dh.G5_NgayDatHang AS NgayDatHang
        FROM G5_chitietdonhang ct
        JOIN G5_sanpham sp ON ct.G5_MaSanPham = sp.G5_MaSanPham
        JOIN G5_donhang dh ON ct.G5_MaDonHang = dh.G5_MaDonHang
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query))
            rows = result.fetchall()
            print(f"Found {len(rows)} order details.")
            for row in rows:
                print(dict(row._mapping))
    except Exception as e:
        print(f"SQL Error: {e}")

    print("\n--- Verifying Users Data ---")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT G5_MaNguoiDung, G5_HoTen, G5_VaiTro FROM G5_user WHERE G5_IsDeleted = 0"))
            rows = result.fetchall()
            print(f"Found {len(rows)} active users.")
            for row in rows:
                print(dict(row._mapping))
    except Exception as e:
        print(f"SQL Error: {e}")

if __name__ == "__main__":
    verify_sql()
