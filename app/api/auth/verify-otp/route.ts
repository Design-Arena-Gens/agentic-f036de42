import { NextRequest, NextResponse } from 'next/server';
import { Data } from '@/lib/data';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'lekya_session';

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: 'Missing' }, { status: 400 });
  const sessionId = Data.verifyOtp(String(phone), String(code));
  if (!sessionId) return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  cookies().set(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 });
  return NextResponse.json({ ok: true });
}
