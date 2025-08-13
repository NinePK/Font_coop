import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    let url = `${process.env.NEXT_PUBLIC_BACK_URL}/training/`;
    if (id) {
      url += `${id}`;
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
    console.log('Backend response success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching training data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch training data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log ข้อมูลที่ส่งไปยัง Backend
    console.log('Sending data to Backend:', JSON.stringify(body, null, 2));
    
    // ส่งข้อมูลไปยัง Back_coop API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/training/`, {
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
    console.error('Error saving training data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save training data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log ข้อมูลที่ส่งไปยัง Backend
    console.log('Updating training data:', JSON.stringify(body, null, 2));
    
    // ส่งข้อมูลไปยัง Back_coop API สำหรับอัปเดต
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/training/update`, {
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
      
      console.error('Backend update response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Backend update response success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating training data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update training data' },
      { status: 500 }
    );
  }
}
