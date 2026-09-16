import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions.js';
import { canViewMessages } from '../../../../../lib/permissions.js';
import { prisma } from '../../../../../lib/prisma.js';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!canViewMessages(session?.user?.role)) {
    return NextResponse.json({ error: 'You do not have access to messages.' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
