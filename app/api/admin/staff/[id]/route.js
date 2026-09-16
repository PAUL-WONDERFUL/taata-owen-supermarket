import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { authOptions } from '../../../../../lib/authOptions.js';
import { ROLES, canManageStaff } from '../../../../../lib/permissions.js';
import { prisma } from '../../../../../lib/prisma.js';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const body = await request.json();

  // Changing someone's role: Super Admin only.
  if (body.role !== undefined) {
    if (!canManageStaff(session?.user?.role)) {
      return NextResponse.json({ error: 'Only a Super Admin can change roles.' }, { status: 403 });
    }
    if (!ROLES.includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (target?.isProtected && body.role !== target.role) {
      return NextResponse.json({ error: 'This account is protected and its role cannot be changed.' }, { status: 400 });
    }
    if (target?.role === 'SUPER_ADMIN' && body.role !== 'SUPER_ADMIN') {
      const superAdminCount = await prisma.adminUser.count({ where: { role: 'SUPER_ADMIN' } });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: 'Cannot demote the last remaining Super Admin.' }, { status: 400 });
      }
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: { role: body.role },
      select: { id: true, name: true, email: true, role: true, isProtected: true, createdAt: true },
    });
    return NextResponse.json(updated);
  }

  // Changing your own password: any logged-in user, only for their own account.
  if (body.newPassword !== undefined) {
    if (session?.user?.id !== id) {
      return NextResponse.json({ error: 'You can only change your own password.' }, { status: 403 });
    }

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

  return NextResponse.json({ error: 'No valid update provided.' }, { status: 400 });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!canManageStaff(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin can remove staff accounts.' }, { status: 403 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (target?.isProtected) {
    return NextResponse.json({ error: 'This account is protected and cannot be removed.' }, { status: 400 });
  }

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
