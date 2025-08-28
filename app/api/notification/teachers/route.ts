// app/api/notification/teachers/route.ts
import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

export async function POST(req: Request) {
  try {
    const { userId, userName, userCode, advisorId1, advisorId2, documentType, message } = await req.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!userId || !userName || !advisorId1 || !documentType || !message) {
      return NextResponse.json(
        { message: 'ข้อมูลไม่ครบถ้วน กรุณาระบุ userId, userName, advisorId1, documentType และ message' },
        { status: 400 }
      );
    }

    // สร้างรายการอาจารย์ที่จะได้รับการแจ้งเตือน
    const teacherIds = [advisorId1];
    if (advisorId2) {
      teacherIds.push(advisorId2);
    }

    const notifications = [];
    const errors = [];

    // ส่งการแจ้งเตือนแต่ละอาจารย์
    for (const teacherId of teacherIds) {
      try {
        const notificationData = {
          user_id: parseInt(teacherId),  // อาจารย์ที่จะได้รับการแจ้งเตือน
          type: 'document_submission',
          title: `เอกสาร ${documentType} ใหม่`,
          message: message,
          data: JSON.stringify({
            studentId: userId,
            studentName: userName,
            studentCode: userCode,
            documentType: documentType,
            submittedAt: new Date().toISOString()
          }),
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Sending notification to teacher:', teacherId, notificationData);

        // เรียก API backend เพื่อบันทึกการแจ้งเตือน
        const response = await fetch(`${backendUrl}/notification/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });

        if (response.ok) {
          const result = await response.json();
          notifications.push({
            teacherId: teacherId,
            status: 'success',
            notificationId: result.id
          });
          console.log(`Notification sent successfully to teacher ${teacherId}`);
        } else {
          const errorData = await response.json();
          errors.push({
            teacherId: teacherId,
            status: 'error',
            error: errorData.error || 'Unknown error'
          });
          console.error(`Failed to send notification to teacher ${teacherId}:`, errorData);
        }
      } catch (error) {
        errors.push({
          teacherId: teacherId,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Error sending notification to teacher ${teacherId}:`, error);
      }
    }

    // ส่งผลลัพธ์กลับ
    const response = {
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'ส่งการแจ้งเตือนให้อาจารย์ทั้งหมดสำเร็จ' 
        : `ส่งการแจ้งเตือนสำเร็จ ${notifications.length}/${teacherIds.length} อาจารย์`,
      notifications,
      errors
    };

    return NextResponse.json(response, { status: errors.length === 0 ? 200 : 207 }); // 207 = Multi-Status
    
  } catch (error) {
    console.error('Notification API Error:', error);
    return NextResponse.json(
      { 
        message: 'เกิดข้อผิดพลาดในการส่งการแจ้งเตือน',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}