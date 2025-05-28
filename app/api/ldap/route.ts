// app/api/auth/ldap/route.ts
import { NextResponse } from 'next/server';
import { authenticate } from 'ldap-authentication';
import jwt from 'jsonwebtoken';

// ประเภทข้อมูลสำหรับผู้ใช้ที่ได้รับการยืนยันแล้ว
interface AuthenticatedUser {
  id: string | number;
  username: string;
  name: string;
  email?: string;
  role: string;
  systemId?: number;
  roleId?: number;
  majorId?: number;
  major?: {
    major_th?: string;
    major_en?: string;
    faculty_id?: number;
  };
}

// สร้าง LDAP configuration
const ldapUrl = process.env.LDAP_URL || 'ldap://DC-UP-06.up.local';
const baseDN = process.env.LDAP_BASE_DN || 'dc=up,dc=local';
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// ตัวแปรสำหรับทดสอบโดยข้าม LDAP (ใช้ในสภาพแวดล้อมการพัฒนา)
const bypassLDAP = process.env.BYPASS_LDAP === 'true';

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!username || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }

    let userData: AuthenticatedUser;

    // ถ้าในโหมดพัฒนาและตั้งค่าให้ข้าม LDAP
    if (bypassLDAP) {
      // สร้างข้อมูลผู้ใช้จำลองสำหรับการทดสอบ
      userData = {
        id: 999,
        username,
        role,
        name: role === 'student' ? 'นิสิตทดสอบ' : 'อาจารย์ทดสอบ'
      };
    } else {
      // เชื่อมต่อกับ LDAP
      const options = {
        ldapOpts: {
          url: ldapUrl,
        },
        userDn: `${username}@up.local`,
        userPassword: password,
        userSearchBase: baseDN,
        usernameAttribute: 'sAMAccountName',
        username,
        attributes: ['distinguishedName', 'displayName', 'mail', 'memberOf']
      };

      try {
        const ldapUser = await authenticate(options);
        
        if (!ldapUser) {
          return NextResponse.json(
            { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
            { status: 401 }
          );
        }
        
        // ดึงข้อมูลผู้ใช้จาก LDAP
        userData = {
          id: ldapUser.dn,
          username: ldapUser.sAMAccountName,
          name: ldapUser.displayName,
          email: ldapUser.mail,
          role: role // นิสิตหรืออาจารย์
        };
        
        // หลังจาก authenticate ด้วย LDAP สำเร็จ
        // ค้นหาข้อมูลผู้ใช้จากฐานข้อมูลระบบ
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:6008';
        const userResponse = await fetch(`${backendUrl}/user/search/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // ถ้าพบข้อมูลผู้ใช้ในระบบเรา
        if (userResponse.ok) {
          const userInfo = await userResponse.json();
          userData.systemId = userInfo.id;
          userData.roleId = userInfo.role_id;
          userData.majorId = userInfo.major_id;
          userData.major = userInfo.major;
        }
        
      } catch (ldapError) {
        console.error('LDAP Authentication Error:', ldapError);
        return NextResponse.json(
          { message: 'การตรวจสอบผ่าน LDAP ล้มเหลว' },
          { status: 401 }
        );
      }
    }

    // สร้าง JWT token
    const token = jwt.sign(userData, secretKey, { expiresIn: '12h' });

    // ส่ง token กลับไป
    return NextResponse.json({ token });
    
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}