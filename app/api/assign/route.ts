import { NextRequest, NextResponse } from 'next/server';
import { Data } from '@/lib/data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderId = String(body.orderId || '');
  const driverId = String(body.driverId || '');
  const updated = Data.assignOrder(orderId, driverId);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}
