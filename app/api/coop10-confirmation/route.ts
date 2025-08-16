import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // สร้างข้อมูลเอกสารหลัก
    const documentData = {
      user_id: body.userId,
      training_id: body.trainingId || null,
      document_type: 'COOP-10',
      document_name: 'แบบฟอร์มแจ้งยืนยันส่งรายงานการปฏิบัติงานนิสิตสหกิจศึกษา',
      status: 'submitted'
    };
    
    // ข้อมูลยืนยันส่งรายงาน
    const confirmationData = {
      report_title_thai: body.reportTitleThai,
      report_title_english: body.reportTitleEnglish,
      submission_method: body.submissionMethod || 'hard_copy',
      copies_submitted: body.copiesSubmitted || 1,
      submission_date: body.submissionDate || new Date().toISOString().split('T')[0]
    };
    
    const payload = {
      document: documentData,
      confirmation: confirmationData
    };
    
    console.log('Sending COOP-10 data to Backend:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop10-confirmation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = `Backend error: ${errorData.error}`;
        }
      } catch (e) {
        // ไม่สามารถอ่าน error response ได้
      }
      
      console.error('Backend response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Backend response success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving COOP-10 confirmation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save confirmation data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop10-confirmation/?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ data: null });
      }
      
      console.error('Backend response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching COOP-10 confirmation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch confirmation data' },
      { status: 500 }
    );
  }
}