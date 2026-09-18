import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canManageSiteSettings } from '../../../../lib/permissions.js';
import { getSiteSettings, SETTINGS_ID } from '../../../../lib/siteSettings.js';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!canManageSiteSettings(session?.user?.role)) {
    return NextResponse.json({ error: 'Only a Super Admin can change site settings.' }, { status: 403 });
  }

  const body = await request.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { backgroundImageUrl: body.backgroundImageUrl || null },
    create: { id: SETTINGS_ID, backgroundImageUrl: body.backgroundImageUrl || null },
  });

  return NextResponse.json(settings);
}
