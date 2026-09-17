import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  const categories = await prisma.menuCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || '').trim();

  if (!name) {
    return NextResponse.json({ error: 'A name is required.' }, { status: 400 });
  }

  const existing = await prisma.menuCategory.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  if (existing) {
    return NextResponse.json(
      { error: `A section named "${existing.name}" already exists. Edit its photo directly in the table below instead of adding a new one.` },
      { status: 409 },
    );
  }

  const count = await prisma.menuCategory.count();
  const category = await prisma.menuCategory.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      imageUrl: body.imageUrl || null,
      sortOrder: count,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
