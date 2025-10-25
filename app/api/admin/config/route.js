import { NextResponse } from 'next/server';

const URL = process.env.SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function checkAuth(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return token && ADMIN_PASSWORD && token === ADMIN_PASSWORD;
}

export async function GET() {
  const res = await fetch(`${URL}/rest/v1/site_config?id=eq.1&select=*`, {
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}` }
  });
  const [cfg] = await res.json();
  return NextResponse.json(cfg || {});
}

export async function PATCH(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json(); // { nav: [...], hero_image: "..." }
  const res = await fetch(`${URL}/rest/v1/site_config?id=eq.1`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', apikey: SRK, Authorization: `Bearer ${SRK}` },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data);
}
