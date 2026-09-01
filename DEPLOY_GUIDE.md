# 🚀 Deploy Service Desk ขึ้น Cloud

เห็นว่าคุณเปิด Prisma Console แล้ว ไปขั้นตอนต่อเลย!

---

## 📋 ขั้นตอน Deploy (3 ส่วน)

### **ส่วน 1: Push Code ไป GitHub**

#### 1.1 สร้าง GitHub Repository

1. ไปที่ https://github.com/new
2. Repository name: `service-desk`
3. Description: "Service Desk API - Express + Prisma + React"
4. Public หรือ Private ตามใจ
5. **Create repository**

#### 1.2 Push code ขึ้น GitHub

```bash
cd D:\report 2.0
git init
git add .
git commit -m "Initial commit: Service Desk API"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/service-desk.git
git push -u origin main
```

*หมายเหตุ: แทน `[YOUR_USERNAME]` ด้วย username GitHub ของคุณ*

---

### **ส่วน 2: Connect GitHub ใน Prisma Console**

เห็นจากภาพคุณอยู่ที่ Prisma Console แล้ว

#### 2.1 Click "Connect" ที่ GitHub integration

1. Prisma Console → Git → Click "Connect"
2. GitHub จะขอสิทธิ์ → Click "Authorize"
3. เลือก repository `service-desk` ที่เพิ่งสร้าง
4. **Confirm connection**

---

### **ส่วน 3: Deploy Database + Backend**

#### 3.1 Connect Prisma Data Platform Database

```bash
cd D:\report 2.0\server
npx prisma db push --skip-generate
```

#### 3.2 Update Production Database URL

ใน Prisma Console → Environment:
1. Copy `DATABASE_URL` ของ production
2. เพิ่มใน server/.env:

```env
DATABASE_URL="[PRISMA_PRODUCTION_DATABASE_URL]"
PORT=4001
NODE_ENV=production
```

#### 3.3 Deploy Backend ไป Railway หรือ Render

**ตัวเลือก A: Railway (ง่ายสุด)**

```bash
# ติดตั้ง Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
cd D:\report 2.0\server
railway init

# Deploy
railway up
```

**ตัวเลือก B: Render**

1. ไปที่ https://render.com
2. Sign up ด้วย GitHub
3. Create New Web Service
4. Connect repository
5. Build Command: `npm install && npx prisma generate`
6. Start Command: `node src/server.js`
7. Environment Variables:
   - `DATABASE_URL` = [Prisma Database URL]
   - `PORT` = 4001
8. **Create Web Service**

---

### **ส่วน 4: Deploy Frontend ไป Vercel**

#### 4.1 สร้าง Vercel Project

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
cd D:\report 2.0
vercel
```

#### 4.2 ตั้งค่า Environment Variables

ใน Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://[BACKEND_URL].com
```

*แทน `[BACKEND_URL]` ด้วย URL ของ backend ที่ deploy แล้ว*

#### 4.3 Update Frontend API URL

ไฟล์: `src/App.jsx`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';
```

---

## 🎯 URLs หลังจาก Deploy

| Component | URL |
|-----------|-----|
| **Frontend** | `https://service-desk.vercel.app` |
| **Backend API** | `https://service-desk-api.railway.app` |
| **Database** | Prisma Data Platform |

---

## ✅ Checklist Deploy

- [ ] GitHub Repository สร้างแล้ว
- [ ] Code push ขึ้น GitHub แล้ว
- [ ] Prisma Console connected กับ GitHub
- [ ] Backend deploy ไป Railway/Render
- [ ] Frontend deploy ไป Vercel
- [ ] Environment Variables set ถูกต้อง
- [ ] ทดสอบ API endpoints จาก production
- [ ] ทดสอบ Frontend → Backend connection

---

## 🧪 ทดสอบ Production

หลังจาก deploy ลองทดสอบ:

```powershell
# ทดสอบ Production API
Invoke-RestMethod -Uri 'https://service-desk-api.railway.app/api/health' | ConvertTo-Json

# ดึงข้อมูล
Invoke-RestMethod -Uri 'https://service-desk-api.railway.app/api/requests' | ConvertTo-Json -Depth 3
```

---

## 🔐 Security ที่ต้องเพิ่ม (สำคัญ!)

### เพิ่ม CORS ที่ถูกต้อง

ไฟล์: `server/src/server.js`

```javascript
app.use(cors({
  origin: [
    'https://service-desk.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

### เพิ่ม API Rate Limiting

```bash
npm install express-rate-limit
```

ไฟล์: `server/src/server.js`

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📞 หากเกิดปัญหา

### Frontend ไม่เชื่อมต่อ Backend
```javascript
// ตรวจสอบ browser DevTools Console
console.log(import.meta.env.VITE_API_URL)
```

### Backend ติดขัด
```bash
# ดูข้อมูล logs ใน Railway/Render Dashboard
# หลังจากนั้นรัน locally ทดสอบ
npm run dev
```

### Database ไม่ sync
```bash
cd server
npx prisma db push --force-reset  # ⚠️ ลบข้อมูลทั้งหมด
npx prisma db push  # ปกติ
```

---

## 🎉 หลังจาก Deploy สำเร็จ

ให้ share URL นี้กับทีม:
```
👉 https://service-desk.vercel.app
```

คนอื่นสามารถ:
- ✅ เข้าใช้งานได้ทันที
- ✅ เพิ่ม/แก้ไข/ลบงาน
- ✅ ดึงข้อมูล CSV
- ✅ ทำงาน ณ ที่อื่นๆ ได้

---

## 🚀 Quick Deploy Command

วิธีเร็ว (ถ้าจำขั้นตอนได้):

```bash
# Terminal 1: Deploy Backend
cd D:\report 2.0\server
railway login
railway init
railway up

# Terminal 2: Deploy Frontend
cd D:\report 2.0
vercel --prod

# จากนั้นเลือก default settings ตามคำแนะนำ
```

---

**ที่ไหนติดขัด ให้บอกและผมช่วย!** 💪
