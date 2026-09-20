import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../../lib/permissions.js';
import { prisma } from '../../../../../lib/prisma.js';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const data = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.categoryId !== undefined) data.categoryId = String(body.categoryId).trim();
  if (body.description !== undefined) data.description = body.description ? String(body.description).trim() : null;
  if (body.price !== undefined) data.price = body.price !== '' && body.price !== null ? Number(body.price) : null;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.isAvailable !== undefined) data.isAvailable = Boolean(body.isAvailable);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  const product = await prisma.product.update({ where: { id }, data, include: { category: true } });
  return NextResponse.json(product);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!canDeleteContent(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin or Manager can delete this.' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
