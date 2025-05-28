// app/api/auth/advisor/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:6008';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // ค้นหาข้อมูลพนักงานที่ปรึกษาด้วยอีเมล
    // สร้างหรือปรับ API endpoint ที่ backend ให้รองรับการค้นหาด้วยอีเมล
    const response = await fetch(`${backendUrl}/incharge/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    const data = await response.json();

    // สร้าง payload สำหรับ JWT
    const userData = {
      id: data.id,
      username: data.username || email,
      name: `${data.fname} ${data.sname}`,
      email: email,
      role: 'advisor',
      entrepreneurId: data.entrepreneur_id,
      position: data.position
    };

    // สร้าง JWT token
    const token = jwt.sign(userData, secretKey, { expiresIn: '12h' });

    // ส่ง token กลับไป
    return NextResponse.json({ token });
    
  } catch (error) {
    console.error('Advisor Login Error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}