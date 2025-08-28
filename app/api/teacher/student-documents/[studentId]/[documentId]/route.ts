// app/api/teacher/student-documents/[studentId]/[documentId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { studentId: string; documentId: string } }
) {
  try {
    const { studentId, documentId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
    
    // รับข้อมูลจาก request body
    const body = await request.json();
    
    // เรียก Backend API เพื่อ update document status
    const response = await fetch(`${backendUrl}/teacher/student-documents/${studentId}/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    console.error(`Backend API error: ${response.status} ${response.statusText}`);
    return NextResponse.json(
      { 
        message: `ไม่สามารถอัปเดตสถานะเอกสารได้ Backend API error: ${response.status}`,
        error: response.statusText 
      }, 
      { status: response.status }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดตสถานะเอกสาร" }, 
      { status: 500 }
    );
  }
}