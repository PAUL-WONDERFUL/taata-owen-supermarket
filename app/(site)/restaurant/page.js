import Image from 'next/image';
import { prisma } from '../../../lib/prisma.js';

export const revalidate = 30;

export const metadata = {
  title: 'Restaurant & Menu | Taata Owen Supermarket',
  description: 'Enjoy freshly cooked local and continental dishes at the Taata Owen Supermarket restaurant on Nizam Road, Jinja.',
};

function formatPrice(price) {
  return `UGX ${price.toLocaleString('en-US')}`;
}

function groupByCategory(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  }
  return groups;
}

export default async function RestaurantPage() {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });
  const grouped = groupByCategory(items);

  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="menu-tag">🍽️ Taata Owen Restaurant</span>
            <h1>Freshly cooked meals while you shop</h1>
            <p>Take a break from shopping and enjoy a hot meal at our in-house restaurant — local Ugandan favourites alongside quick bites and drinks.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {grouped.size === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>The menu will appear here once items are added in the admin dashboard.</p>
          ) : (
            [...grouped.entries()].map(([category, categoryItems]) => (
              <div className="menu-section" key={category}>
                <h3>{category}</h3>
                {categoryItems.map((item) => (
                  <div className="menu-item" key={item.id}>
                    {item.imageUrl && (
                      <div className="menu-item-thumb">
                        <Image src={item.imageUrl} alt={item.name} fill sizes="64px" style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                    <div className="menu-item-text">
                      <div className="name">{item.name}</div>
                      {item.description && <div className="desc">{item.description}</div>}
                    </div>
                    <div className="price">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Reserve a table or order ahead</h2>
          <p>Give us a call or message us on WhatsApp.</p>
          <a href="https://wa.me/256756761585" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: 'var(--green-dark)', color: '#fff' }}>Message on WhatsApp</a>
        </div>
      </section>
    </>
  );
}
