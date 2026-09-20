import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canDeleteContent } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import ProductsClient from '../../../../components/ProductsClient.js';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <>
      <div className="admin-topline"><h1>Products</h1></div>
      <ProductsClient initialProducts={products} categories={categories} canDelete={canDeleteContent(session?.user?.role)} />
    </>
  );
}
