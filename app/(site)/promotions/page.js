import { prisma } from '../../../lib/prisma.js';
import PromoCard from '../../../components/PromoCard.js';

export const revalidate = 30;

export const metadata = {
  title: 'Promotions & Offers | Taata Owen Supermarket',
  description: 'Current promotions and special offers at Taata Owen Supermarket, Jinja.',
};

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
            <h1>Great deals, while they last.</h1>
            <p>Discover special prices, seasonal deals and limited time offers across Taata Owen Supermarket and Restaurant. Check back regularly to see what&apos;s new.</p>
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
                <PromoCard promo={promo} showDates key={promo.id} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
