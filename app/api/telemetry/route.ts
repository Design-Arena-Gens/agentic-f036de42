import { NextRequest, NextResponse } from 'next/server';
import { Data } from '@/lib/data';

export async function POST(req: NextRequest) {
  const { driverId, lat, lng } = await req.json();
  if (!driverId || typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  Data.setLocation(String(driverId), Number(lat), Number(lng));
  return NextResponse.json({ ok: true });
}
