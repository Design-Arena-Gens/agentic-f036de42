import { NextResponse } from 'next/server';
import { Data } from '@/lib/data';

export async function GET() {
  return NextResponse.json(Data.listDrivers());
}
