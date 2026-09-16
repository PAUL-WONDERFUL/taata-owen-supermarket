import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../../lib/permissions.js';
import { prisma } from '../../../../../lib/prisma.js';

const VALID_CATEGORIES = ['SUPERMARKET', 'RESTAURANT', 'FOOD', 'PRODUCTS', 'EVENTS', 'OTHER'];

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const data = {};
  if (body.caption !== undefined) data.caption = body.caption ? String(body.caption).trim() : null;
  if (body.category !== undefined && VALID_CATEGORIES.includes(body.category)) data.category = body.category;
  if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  const image = await prisma.galleryImage.update({ where: { id }, data });
  return NextResponse.json(image);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!canDeleteContent(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin or Manager can delete this.' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
