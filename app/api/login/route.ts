// app/api/login/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticate } from "ldap-authentication";

const adminUsername = process.env.ADMIN_USERNAME!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const secret = process.env.SECRET!;
const ldapUrl = "ldap://DC-UP-06.up.local";
const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // 1. เช็คว่าเป็น Admin หรือไม่
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign({ username, role: "admin" }, secret, { expiresIn: "1d" });
      return NextResponse.json({ token });
    }

    // 2. เชื่อมต่อกับ LDAP เพื่อตรวจสอบ username/password
    const options = {
      ldapOpts: { url: ldapUrl },
      userDn: `${username}@up.local`,
      userPassword: password,
      userSearchBase: "dc=up,dc=local",
      usernameAttribute: "samaccountname",
      username,
    };

    const ldapUser = await authenticate(options);

    if (!ldapUser) {
      return NextResponse.json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 3. หลังจาก LDAP authenticate สำเร็จ ค้นหาข้อมูลผู้ใช้จากฐานข้อมูล
    const userResponse = await fetch(`${backendUrl}/user/search/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลผู้ใช้ในระบบ" }, 
        { status: 404 }
      );
    }

    const userData = await userResponse.json();

    // 4. ตรวจสอบว่าผู้ใช้เป็นนิสิตหรืออาจารย์
    const userRole = userData.role?.status_en?.toLowerCase();
    
    if (userRole !== 'student' && userRole !== 'teacher') {
      return NextResponse.json(
        { message: `คุณไม่มีสิทธิ์เข้าสู่ระบบในฐานะนิสิตหรืออาจารย์` },
        { status: 403 }
      );
    }

    // 5. สร้าง JWT Token พร้อมข้อมูลผู้ใช้
    const tokenPayload = {
      id: userData.id,
      username: userData.username,
      fname: userData.fname,
      sname: userData.sname,
      fnameEn: userData.fname_en,
      snameEn: userData.sname_en,
      title: userData.title,
      titleEn: userData.title_en,
      email: `${username}@up.local`,
      role: userData.role,
      major: userData.major,
      majorId: userData.major_id,
      roleId: userData.role_id,
      isAdmin: userData.is_admin
    };

    const token = jwt.sign(tokenPayload, secret, { expiresIn: "1d" });
    return NextResponse.json({ token });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}