# 📋 แผนการอัพเดทหน้า COOP ที่เหลือ

## ✅ เสร็จสิ้นแล้ว
- [x] COOP-04 - ข้อมูลที่พัก (ใช้ API จริง)
- [x] COOP-06 - แผนการปฏิบัติงาน (ใช้ API จริง) 
- [x] COOP-07 - โครงร่างรายงาน (ใช้ API จริง)

## 🔄 อัพเดทอย่างรวดเร็ว

### COOP-10 - ยืนยันส่งรายงาน
**การเปลี่ยนแปลงหลัก:**
1. เพิ่ม state: `saving`, `existingData`, `isEditing`
2. เพิ่ม useEffect สำหรับดึงข้อมูลเดิม: `/api/coop10-confirmation?userId=${user.id}`
3. แทนที่ `console.log` ด้วยการเรียก API จริง: `/api/coop10-confirmation`
4. อัพเดทปุ่มให้แสดงสถานะ: `{saving ? 'กำลังบันทึก...' : (isEditing ? 'อัพเดท' : 'บันทึก')}`

### COOP-11 - รายละเอียดงาน  
**การเปลี่ยนแปลงหลัก:**
1. เพิ่ม state เดียวกัน: `saving`, `existingData`, `isEditing`
2. เพิ่ม useEffect สำหรับดึงข้อมูลเดิม: `/api/coop11-details?userId=${user.id}`
3. แทนที่การจำลองด้วยการเรียก API: `/api/coop11-details`
4. อัพเดทปุ่มและ UI

### COOP-12 - ประเมินตนเอง
**การเปลี่ยนแปลงหลัก:**
1. เพิ่ม state เดียวกัน: `saving`, `existingData`, `isEditing`
2. เพิ่ม useEffect สำหรับดึงข้อมูลเดิม: `/api/coop12-evaluation?userId=${user.id}`
3. แทนที่การจำลองด้วยการเรียก API: `/api/coop12-evaluation`
4. จัดการข้อมูลการประเมินแบบ JSON

## 🎯 Pattern การอัพเดท

```typescript
// 1. เพิ่ม state
const [saving, setSaving] = useState<boolean>(false);
const [existingData, setExistingData] = useState<any>(null);
const [isEditing, setIsEditing] = useState<boolean>(false);

// 2. เพิ่ม useEffect
useEffect(() => {
  if (user) {
    const fetchExistingData = async () => {
      try {
        const response = await fetch(`/api/coop##-xxx?userId=${user.id}`);
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setExistingData(result.data);
            setIsEditing(true);
            // โหลดข้อมูลเดิม...
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchExistingData();
  }
}, [user]);

// 3. แก้ไข handleSave
const handleSave = async () => {
  setSaving(true);
  try {
    const formData = { /* ข้อมูล */ };
    
    let response;
    if (isEditing && existingData) {
      response = await fetch('/api/coop##-xxx', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: existingData.document.id }),
      });
    } else {
      response = await fetch('/api/coop##-xxx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    // Success handling...
  } catch (error) {
    // Error handling...
  } finally {
    setSaving(false);
  }
};
```

## 🚀 การทดสอบ

1. **COOP-04** - ✅ พร้อมใช้งาน
2. **COOP-06** - ✅ พร้อมใช้งาน  
3. **COOP-07** - ✅ พร้อมใช้งาน
4. **COOP-10** - 🔄 ต้องอัพเดท
5. **COOP-11** - 🔄 ต้องอัพเดท
6. **COOP-12** - 🔄 ต้องอัพเดท

## 📊 สถานะปัจจุบัน

- **Database Schema**: ✅ สร้างแล้วทุกตาราง
- **API Endpoints**: ✅ สร้างแล้วทุก API  
- **Frontend Pages**: 3/6 เสร็จสิ้น (50%)

---
🎯 **เป้าหมายต่อไป:** อัพเดทหน้าที่เหลือให้เสร็จ จากนั้นทดสอบระบบทั้งหมด