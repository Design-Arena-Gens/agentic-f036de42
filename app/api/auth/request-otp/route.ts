import { NextRequest, NextResponse } from 'next/server';
import { Data } from '@/lib/data';

export async function POST(req: NextRequest) {
  const { phone, role, driverId } = await req.json();
  if (!phone || !role) return NextResponse.json({ error: 'Missing phone/role' }, { status: 400 });
  const code = Data.createOtp(String(phone), role === 'Driver' ? 'Driver' : 'Manager', role === 'Driver' ? String(driverId || '') : undefined);

  // TODO: integrate WhatsApp/SMS providers. For demo, return code when in dev.
  const demo = process.env.NODE_ENV !== 'production';
  return NextResponse.json({ sent: true, demoCode: demo ? code : undefined });
}
