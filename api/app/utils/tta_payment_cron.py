import threading
import time
import re
import urllib.request
import json
import os
from sqlalchemy import select, update
from app.db.connection import engine
from app.models.schema import donhang

def check_bank_transactions_loop(app):
    url = "https://checkgd.vn/api/v1/bank-transactions?api_key=pk_24a14f93dfc10042f4c6ac27726d95f9575f53b2091dfed9&bank=MB&type=IN&page=1&limit=20"
    
    print("[Payment Cron] Background bank transaction check loop started.")
    
    while True:
        try:
            # Nghỉ 15 giây trước mỗi chu kỳ quét
            time.sleep(15)
            
            # Gọi API checkgd.vn
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
                data = json.loads(html)
                
            if not data.get("status"):
                continue
                
            transactions = data.get("transactions", [])
            if not transactions:
                continue
                
            # Duyệt qua các giao dịch nhận tiền
            for tx in transactions:
                desc = tx.get("description", "")
                amount = float(tx.get("amount", 0))
                
                # Tìm mã đơn hàng dạng DH hoặc dh hoặc Dh + số ID
                match = re.search(r'DH\s*(\d+)', desc, re.IGNORECASE)
                if not match:
                    continue
                    
                order_id = int(match.group(1))
                
                # Truy vấn đơn hàng trong DB
                stmt_select = select(donhang).where(
                    donhang.c.G5_MaDonHang == order_id,
                    donhang.c.G5_IsDeleted == 0
                )
                
                with engine.connect() as conn:
                    row = conn.execute(stmt_select).fetchone()
                    if not row:
                        continue
                        
                    order_dict = row._mapping
                    payment_status = order_dict['G5_TrangThaiThanhToan']
                    order_status = order_dict['G5_TrangThai']
                    order_total = float(order_dict['G5_TongTien'])
                    
                    # Chỉ xử lý đơn hàng chưa thanh toán và đang ở trạng thái chờ
                    if payment_status != 'Paid' and order_status in ['pending', 'Chờ xử lý', 'Chờ xác nhận']:
                        # Kiểm tra xem số tiền chuyển khoản có khớp hoặc lớn hơn tổng tiền đơn hàng không
                        if amount >= order_total:
                            # Cập nhật trạng thái thanh toán và chuyển trạng thái đơn hàng sang Đã xác nhận (Processing)
                            stmt_update = update(donhang).where(
                                donhang.c.G5_MaDonHang == order_id
                            ).values(
                                G5_TrangThaiThanhToan='Paid',
                                G5_TrangThai='Processing'
                            )
                            conn.execute(stmt_update)
                            conn.commit()
                            
                            print(f"[Payment Cron] Order {order_id} (Total: {order_total} VND) successfully paid via MB Bank! Transaction ID: {tx.get('transaction_id')}")
                            
        except Exception as e:
            # Không làm sập luồng khi xảy ra lỗi mạng hoặc lỗi API tạm thời
            print(f"[Payment Cron] Error in payment loop: {e}")

def start_payment_cron(app):
    # Tránh chạy 2 luồng song song khi Flask ở chế độ Debug (Reloader)
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' or not app.debug:
        t = threading.Thread(target=check_bank_transactions_loop, args=(app,), daemon=True)
        t.start()
