// app/api/coop01/route.ts
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';

// GET: ดึงรายการ COOP-01 submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const status = searchParams.get('status'); // pending, approved, rejected
    
    console.log('COOP-01 API called - GET:', { teacherId, status });
    
    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // เรียก API ของ backend เพื่อดึงข้อมูล COOP-01 submissions ที่อาจารย์ดูแล
    const response = await fetch(
      `${backendUrl}/coop01/teacher/${teacherId}${status ? `?status=${status}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Backend response not OK:', response.status, response.statusText);
      
      // Return empty array when backend is not available
      console.log('Backend not available, returning empty array');
      return NextResponse.json([]);
    }

    const data = await response.json();
    console.log('Backend returned COOP-01 submissions:', Array.isArray(data) ? data.length : 'not array');
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('COOP-01 API Error:', error);
    
    // Return empty array when error occurs
    console.log('API error occurred, returning empty array');
    return NextResponse.json([]);
  }
}

// POST: อัปเดตสถานะการอนุมัติ COOP-01
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, action, teacherId, comment } = body;
    
    console.log('COOP-01 API called - POST:', { submissionId, action, teacherId, comment });
    
    if (!submissionId || !action || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: submissionId, action, teacherId' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject', 'request_revision'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: approve, reject, or request_revision' },
        { status: 400 }
      );
    }

    // เรียก API ของ backend เพื่ออัปเดตสถานะ
    const response = await fetch(`${backendUrl}/coop01/${submissionId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        teacherId,
        comment,
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      console.error('Backend response not OK:', response.status, response.statusText);
      
      // Return error response when backend is not available
      return NextResponse.json(
        { error: 'Backend service unavailable' },
        { status: 503 }
      );
    }

    const data = await response.json();
    console.log('Backend approval response:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('COOP-01 Approval API Error:', error);
    
    // Return error response when error occurs
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}