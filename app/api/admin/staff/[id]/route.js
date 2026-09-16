import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { authOptions } from '../../../../../lib/authOptions.js';
import { prisma } from '../../../../../lib/prisma.js';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (session?.user?.id !== id) {
    return NextResponse.json({ error: 'You can only change your own password.' }, { status: 403 });
  }

  const body = await request.json();
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { id } });
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({ where: { id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const total = await prisma.adminUser.count();
  if (total <= 1) {
    return NextResponse.json({ error: 'Cannot remove the last remaining admin account.' }, { status: 400 });
  }
  if (session?.user?.id === id) {
    return NextResponse.json({ error: "You can't remove your own account while logged in as it." }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
