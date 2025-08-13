import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log ข้อมูลที่ส่งไปยัง Backend
    console.log('Sending weekly data to Backend:', JSON.stringify(body, null, 2));
    
    // ส่งข้อมูลไปยัง Back_coop API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/weekly/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // ดึงข้อมูลข้อผิดพลาดจาก Backend
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
    console.error('Error saving weekly data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save weekly data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const training_id = searchParams.get('training_id');
    
    let url = `${process.env.NEXT_PUBLIC_BACK_URL}/weekly/`;
    if (training_id) {
      url += `?training_id=${training_id}`;
    }
    
    // ดึงข้อมูลจาก Backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Backend weekly data response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch weekly data' },
      { status: 500 }
    );
  }
}