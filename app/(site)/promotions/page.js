import Image from 'next/image';
import { prisma } from '../../../lib/prisma.js';

export const revalidate = 30;

export const metadata = {
  title: 'Promotions & Offers | Taata Owen Supermarket',
  description: 'Current promotions and special offers at Taata Owen Supermarket, Jinja.',
};

function formatPrice(price) {
  return `UGX ${price.toLocaleString('en-US')}`;
}

function formatDateRange(start, end) {
  const opts = { day: 'numeric', month: 'short' };
  return `${new Date(start).toLocaleDateString('en-GB', opts)} – ${new Date(end).toLocaleDateString('en-GB', opts)}`;
}

export default async function PromotionsPage() {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: { startDate: { lte: now }, endDate: { gte: now } },
    orderBy: { endDate: 'asc' },
  });

  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="hero-eyebrow">Promotions &amp; Offers</span>
            <h1>Current deals at Taata Owen</h1>
            <p>Special prices and limited-time offers across the supermarket and restaurant.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {promotions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>No active promotions right now — check back soon.</p>
          ) : (
            <div className="grid grid-3">
              {promotions.map((promo) => (
                <div className="promo-card" key={promo.id}>
                  <div className="promo-photo">
                    <span className="promo-badge">Offer</span>
                    {promo.imageUrl && (
                      <Image src={promo.imageUrl} alt={promo.title} fill sizes="(max-width: 600px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className="promo-body">
                    <h3>{promo.title}</h3>
                    {promo.description && <p>{promo.description}</p>}
                    {promo.price != null && <div className="promo-price">{formatPrice(promo.price)}</div>}
                    <div className="promo-dates">Valid {formatDateRange(promo.startDate, promo.endDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
