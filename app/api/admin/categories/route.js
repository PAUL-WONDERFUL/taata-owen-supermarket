import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();

  if (!name || !description) {
    return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
  }

  const count = await prisma.category.count();
  const category = await prisma.category.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      description,
      imageUrl: body.imageUrl || null,
      sortOrder: count,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
