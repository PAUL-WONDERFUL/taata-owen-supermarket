import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const items = await prisma.menuItem.findMany({
    include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const categoryId = String(body.categoryId || '').trim();
  const variants = Array.isArray(body.variants) ? body.variants.filter((v) => v.label && v.price !== '') : [];
  const hasVariants = variants.length > 0;
  const price = hasVariants ? null : Number(body.price);

  if (!name || !categoryId) {
    return NextResponse.json({ error: 'Name and category are required.' }, { status: 400 });
  }
  if (!hasVariants && (!Number.isFinite(price) || price < 0)) {
    return NextResponse.json({ error: 'Provide either a price or at least one size/price option.' }, { status: 400 });
  }

  const count = await prisma.menuItem.count();
  const item = await prisma.menuItem.create({
    data: {
      name,
      categoryId,
      price,
      description: body.description ? String(body.description).trim() : null,
      imageUrl: body.imageUrl || null,
      isAvailable: body.isAvailable !== false,
      sortOrder: count,
      variants: hasVariants
        ? { create: variants.map((v, i) => ({ label: String(v.label).trim(), price: Number(v.price), sortOrder: i })) }
        : undefined,
    },
    include: { category: true, variants: true },
  });

  return NextResponse.json(item, { status: 201 });
}
