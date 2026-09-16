import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions.js';
import { canManagePromotions } from '../../../../../lib/permissions.js';
import { prisma } from '../../../../../lib/prisma.js';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!canManagePromotions(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin or Manager can edit promotions.' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const data = {};
  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.description !== undefined) data.description = body.description ? String(body.description).trim() : null;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.originalPrice !== undefined) data.originalPrice = body.originalPrice !== '' && body.originalPrice !== null ? Number(body.originalPrice) : null;
  if (body.price !== undefined) data.price = body.price !== '' && body.price !== null ? Number(body.price) : null;
  if (body.startDate !== undefined) data.startDate = new Date(body.startDate);
  if (body.endDate !== undefined) data.endDate = new Date(body.endDate);

  const promotion = await prisma.promotion.update({ where: { id }, data });
  return NextResponse.json(promotion);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!canManagePromotions(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin or Manager can delete promotions.' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
