import { NextResponse } from 'next/server';
import { Data } from '@/lib/data';

export async function GET() {
  const locs = Data.listLocations();
  // Attempt to join with driver names
  const drivers = new Map(Data.listDrivers().map(d => [d.id, d] as const));
  return NextResponse.json(locs.map(l => ({ ...l, name: drivers.get(l.driverId)?.name })));
}
