import { prisma } from '../../../../lib/prisma.js';
import MenuClient from '../../../../components/MenuClient.js';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] });

  return (
    <>
      <div className="admin-topline"><h1>Restaurant Menu</h1></div>
      <MenuClient initialItems={items} />
    </>
  );
}
