import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // คำนวณคะแนนรวม
    let totalScore = 0;
    let maxScore = 0;
    let completedItems = 0;
    
    if (body.evaluationData && typeof body.evaluationData === 'object') {
      const scores = Object.values(body.evaluationData).filter(score => typeof score === 'number');
      totalScore = scores.reduce((sum: number, score: number) => sum + score, 0);
      completedItems = scores.length;
      maxScore = completedItems * 5; // assuming max score per item is 5
    }
    
    const averageScore = completedItems > 0 ? totalScore / completedItems : 0;
    
    // ข้อมูลการประเมินตนเอง - ส่งตรงไปตาราง self_evaluation
    const evaluationData = {
      training_id: body.trainingId,
      evaluations: JSON.stringify(body.evaluationData),
      additional_comments: body.additionalComments || null,
      total_score: totalScore,
      max_score: maxScore,
      average_score: averageScore,
      completed_items: completedItems
    };
    
    console.log('Sending COOP-12 data to Backend:', JSON.stringify(evaluationData, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/self-evaluation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluationData),
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
    console.error('Error saving COOP-12 evaluation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save evaluation data' },
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/self-evaluation/?trainingId=${trainingId}`, {
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
    console.error('Error fetching COOP-12 evaluation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch evaluation data' },
      { status: 500 }
    );
  }
}