import { prisma } from '../../../../lib/prisma.js';
import CategoriesClient from '../../../../components/CategoriesClient.js';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <div className="admin-topline"><h1>Supermarket Categories</h1></div>
      <CategoriesClient initialCategories={categories} />
    </>
  );
}
