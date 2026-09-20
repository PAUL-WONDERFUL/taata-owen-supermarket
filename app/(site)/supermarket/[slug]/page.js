import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma.js';

export const revalidate = 30;

function formatPrice(price) {
  return `UGX ${price.toLocaleString('en-US')}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name} | Taata Owen Supermarket`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: { where: { isAvailable: true }, orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!category) notFound();

  return (
    <>
      {category.imageUrl ? (
        <section style={{ padding: '40px 0 0' }}>
          <div className="container">
            <div className="menu-section has-photo" style={{ marginBottom: 0 }}>
              <div className="menu-section-bg">
                <Image src={category.imageUrl} alt="" fill sizes="(max-width: 1180px) 100vw, 1180px" quality={90} priority style={{ objectFit: 'cover' }} />
              </div>
              <div className="menu-section-scrim" />
              <div className="menu-section-content">
                <span className="hero-eyebrow">Supermarket</span>
                <h1 style={{ color: 'var(--white)' }}>{category.name}</h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '60ch' }}>{category.description}</p>
                {category.operatingHours && (
                  <p style={{ marginTop: 8 }}>
                    <span className="menu-tag">🕗 {category.name} Hours: {category.operatingHours}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="hero" style={{ padding: '56px 0' }}>
          <div className="container" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <span className="hero-eyebrow">Supermarket</span>
              <h1>{category.name}</h1>
              <p>{category.description}</p>
              {category.operatingHours && (
                <p style={{ marginTop: 8 }}>
                  <span className="menu-tag">🕗 {category.name} Hours: {category.operatingHours}</span>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="container">
          {category.products.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Products in this department will appear here once added in the admin dashboard.</p>
          ) : (
            <div className="grid grid-4">
              {category.products.map((product) => (
                <div className="card product-card" key={product.id}>
                  <div className="product-thumb">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 600px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                    ) : '🛒'}
                  </div>
                  <h3>{product.name}</h3>
                  {product.description && <p>{product.description}</p>}
                  {product.price != null && <div className="product-price">{formatPrice(product.price)}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
