import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ข้อมูลรายละเอียดการปฏิบัติงาน - ส่งตรงไปตาราง job_details
    const detailsData = {
      training_id: body.trainingId,
      job_position: body.jobPosition,
      job_description: body.jobDescription,
      report_title_thai: body.reportTitleThai,
      report_title_english: body.reportTitleEnglish,
      status: 'submitted'
    };
    
    console.log('Sending COOP-11 data to Backend:', JSON.stringify(detailsData, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/job-details/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailsData),
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
    console.error('Error saving COOP-11 details data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save details data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainingId = searchParams.get('trainingId');
    
    if (!trainingId) {
      return NextResponse.json(
        { error: 'Training ID is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/job-details/?trainingId=${trainingId}`, {
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
    console.error('Error fetching COOP-11 details data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch details data' },
      { status: 500 }
    );
  }
}