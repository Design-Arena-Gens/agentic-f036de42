import { NextRequest, NextResponse } from 'next/server';
import { Data } from '@/lib/data';
import { OrderStatus } from '@/lib/types';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const status = String(body.status || '') as OrderStatus;
  const updated = Data.setOrderStatus(params.id, status);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}
