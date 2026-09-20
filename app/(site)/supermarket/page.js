import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma.js';

export const revalidate = 60;

export const metadata = {
  title: 'Supermarket Departments | Taata Owen Supermarket',
  description: 'Browse everything Taata Owen Supermarket stocks, from fresh produce to household essentials.',
};

export default async function SupermarketPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="hero-eyebrow">Supermarket</span>
            <h1>Everything you need. All in one place.</h1>
            <p>From fresh produce and pantry staples to household essentials and everyday favourites, discover the products you need across our supermarket departments all under one roof on Nizam Road.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {categories.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Departments will appear here once added in the admin dashboard.</p>
          ) : (
            <div className="grid grid-4">
              {categories.map((cat) => (
                <Link href={`/supermarket/${cat.slug}`} className="dept-card" key={cat.id}>
                  <div className="dept-thumb">
                    {cat.imageUrl ? (
                      <Image src={cat.imageUrl} alt={cat.name} fill sizes="(max-width: 600px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                    ) : '🛒'}
                  </div>
                  <div className="dept-overlay">
                    <h4>{cat.name}</h4>
                    <p>{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
