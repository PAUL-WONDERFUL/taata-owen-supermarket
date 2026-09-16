import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canManagePromotions } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!canManagePromotions(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin or Manager can view promotions.' }, { status: 403 });
  }

  const promotions = await prisma.promotion.findMany({ orderBy: { startDate: 'desc' } });
  return NextResponse.json(promotions);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!canManagePromotions(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin or Manager can add promotions.' }, { status: 403 });
  }

  const body = await request.json();
  const title = String(body.title || '').trim();
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);

  if (!title) {
    return NextResponse.json({ error: 'A title is required.' }, { status: 400 });
  }
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    return NextResponse.json({ error: 'A valid start and end date are required.' }, { status: 400 });
  }
  if (endDate < startDate) {
    return NextResponse.json({ error: 'End date must be on or after the start date.' }, { status: 400 });
  }

  const count = await prisma.promotion.count();
  const promotion = await prisma.promotion.create({
    data: {
      title,
      description: body.description ? String(body.description).trim() : null,
      imageUrl: body.imageUrl || null,
      originalPrice: body.originalPrice !== undefined && body.originalPrice !== '' ? Number(body.originalPrice) : null,
      price: body.price !== undefined && body.price !== '' ? Number(body.price) : null,
      startDate,
      endDate,
      sortOrder: count,
    },
  });

  return NextResponse.json(promotion, { status: 201 });
}
