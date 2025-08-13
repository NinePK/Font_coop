// app/api/advisor/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

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

    // เรียก API ของ backend เพื่อตรวจสอบข้อมูลพนักงานที่ปรึกษา
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
      position: data.position,
      entrepreneur: data.entrepreneur
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