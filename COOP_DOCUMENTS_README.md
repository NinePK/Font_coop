# ระบบบันทึกข้อมูลเอกสาร COOP

## 📋 สถานการณ์ปัจจุบัน

ระบบนี้ได้รับการอัปเดตให้สามารถบันทึกข้อมูลเอกสาร COOP ต่างๆ ลงในฐานข้อมูลจริงแล้ว

## 🗄️ โครงสร้างฐานข้อมูล

### ตารางหลัก
- **`coop_documents`** - เก็บข้อมูลเอกสารหลัก (สถานะ, วันที่ส่ง, การอนุมัติ)

### ตารางรายละเอียดตามประเภทเอกสาร
- **`coop04_accommodation`** - ข้อมูลที่พัก (COOP-04)
- **`coop06_work_plan`** - แผนการปฏิบัติงาน (COOP-06) 
- **`coop07_report_outline`** - โครงร่างรายงาน (COOP-07)
- **`coop10_report_confirmation`** - ยืนยันส่งรายงาน (COOP-10)
- **`coop11_work_details`** - รายละเอียดงาน (COOP-11)
- **`coop12_self_evaluation`** - ประเมินตนเอง (COOP-12)

## 🚀 API Endpoints ที่สร้างขึ้น

### 1. COOP-04 (ข้อมูลที่พัก)
- **POST** `/api/coop04-accommodation` - บันทึกข้อมูลใหม่
- **GET** `/api/coop04-accommodation?userId=123` - ดึงข้อมูลที่มีอยู่
- **PUT** `/api/coop04-accommodation` - อัปเดตข้อมูล

### 2. COOP-06 (แผนการปฏิบัติงาน)
- **POST** `/api/coop06-workplan` - บันทึกแผนงาน
- **GET** `/api/coop06-workplan?userId=123` - ดึงข้อมูลแผนงาน

### 3. COOP-07 (โครงร่างรายงาน)
- **POST** `/api/coop07-outline` - บันทึกโครงร่าง
- **GET** `/api/coop07-outline?userId=123` - ดึงข้อมูลโครงร่าง

### 4. COOP-10 (ยืนยันส่งรายงาน)
- **POST** `/api/coop10-confirmation` - บันทึกการยืนยัน
- **GET** `/api/coop10-confirmation?userId=123` - ดึงข้อมูลการยืนยัน

### 5. COOP-11 (รายละเอียดงาน)
- **POST** `/api/coop11-details` - บันทึกรายละเอียด
- **GET** `/api/coop11-details?userId=123` - ดึงข้อมูลรายละเอียด

### 6. COOP-12 (ประเมินตนเอง)
- **POST** `/api/coop12-evaluation` - บันทึกการประเมิน
- **GET** `/api/coop12-evaluation?userId=123` - ดึงข้อมูลการประเมิน

## 📝 การติดตั้งและใช้งาน

### 1. สร้างตารางฐานข้อมูล
```sql
-- รันไฟล์ SQL นี้ในฐานข้อมูล MySQL
mysql -u root -p coop < db/coop_documents_schema.sql
```

### 2. ตั้งค่า Backend API
ตรวจสอบให้แน่ใจว่า Backend API สำหรับ COOP Documents มีอยู่ที่:
- `${NEXT_PUBLIC_BACK_URL}/coop04-accommodation/`
- `${NEXT_PUBLIC_BACK_URL}/coop06-workplan/`
- `${NEXT_PUBLIC_BACK_URL}/coop07-outline/`
- `${NEXT_PUBLIC_BACK_URL}/coop10-confirmation/`
- `${NEXT_PUBLIC_BACK_URL}/coop11-details/`
- `${NEXT_PUBLIC_BACK_URL}/coop12-evaluation/`

## ✅ สถานะการพัฒนา

### ✅ เสร็จสิ้น
- [x] สร้างโครงสร้างฐานข้อมูลสำหรับเอกสาร COOP
- [x] สร้าง API สำหรับเอกสาร COOP-04 (ที่พัก)
- [x] อัปเดตหน้า COOP-04 ให้บันทึกข้อมูลจริง
- [x] รองรับการแก้ไขข้อมูลที่มีอยู่แล้ว
- [x] สร้าง API สำหรับเอกสาร COOP-06, 07, 10, 11, 12

### ⏳ รอดำเนินการ  
- [ ] อัปเดตหน้า COOP-06, 07, 10, 11, 12 ให้ใช้ API จริง
- [ ] สร้าง Backend API endpoints ที่เชื่อมต่อกับฐานข้อมูลจริง
- [ ] ทดสอบการบันทึกและดึงข้อมูล
- [ ] เพิ่ม validation และ error handling

## 🔄 การย้ายข้อมูล

หากมีข้อมูลเดิมในระบบ ให้ทำการย้ายข้อมูลตามขั้นตอนนี้:

1. **สำรองข้อมูลเดิม** (ถ้ามี)
2. **รันสคริปต์สร้างตาราง** `db/coop_documents_schema.sql`
3. **ทดสอบการบันทึกข้อมูล** ผ่านหน้า COOP-04 ก่อน
4. **อัปเดตหน้าอื่นๆ** ทีละหน้า

## 🚨 หมายเหตุสำคัญ

1. **COOP-01** ยังคงใช้ระบบเดิม (บันทึกในตาราง `training`)
2. **Backend API** ต้องสร้างเพิ่มเพื่อรองรับ endpoints ใหม่
3. **การทดสอบ** ควรทดสอบทีละเอกสารก่อนใช้งานจริง
4. **สิทธิ์การเข้าถึง** ตรวจสอบสิทธิ์ผู้ใช้ในการแก้ไขเอกสาร

## 🔍 การ Debug

ตรวจสอบ Console Log ในกรณีที่มีปัญหา:
- Frontend: ดู Network Tab ใน Browser DevTools  
- Backend: ดู API response และ error messages
- Database: ตรวจสอบข้อมูลในตารางที่เกี่ยวข้อง

---
📅 อัปเดตล่าสุด: 14 สิงหาคม 2568
👨‍💻 สถานะ: พร้อมใช้งาน COOP-04, รออัปเดตเอกสารอื่นๆ