# Service Desk API - คู่มือการใช้งาน

## 🚀 วิธีเริ่มต้นระบบ

### ขั้นตอน 1: เปิด Backend API (Express + Prisma + SQLite)

**ทำครั้งแรก (สร้าง database schema):**
```bash
cd D:\report 2.0\server
npx prisma db push
```

**เปิด API server:**
```bash
cd D:\report 2.0\server
npm run dev
# หรือ
node src/server.js
```

API จะรัน: **http://localhost:4001**

---

### ขั้นตอน 2: เปิด Frontend (Vite Dev Server)

```bash
cd D:\report 2.0
npm run dev
```

Frontend จะรัน: **http://localhost:5173**

---

## 📡 API Endpoints ที่ใช้งาน

| Method | URL | ใช้งาน |
|--------|-----|--------|
| **GET** | `/api/health` | ตรวจสอบว่า API ยังทำงาน |
| **GET** | `/api/requests` | ดึงข้อมูลงานทั้งหมด |
| **GET** | `/api/requests/:id` | ดึงข้อมูลงาน 1 รายการ |
| **POST** | `/api/requests` | เพิ่มงานใหม่ |
| **PUT** | `/api/requests/:id` | แก้ไขงาน |
| **DELETE** | `/api/requests/:id` | ลบงาน |

---

## 🗄️ เครื่องมือจัดการ Database

### 1️⃣ **Prisma Studio** (ตัวจัดการ UI ยอดนิยม)

```bash
cd D:\report 2.0\server
npx prisma studio
```

จะเปิด UI ที่ http://localhost:5555 แสดงข้อมูล database แบบ GUI

---

### 2️⃣ **DB Browser for SQLite** (โปรแกรมตั้งโต้จอ)

ดาวน์โหลด: https://sqlitebrowser.org/

ขั้นตอน:
1. เปิด DB Browser for SQLite
2. File → Open → `D:\report 2.0\server\data\service_desk.db`
3. ดูข้อมูลใน Data tab
4. เขียน SQL ใน Execute SQL tab

---

### 3️⃣ **Command Line (PowerShell/CMD)**

**ดึงข้อมูลทั้งหมด:**
```powershell
$data = Invoke-RestMethod -Uri 'http://localhost:4001/api/requests'
$data | ConvertTo-Json -Depth 5 | Out-File data.json
```

**เพิ่มงาน:**
```powershell
$body = '{"customer":"BMN","ref":"BMN-001","description":"Test"}'
Invoke-RestMethod -Uri 'http://localhost:4001/api/requests' `
  -Method POST `
  -ContentType 'application/json' `
  -Body $body
```

**แก้ไขงาน:**
```powershell
$body = '{"customer":"BMN Updated","ref":"BMN-001"}'
Invoke-RestMethod -Uri 'http://localhost:4001/api/requests/[ID]' `
  -Method PUT `
  -ContentType 'application/json' `
  -Body $body
```

**ลบงาน:**
```powershell
Invoke-RestMethod -Uri 'http://localhost:4001/api/requests/[ID]' `
  -Method DELETE
```

---

### 4️⃣ **VSCode (แก้ไข SQLite โดยตรง)**

ติดตั้ง extension:
1. VSCode → Extensions
2. ค้นหา "SQLite"
3. ติดตั้ง "SQLite" โดย alexcvzz

จากนั้นคลิกขวา `server/data/service_desk.db` → Open Database

---

## 📊 โครงสร้าง Database (Prisma Schema)

ไฟล์: `server/prisma/schema.prisma`

```prisma
model Request {
  id              String    @id @default(uuid())
  customer        String
  ref             String?
  source          String?
  receivedAt      DateTime?
  ticket          String?
  location        String?
  status          String?
  assignee        String?
  appointment     DateTime?
  description     String?
  action          String?
  completedAt     DateTime?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  // ... และอื่นๆ
}
```

---

## 💾 การ Backup และ Export ข้อมูล

### Backup SQLite Database

```bash
# ก็อป ไฟล์ database ที่อยู่ที่
# D:\report 2.0\server\data\service_desk.db
# ไปยังที่อื่นเป็น backup
```

### Export เป็น CSV

ใน Frontend → คลิก "ดาวน์โหลด CSV" จะดาวน์โหลดอัตโนมัติ

### Export เป็น JSON

```powershell
$data = Invoke-RestMethod -Uri 'http://localhost:4001/api/requests'
$data | ConvertTo-Json -Depth 5 | Out-File "backup-$(Get-Date -Format 'yyyy-MM-dd').json"
```

---

## 🔌 การเชื่อมต่อ API จากแอปอื่น

### Python
```python
import requests

# ดึงข้อมูล
response = requests.get('http://localhost:4001/api/requests')
data = response.json()
print(data)

# เพิ่มงาน
new_request = {
    "customer": "Test Co",
    "ref": "TEST-001",
    "description": "Test"
}
response = requests.post('http://localhost:4001/api/requests', json=new_request)
print(response.json())
```

### Node.js
```javascript
// ดึงข้อมูล
fetch('http://localhost:4001/api/requests')
  .then(r => r.json())
  .then(data => console.log(data))

// เพิ่มงาน
fetch('http://localhost:4001/api/requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ customer: "Test", ref: "TEST-001" })
})
```

---

## 📌 ขั้นตอนอัพเดท Ref ใหม่ (ถ้าอยากเปลี่ยนจาก Priority)

**ไฟล์ที่แก้ไข:** `server/prisma/schema.prisma`

เพิ่มฟิลด์ใหม่:
```prisma
model Request {
  id        String  @id @default(uuid())
  // ... ฟิลด์อื่น
  ref       String?  // ← Ref (Priority ใหม่)
  // ... ฟิลด์อื่น
}
```

จากนั้นรัน:
```bash
npx prisma db push
```

---

## 🛠️ หากต้องการเปลี่ยน Database เป็น PostgreSQL

ไฟล์ที่แก้ไข: `server/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

ไฟล์ `.env` ในโฟลเดอร์ server:
```
DATABASE_URL="postgresql://user:password@localhost:5432/service_desk"
PORT=4001
```

จากนั้น:
```bash
npx prisma db push
npm run dev
```

---

## ✅ Checklist การตั้งค่า

- [ ] Node.js 18+ ติดตั้งแล้ว
- [ ] ไฟล์ `.env` ในโฟลเดอร์ `server` มี `DATABASE_URL` และ `PORT`
- [ ] รัน `npm install` ทั้ง root และ server โฟลเดอร์
- [ ] รัน `npx prisma db push` ในโฟลเดอร์ server
- [ ] `npm run dev` ทำงาน
- [ ] เปิด http://localhost:5173 ได้
- [ ] สามารถเห็นข้อมูล 6 รายการจาก CSV import

---

## 📞 หากเกิดปัญหา

### API ไม่ตอบสนอง
```bash
# ตรวจสอบว่า port 4001 ถูกใช้แล้ว
netstat -ano | findstr :4001

# ถ้าม ีให้ kill process นั้น
taskkill /PID [PID] /F
```

### Database ไม่ sync
```bash
cd server
npx prisma db push --force-reset  # ⚠️ จะลบข้อมูลทั้งหมด
npx prisma db push  # ปกติ
```

### Import CSV ใหม่
```bash
cd D:\report 2.0\server
node src/importCsv.js
```

---

ระบบพร้อมใช้งาน! 🎉
