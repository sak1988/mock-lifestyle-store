import { NextResponse } from 'next/server';

const URL = process.env.SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role (server only)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function checkAuth(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return token && ADMIN_PASSWORD && token === ADMIN_PASSWORD;
}

export async function GET() {
  const res = await fetch(`${URL}/rest/v1/products?select=*&order=created_at.desc`, {
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}` }
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const res = await fetch(`${URL}/rest/v1/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SRK, Authorization: `Bearer ${SRK}` },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PATCH(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id, ...fields } = await req.json();
  const res = await fetch(`${URL}/rest/v1/products?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', apikey: SRK, Authorization: `Bearer ${SRK}` },
    body: JSON.stringify(fields)
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const res = await fetch(`${URL}/rest/v1/products?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}` }
  });
  return NextResponse.json({ ok: res.ok });
}
