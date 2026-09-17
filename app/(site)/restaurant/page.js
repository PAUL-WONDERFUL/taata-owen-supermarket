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

export default async function RestaurantPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' },
        include: { variants: { orderBy: { sortOrder: 'asc' } } },
      },
    },
  });
  const nonEmptyCategories = categories.filter((c) => c.items.length > 0);

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
          {nonEmptyCategories.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>The menu will appear here once items are added in the admin dashboard.</p>
          ) : (
            nonEmptyCategories.map((category) => (
              <div className="menu-section" key={category.id}>
                {category.imageUrl && (
                  <div className="menu-section-banner">
                    <Image src={category.imageUrl} alt={category.name} fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    <div className="menu-section-banner-overlay"><h3>{category.name}</h3></div>
                  </div>
                )}
                {!category.imageUrl && <h3>{category.name}</h3>}
                {category.items.map((item) => (
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
                    {item.variants.length > 0 ? (
                      <div className="menu-item-variants">
                        {item.variants.map((v) => (
                          <div className="variant-row" key={v.id}>
                            <span className="variant-label">{v.label}</span>
                            <span className="variant-price">{formatPrice(v.price)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="price">{formatPrice(item.price)}</div>
                    )}
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
