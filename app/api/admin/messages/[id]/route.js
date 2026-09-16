import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

export async function DELETE(request, { params }) {
  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
