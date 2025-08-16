import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // สร้างข้อมูลเอกสารหลัก
    const documentData = {
      user_id: body.userId,
      training_id: body.trainingId || null,
      document_type: 'COOP-04',
      document_name: 'แบบฟอร์มแจ้งรายละเอียดที่พักระหว่างการปฏิบัติงานสหกิจศึกษา',
      status: 'submitted'
    };
    
    // ข้อมูลที่พักเฉพาะ
    const accommodationData = {
      accommodation_type: body.accommodationType,
      accommodation_name: body.accommodationName,
      room_number: body.roomNumber,
      address: body.address,
      subdistrict: body.subdistrict,
      district: body.district,
      province: body.province,
      postal_code: body.postalCode,
      phone_number: body.phoneNumber,
      emergency_contact: body.emergencyContact,
      emergency_phone: body.emergencyPhone,
      emergency_relation: body.emergencyRelation,
      travel_method: body.travelMethod,
      travel_details: body.travelDetails,
      distance_km: body.distanceKm ? parseFloat(body.distanceKm) : null,
      travel_time: body.travelTime ? parseInt(body.travelTime) : null
    };
    
    const payload = {
      document: documentData,
      accommodation: accommodationData
    };
    
    console.log('Sending COOP-04 data to Backend:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop04-accommodation/`, {
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
    console.error('Error saving COOP-04 accommodation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save accommodation data' },
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop04-accommodation/?userId=${userId}`, {
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
    console.error('Error fetching COOP-04 accommodation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch accommodation data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }
    
    const payload = {
      id: parseInt(body.id),
      accommodation: {
        accommodation_type: body.accommodationType,
        accommodation_name: body.accommodationName,
        room_number: body.roomNumber,
        address: body.address,
        subdistrict: body.subdistrict,
        district: body.district,
        province: body.province,
        postal_code: body.postalCode,
        phone_number: body.phoneNumber,
        emergency_contact: body.emergencyContact,
        emergency_phone: body.emergencyPhone,
        emergency_relation: body.emergencyRelation,
        travel_method: body.travelMethod,
        travel_details: body.travelDetails,
        distance_km: body.distanceKm ? parseFloat(body.distanceKm) : null,
        travel_time: body.travelTime ? parseInt(body.travelTime) : null
      }
    };
    
    console.log('Updating COOP-04 data:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/coop04-accommodation/update`, {
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
    console.error('Error updating COOP-04 accommodation data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update accommodation data' },
      { status: 500 }
    );
  }
}