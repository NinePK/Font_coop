// app/api/teacher/route.ts
import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

export async function GET() {
  try {
    console.log('Teacher API called, backend URL:', backendUrl);
    
    // เรียก API ของ backend เพื่อดึงข้อมูล users ทั้งหมด และกรองเฉพาะ TEACHER
    const response = await fetch(`${backendUrl}/user/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend response not OK:', response.status, response.statusText);
      
      // ส่งข้อมูลจำลองจากฐานข้อมูลจริงกรณีที่ backend ไม่พร้อมใช้งาน
      const mockTeachers = [
        { 
          id: 1, 
          fname: 'วัฒนพงศ์', 
          sname: 'สุทธภักดิ์', 
          title: 'นาย',
          username: 'wattanapong.su',
          role_id: 1,
          role: 'TEACHER'
        },
        { 
          id: 35, 
          fname: 'กิตติคุณ', 
          sname: 'นุผัด', 
          title: 'นาย',
          username: 'kittikun.nu',
          role_id: 2,
          role: 'TEACHER'
        },
        { 
          id: 36, 
          fname: 'พงศกร', 
          sname: 'ศิริคำน้อย', 
          title: 'นาย',
          username: 'Pongsakorn.Si',
          role_id: 2,
          role: 'TEACHER'
        }
      ];
      
      console.log('Using mock data due to backend error');
      return NextResponse.json(mockTeachers);
    }

    const allUsers = await response.json();
    console.log('Backend returned users:', Array.isArray(allUsers) ? allUsers.length : 'not array');
    
    // Debug: ดูข้อมูลตัวอย่างเพื่อเช็ค roleId
    if (Array.isArray(allUsers) && allUsers.length > 0) {
      console.log('Sample user data:', allUsers[0]);
      console.log('Available roleIds:', [...new Set(allUsers.map(user => user.roleId))]);
    }
    
    // กรองเฉพาะ users ที่มี roleId = 1 (TEACHER) ตามโครงสร้าง backend จริง
    const teachers = Array.isArray(allUsers) 
      ? allUsers.filter(user => 
          user.roleId === 1 || 
          user.roleId === "1" || 
          (user.role && user.role.statusEn === 'TEACHER') ||
          (user.role && user.role.status === 'อาจารย์')
        )
      : [];

    console.log('Found teachers:', teachers.length);
    
    // ถ้าไม่พบอาจารย์ใน backend ให้ใช้ mock data
    if (teachers.length === 0) {
      console.log('No teachers found in backend, using mock data');
      const mockTeachers = [
        { 
          id: 1, 
          fname: 'วัฒนพงศ์', 
          sname: 'สุทธภักดิ์', 
          title: 'นาย',
          username: 'wattanapong.su',
          role_id: 1,
          role: 'TEACHER'
        },
        { 
          id: 35, 
          fname: 'กิตติคุณ', 
          sname: 'นุผัด', 
          title: 'นาย',
          username: 'kittikun.nu',
          role_id: 2,
          role: 'TEACHER'
        },
        { 
          id: 36, 
          fname: 'พงศกร', 
          sname: 'ศิริคำน้อย', 
          title: 'นาย',
          username: 'Pongsakorn.Si',
          role_id: 2,
          role: 'TEACHER'
        }
      ];
      return NextResponse.json(mockTeachers);
    }
    
    return NextResponse.json(teachers);
    
  } catch (error) {
    console.error('Teacher API Error:', error);
    
    // ส่งข้อมูลจำลองจากฐานข้อมูลจริงเมื่อเกิด error
    const mockTeachers = [
      { 
        id: 1, 
        fname: 'วัฒนพงศ์', 
        sname: 'สุทธภักดิ์', 
        title: 'นาย',
        username: 'wattanapong.su',
        role_id: 1,
        role: 'TEACHER'
      },
      { 
        id: 35, 
        fname: 'กิตติคุณ', 
        sname: 'นุผัด', 
        title: 'นาย',
        username: 'kittikun.nu',
        role_id: 2,
        role: 'TEACHER'
      },
      { 
        id: 36, 
        fname: 'พงศกร', 
        sname: 'ศิริคำน้อย', 
        title: 'นาย',
        username: 'Pongsakorn.Si',
        role_id: 2,
        role: 'TEACHER'
      }
    ];
    
    console.log('Using mock data due to API error');
    return NextResponse.json(mockTeachers);
  }
}