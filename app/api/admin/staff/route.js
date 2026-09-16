import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { ROLES, canManageStaff } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!canManageStaff(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin can view staff accounts.' }, { status: 403 });
  }

  const staff = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, isProtected: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(staff);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!canManageStaff(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin can add staff accounts.' }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const role = ROLES.includes(body.role) ? body.role : 'STAFF';

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.create({
    data: { name, email, passwordHash, role },
    select: { id: true, name: true, email: true, role: true, isProtected: true, createdAt: true },
  });

  return NextResponse.json(user, { status: 201 });
}
