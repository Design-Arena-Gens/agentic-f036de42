import { NextRequest, NextResponse } from 'next/server';
import { Data } from '@/lib/data';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const assignedTo = url.searchParams.get('assignedTo');
  let orders = Data.listOrders();
  if (assignedTo) orders = orders.filter(o => o.assignedDriverId === assignedTo);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order = Data.upsertOrder({
    referenceCode: String(body.referenceCode || ''),
    customerName: String(body.customerName || ''),
    customerPhone: String(body.customerPhone || ''),
    address: String(body.address || ''),
    notes: body.notes ? String(body.notes) : undefined,
    cashOnDelivery: body.cashOnDelivery ? Number(body.cashOnDelivery) : undefined,
  });
  return NextResponse.json(order);
}
