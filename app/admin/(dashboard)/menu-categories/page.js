import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import MenuCategoriesClient from '../../../../components/MenuCategoriesClient.js';

export const dynamic = 'force-dynamic';

export default async function MenuCategoriesPage() {
  const session = await getServerSession(authOptions);
  const categories = await prisma.menuCategory.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <div className="admin-topline"><h1>Menu Sections</h1></div>
      <MenuCategoriesClient initialCategories={categories} canDelete={canDeleteContent(session?.user?.role)} />
    </>
  );
}
