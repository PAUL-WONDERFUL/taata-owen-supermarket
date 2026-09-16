import { NextResponse } from 'next/server';
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
  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
