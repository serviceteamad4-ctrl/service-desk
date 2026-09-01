import os
from pathlib import Path

import pandas as pd
import requests
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent
EXCEL_FILE = next((str(path) for path in sorted(BASE_DIR.glob("DataServiceDR*.xlsx"))), str(BASE_DIR / "DataServiceDR.xlsx"))
API_URL = "http://localhost:4001/api/requests"


def normalize_datetime(value):
    if pd.isna(value):
        return None
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).isoformat()
        except Exception:
            try:
                return pd.to_datetime(value).isoformat()
            except Exception:
                return None
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            return None
    return str(value)


def main():
    if not os.path.exists(EXCEL_FILE):
        raise FileNotFoundError(f"ไม่พบไฟล์ Excel: {EXCEL_FILE}")

    print(f"กำลังอ่านไฟล์: {EXCEL_FILE}")
    df = pd.read_excel(EXCEL_FILE)
    print(f"พบข้อมูล {len(df)} rows")

    for index, row in df.iterrows():
        payload = {
            "customer": str(row.get("ลูกค้า", "") or ""),
            "ref": str(row.get("ระดับ", "") or "") or str(row.get("Ref.", "") or ""),
            "source": str(row.get("ช่องทาง", "") or ""),
            "receivedAt": normalize_datetime(row.get("วันเวลารับแจ้ง")),
            "ticket": str(row.get("เลขติดตาม", "") or ""),
            "location": str(row.get("สถานที่", "") or ""),
            "contact": str(row.get("ผู้ติดต่อ", "") or ""),
            "description": str(row.get("รายละเอียด", "") or ""),
            "jobType": str(row.get("ลักษณะงาน", "") or ""),
            "status": str(row.get("สถานะ", "") or ""),
            "assignee": str(row.get("ผู้ดำเนินการ", "") or ""),
            "appointment": normalize_datetime(row.get("วันเวลานัดหมาย")),
            "completedAt": normalize_datetime(row.get("วันเวลาเสร็จ")),
            "action": str(row.get("การดำเนินการ", "") or ""),
            "notes": str(row.get("หมายเหตุ", "") or "")
        }

        response = requests.post(API_URL, json=payload, timeout=30)
        print(f"Row {index + 1}: status={response.status_code} customer={payload['customer']}")

        if response.status_code >= 400:
            print(response.text)

    print("Import complete")


if __name__ == "__main__":
    main()
