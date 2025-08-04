import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Just mock save and respond
  return NextResponse.json({
    success: true,
    message: 'Appointment booked successfully',
    appointment: body
  })
}
