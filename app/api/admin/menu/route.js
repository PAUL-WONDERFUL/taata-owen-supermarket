import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] });
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  const price = Number(body.price);

  if (!name || !category || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'Name, category and a valid price are required.' }, { status: 400 });
  }

  const count = await prisma.menuItem.count();
  const item = await prisma.menuItem.create({
    data: {
      name,
      category,
      price,
      description: body.description ? String(body.description).trim() : null,
      imageUrl: body.imageUrl || null,
      isAvailable: body.isAvailable !== false,
      sortOrder: count,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
