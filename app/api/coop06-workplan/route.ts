import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ข้อมูลแผนการปฏิบัติงาน - ส่งตรงไปตาราง plan
    const workPlanData = body.monthlyPlans.map((plan: any, index: number) => ({
      month: index + 1,
      topic: plan.workTopic,
      training_id: body.trainingId
    }));
    
    const payload = {
      training_id: body.trainingId,
      plans: workPlanData
    };
    
    console.log('Sending COOP-06 data to Backend:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/plan/`, {
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
    console.error('Error saving COOP-06 work plan data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save work plan data' },
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/plan/?trainingId=${trainingId}`, {
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
    console.error('Error fetching COOP-06 work plan data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch work plan data' },
      { status: 500 }
    );
  }
}