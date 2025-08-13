# Coop01 - ใบรายงานตัวสหกิจศึกษา

## ข้อมูลที่เก็บในฐานข้อมูล

ข้อมูลจาก Coop01 จะถูกเก็บในตาราง **`Training`** ในฐานข้อมูล ซึ่งมีโครงสร้างดังนี้:

### ฟิลด์หลักที่ใช้:
- `user_id` - รหัสนิสิต (จากตาราง User)
- `job_id` - ตำแหน่งงาน (จากตาราง Job)
- `semester_id` - ภาคการศึกษา (จากตาราง Semester)
- `startdate` - วันที่เริ่มปฏิบัติงาน (รูปแบบ: YYYY-MM-DD)
- `enddate` - วันที่สิ้นสุดปฏิบัติงาน (รูปแบบ: YYYY-MM-DD)
- `teacher_id1` - อาจารย์ที่ปรึกษาคนที่ 1
- `teacher_id2` - อาจารย์ที่ปรึกษาคนที่ 2

### ตารางที่เกี่ยวข้อง:
1. **Training** - ตารางหลักสำหรับเก็บข้อมูลการฝึกงาน
2. **User** - ข้อมูลนิสิต
3. **Job** - ตำแหน่งงาน
4. **Entrepreneur** - สถานประกอบการ
5. **Semester** - ภาคการศึกษา

## โครงสร้างตาราง Training ที่แท้จริง

```sql
CREATE TABLE `coop`.`training` (
  `user_id` INT(11) NOT NULL,           -- รหัสนิสิต
  `semester_id` INT(11) NOT NULL,       -- รหัสภาคการศึกษา
  `id` INT(11) NOT NULL AUTO_INCREMENT, -- รหัสการฝึกงาน
  `job_id` INT(11) NOT NULL,            -- รหัสตำแหน่งงาน
  `startdate` DATE NULL DEFAULT NULL,    -- วันที่เริ่ม
  `enddate` DATE NULL DEFAULT NULL,      -- วันที่สิ้นสุด
  `teacher_id1` INT(11) NULL DEFAULT NULL, -- อาจารย์ที่ปรึกษา 1
  `teacher_id2` INT(11) NULL DEFAULT NULL, -- อาจารย์ที่ปรึกษา 2
  `address` VARCHAR(100) NULL DEFAULT NULL,
  `mooban_id` INT(11) NULL DEFAULT NULL,
  `tambon_id` INT(11) NULL DEFAULT NULL,
  `tel` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `lat` DOUBLE NULL DEFAULT NULL,
  `long` DOUBLE NULL DEFAULT NULL,
  `name_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `position_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `dept_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `tel_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `email_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `job_position` VARCHAR(100) NULL DEFAULT NULL,
  `job_des` VARCHAR(400) NULL DEFAULT NULL,
  `time_mentor` DATE NULL DEFAULT NULL,
  `coop` INT(11) NULL DEFAULT 0,
  `status` INT(11) NULL DEFAULT 1,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`)
);
```

## การใช้งาน

### 1. กรอกข้อมูล
- ข้อมูลส่วนตัวจะถูกดึงมาจาก cookie โดยอัตโนมัติ
- เลือกสถานประกอบการและตำแหน่งงาน
- กำหนดวันที่เริ่มและสิ้นสุดการปฏิบัติงาน
- กรอกข้อมูลอาจารย์ที่ปรึกษา

### 2. บันทึกข้อมูล
- กดปุ่ม "บันทึกข้อมูล" เพื่อบันทึกลงฐานข้อมูล
- ระบบจะตรวจสอบข้อมูลที่จำเป็นก่อนบันทึก
- แสดงข้อความแจ้งเตือนเมื่อบันทึกสำเร็จหรือเกิดข้อผิดพลาด

### 3. การตรวจสอบข้อมูล
ระบบจะตรวจสอบข้อมูลต่อไปนี้:
- ✅ มีสถานประกอบการที่เลือก
- ✅ มีตำแหน่งงานที่เลือก
- ✅ มีวันที่เริ่มและสิ้นสุด
- ✅ มีภาคการศึกษาปัจจุบัน
- ✅ มีชั้นปีที่เลือก
- ✅ วันที่เริ่มต้องน้อยกว่าวันที่สิ้นสุด

## ข้อมูลที่ส่งไปยัง Backend

```json
{
  "user_id": 123,
  "job_id": 456,
  "semester_id": 789,
  "startdate": "2024-01-01",
  "enddate": "2024-06-30",
  "teacher_id1": null,
  "teacher_id2": null,
  "address": null,
  "mooban_id": null,
  "tambon_id": null,
  "tel": null,
  "email": null,
  "lat": null,
  "long": null,
  "name_mentor": null,
  "position_mentor": null,
  "dept_mentor": null,
  "tel_mentor": null,
  "email_mentor": null,
  "job_position": null,
  "job_des": null,
  "time_mentor": null,
  "incharge_id1": null,
  "incharge_id2": null,
  "coop": 0,
  "status": 1
}
```

## API Endpoints

### Frontend (Font_coop)
- `POST /api/training` - บันทึกข้อมูล Training ใหม่
- `PUT /api/training` - อัปเดตข้อมูล Training

### Backend (Back_coop)
- `POST /training/` - สร้าง Training ใหม่
- `POST /training/update` - อัปเดต Training
- `GET /semester/current` - ดึงภาคการศึกษาปัจจุบัน

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ใน Font_coop:

```env
# Backend ใช้ port 6008 (ไม่ใช่ 8080)
NEXT_PUBLIC_BACK_URL=http://localhost:6008
```

## การรันระบบ

### 1. รัน Backend (Back_coop)
```bash
cd Coop/Back_coop
go run main.go
```

### 2. รัน Frontend (Font_coop)
```bash
cd Coop/Font_coop
npm run dev
```

## หมายเหตุ

- ข้อมูลจะถูกบันทึกในตาราง Training ซึ่งเป็นตารางหลักสำหรับการจัดการข้อมูลการฝึกงาน
- ระบบจะตรวจสอบภาคการศึกษาปัจจุบันโดยอัตโนมัติ
- หากไม่มีภาคการศึกษาปัจจุบัน ระบบจะแสดงข้อความแจ้งเตือน
- ข้อมูลที่บันทึกแล้วจะถูกใช้ในการจัดการเอกสารอื่นๆ ในระบบ
- **สำคัญ:** ใช้ชื่อฟิลด์ตามโครงสร้างฐานข้อมูลจริง (เช่น `startdate`, `enddate`, `user_id`) ไม่ใช่ camelCase
- **การจัดการวันที่:** Backend ใช้ฟิลด์วันที่เป็น string (varchar) เพื่อหลีกเลี่ยงปัญหา time.Time parsing
