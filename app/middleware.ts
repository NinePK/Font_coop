// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET!;

// Middleware to check authentication
export function middleware(request: NextRequest) {
  // ตัวแปรเพื่อเก็บสถานะการตรวจสอบ
  let isAuthenticated = false;
  
  // ตรวจสอบ JWT Token
  const token = request.cookies.get("token")?.value;
  if (token) {
    try {
      // ตรวจสอบความถูกต้องของโทเคน
      const decoded = jwt.verify(token, secret);
      if (decoded) {
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      isAuthenticated = false;
    }
  }
  
  // ตรวจสอบข้อมูลผู้ใช้ทดสอบ (กรณีล็อกอินทดสอบ)
  const testUserData = request.cookies.get("user_data")?.value;
  if (testUserData && !isAuthenticated) {
    try {
      // ตรวจสอบว่าข้อมูลผู้ใช้ทดสอบเป็น JSON ที่ถูกต้อง
      const userData = JSON.parse(testUserData);
      if (userData && userData.id) {
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Test user data parsing failed:", error);
      isAuthenticated = false;
    }
  }
  
  // ตรวจสอบว่าเป็นหน้าสาธารณะหรือไม่
  const isPublicPage = 
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/login" || 
    request.nextUrl.pathname === "/test-login" || 
    request.nextUrl.pathname === "/admin-login" ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/public/") ||
    request.nextUrl.pathname.startsWith("/favicon");
  
  // ถ้าผู้ใช้ไม่ได้ล็อกอินและไม่ได้อยู่ในหน้าสาธารณะให้เปลี่ยนเส้นทางไปที่หน้าล็อกอิน
  if (!isAuthenticated && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // ถ้าผู้ใช้ล็อกอินแล้วและพยายามเข้าถึงหน้าล็อกอิน ให้เปลี่ยนเส้นทางไปที่หน้าแรก
  if (isAuthenticated && (
    request.nextUrl.pathname === "/login" || 
    request.nextUrl.pathname === "/test-login" || 
    request.nextUrl.pathname === "/admin-login"
  )) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // ในกรณีอื่นๆ ให้ดำเนินการต่อ
  return NextResponse.next();
}

// กำหนดเส้นทางที่ต้องมีการตรวจสอบ
export const config = {
  matcher: [
    /*
     * ตรงกับทุกเส้นทางยกเว้น:
     * - _next/static (ไฟล์คงที่)
     * - _next/image (ไฟล์รูปภาพที่ปรับแต่ง)
     * - favicon.ico (ไฟล์ favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};