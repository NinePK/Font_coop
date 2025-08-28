// app/api/teacher/document-approval/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, studentId, teacherId, action, comment, approvedBy } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!documentId || !studentId || !teacherId || !action) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ครบถ้วน" }, 
        { status: 400 }
      );
    }

    if (action === 'reject' && !comment?.trim()) {
      return NextResponse.json(
        { message: "กรุณาระบุเหตุผลในการไม่อนุมัติ" }, 
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

    // ส่งข้อมูลไปยัง Backend API
    const response = await fetch(`${backendUrl}/teacher/document-approval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId,
        studentId,
        teacherId,
        action,
        comment: comment?.trim() || null,
        approvedBy,
        approvedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Backend API error: ${response.status} ${response.statusText}`, errorData);
      
      return NextResponse.json(
        { message: errorData.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะเอกสาร" }, 
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Document Approval API Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดำเนินการ กรุณาลองใหม่อีกครั้ง" }, 
      { status: 500 }
    );
  }
}