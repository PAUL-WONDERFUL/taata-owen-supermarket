import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = String(body.name || '').trim();
  const contact = String(body.contact || '').trim();
  const subject = String(body.subject || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !contact || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  if (name.length > 200 || contact.length > 200 || subject.length > 300 || message.length > 5000) {
    return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: { name, contact, subject, message } });

  return NextResponse.json({ ok: true });
}
