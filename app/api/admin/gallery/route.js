import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

const VALID_CATEGORIES = ['SUPERMARKET', 'RESTAURANT', 'FOOD', 'PRODUCTS', 'EVENTS', 'OTHER'];

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(images);
}

export async function POST(request) {
  const body = await request.json();
  const url = String(body.url || '').trim();
  const category = VALID_CATEGORIES.includes(body.category) ? body.category : 'OTHER';

  if (!url) {
    return NextResponse.json({ error: 'An uploaded image URL is required.' }, { status: 400 });
  }

  const count = await prisma.galleryImage.count();
  const image = await prisma.galleryImage.create({
    data: {
      url,
      category,
      caption: body.caption ? String(body.caption).trim() : null,
      isFeatured: Boolean(body.isFeatured),
      sortOrder: count,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
