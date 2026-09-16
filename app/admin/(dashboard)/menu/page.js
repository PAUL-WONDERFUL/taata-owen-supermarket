import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import MenuClient from '../../../../components/MenuClient.js';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const session = await getServerSession(authOptions);
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] });

  return (
    <>
      <div className="admin-topline"><h1>Restaurant Menu</h1></div>
      <MenuClient initialItems={items} canDelete={canDeleteContent(session?.user?.role)} />
    </>
  );
}
