import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
  });
  return NextResponse.json(products);
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const categoryId = String(body.categoryId || '').trim();

  if (!name || !categoryId) {
    return NextResponse.json({ error: 'Name and category are required.' }, { status: 400 });
  }

  const count = await prisma.product.count({ where: { categoryId } });
  const product = await prisma.product.create({
    data: {
      name,
      categoryId,
      description: body.description ? String(body.description).trim() : null,
      price: body.price !== undefined && body.price !== '' ? Number(body.price) : null,
      imageUrl: body.imageUrl || null,
      isAvailable: body.isAvailable !== false,
      sortOrder: count,
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
