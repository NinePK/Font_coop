// app/api/teacher/student-documents/[studentId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;
    const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

    // ดึงข้อมูลเอกสารของนิสิตจาก Backend
    const response = await fetch(`${backendUrl}/teacher/student-documents/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // หาก Backend API ไม่พร้อม ส่ง error แทนการใช้ mock data
    console.error(`Backend API error: ${response.status} ${response.statusText}`);
    return NextResponse.json(
      { 
        message: `ไม่สามารถดึงข้อมูลเอกสารได้ Backend API error: ${response.status}`,
        error: response.statusText 
      }, 
      { status: response.status }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร" }, 
      { status: 500 }
    );
  }
}