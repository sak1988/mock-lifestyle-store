import { NextResponse } from 'next/server';

/**
 * Minimal event endpoint.
 * Replace console.log with DB writes (Supabase) when ready.
 */
export async function POST(req) {
  const body = await req.json();
  // eslint-disable-next-line no-console
  console.log('EVENT', body?.name, {session: body?.session_id, at: body?.ts, payload: body?.payload});
  return NextResponse.json({ ok: true });
}
