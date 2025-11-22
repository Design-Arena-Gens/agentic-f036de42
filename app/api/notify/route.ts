import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, message, provider } = await req.json();
  if (!to || !message) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  // Placeholder: integrate with WhatsApp Cloud API or Twilio SMS
  // Env vars expected for WhatsApp Cloud: WHATSAPP_TOKEN, WHATSAPP_PHONE_ID
  // Env vars expected for Twilio: TWILIO_SID, TWILIO_AUTH, TWILIO_FROM

  if (process.env.NODE_ENV !== 'production') {
    console.log('Notify demo', { to, message, provider });
    return NextResponse.json({ sent: true, demo: true });
  }

  return NextResponse.json({ sent: true });
}
