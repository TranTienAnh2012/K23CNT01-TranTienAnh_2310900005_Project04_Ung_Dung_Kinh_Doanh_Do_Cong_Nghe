import sys
import os
import io

# Ensure output is UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

file_path = r"d:\K23CNT01-TranTienAnh_2310900005_Project04_Ung_Dung_Kinh_Doanh_Do_Cong_Nghe\G5_KD_DO_CONG_NGHE.sql"

try:
    with open(file_path, 'r', encoding='utf-16') as f:
        content = f.readlines()
        # Print first 200 lines to understand structure
        for line in content[200:628]:
            print(line.strip())
except Exception as e:
    print(f"Error: {e}")
