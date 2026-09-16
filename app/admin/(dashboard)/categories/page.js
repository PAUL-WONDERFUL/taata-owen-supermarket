import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import CategoriesClient from '../../../../components/CategoriesClient.js';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <div className="admin-topline"><h1>Supermarket Categories</h1></div>
      <CategoriesClient initialCategories={categories} canDelete={canDeleteContent(session?.user?.role)} />
    </>
  );
}
