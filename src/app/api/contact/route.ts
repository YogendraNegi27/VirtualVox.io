import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In local development or production, log the demo request
    console.log('[Contact / Demo Request Received]:', {
      firstName: data.firstName || data.name,
      lastName: data.lastName,
      company: data.company || data.companyName,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      callVolume: data.callVolume,
      message: data.message,
      consent: data.consent,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Demo request recorded successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 400 }
    );
  }
}
