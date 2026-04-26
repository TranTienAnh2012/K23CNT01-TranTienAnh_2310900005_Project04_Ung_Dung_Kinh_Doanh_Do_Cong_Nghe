import sys
import os
from datetime import datetime

# Add the api directory to the path so we can import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.modules.tta_voucher import tta_voucher_repo as repo

test_data = {
    'Name': 'Test Voucher',
    'Code': 'TEST' + datetime.now().strftime('%H%M%S'),
    'Description': 'Test Description',
    'DiscountType': 'fixed',
    'DiscountValue': '100000',
    'MinOrderValue': '500000',
    'MaxDiscount': '200000',
    'StartDate': '2026-04-23T16:37',
    'EndDate': '2026-05-30T23:36',
    'TotalQuantity': '100',
    'UserIdCreate': 1, # Make sure this user exists or the FK allows it
    'ApplyToAll': 1,
    'Status': 'active'
}

try:
    print("Attempting to create voucher...")
    repo.create(test_data)
    print("Voucher created successfully!")
except Exception as e:
    print(f"Error creating voucher: {e}")
    import traceback
    traceback.print_exc()
