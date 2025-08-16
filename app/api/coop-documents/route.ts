import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const documentType = searchParams.get('documentType');
    
    let url = `${process.env.NEXT_PUBLIC_BACK_URL}/coop-documents/`;
    const params = new URLSearchParams();
    
    if (userId) params.append('userId', userId);
    if (documentType) params.append('documentType', documentType);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coop documents:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch coop documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Sending coop document data to Backend:', JSON.stringify(body, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop-documents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.error('Error saving coop document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save coop document' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Updating coop document data:', JSON.stringify(body, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop-documents/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.error('Error updating coop document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update coop document' },
      { status: 500 }
    );
  }
}