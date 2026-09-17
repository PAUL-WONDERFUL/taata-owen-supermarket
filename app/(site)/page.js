import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '../../lib/prisma.js';
import { getFeaturedImage } from '../../lib/featuredImage.js';
import PromoCard from '../../components/PromoCard.js';
import HomeSplash from '../../components/HomeSplash.js';

export const revalidate = 60;

async function getHomeData() {
  const now = new Date();
  const [categories, galleryPreview, promotions, featuredImage] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, take: 8 }),
    prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' }, take: 4 }),
    prisma.promotion.findMany({
      where: { startDate: { lte: now }, endDate: { gte: now } },
      orderBy: { endDate: 'asc' },
      take: 3,
    }),
    getFeaturedImage(),
  ]);
  return { categories, galleryPreview, promotions, featuredImage };
}

export default async function HomePage() {
  const { categories, galleryPreview, promotions, featuredImage } = await getHomeData();

  return (
    <>
      <HomeSplash imageUrl={featuredImage?.url} />
      <section className={`hero${featuredImage ? ' has-photo' : ''}`}>
        {featuredImage && (
          <>
            <div className="hero-bg">
              <Image src={featuredImage.url} alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
            </div>
            <div className="hero-scrim" />
          </>
        )}
        <div className="container">
          <div>
            <span className="hero-eyebrow">Jinja City&apos;s Busiest Supermarket</span>
            <h1>Everything your home needs, all under one roof</h1>
            <p>From fresh produce and pantry staples to household goods and a full in-house restaurant — Taata Owen Supermarket has been the go-to one-stop shop on Nizam Road, Jinja.</p>
            <div className="hero-actions">
              <Link href="/contact#map" className="btn btn-primary">Get Directions</Link>
              <Link href="/restaurant" className="btn btn-outline">View Restaurant Menu</Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Visit Us Today</h3>
            <ul>
              <li><span className="ico">📍</span> Nizam Road, Jinja, Uganda</li>
              <li><span className="ico">🕗</span> Open 24/7 — every day, all day</li>
              <li><span className="ico">📞</span> +256 756 761585</li>
              <li><span className="ico">🍽️</span> In-house restaurant on site</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="info-strip">
          <div className="item">
            <span className="ico">📍</span>
            <div><h4>Our Location</h4><p>Nizam Road, Jinja, Uganda</p></div>
          </div>
          <div className="item">
            <span className="ico">🕗</span>
            <div><h4>Opening Hours</h4><p>Open 24/7 — Every Day</p></div>
          </div>
          <div className="item">
            <span className="ico">📞</span>
            <div><h4>Call / WhatsApp</h4><p>+256 756 761585</p></div>
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Shop With Us</span>
            <h2>A one-stop shop the whole of Jinja trusts</h2>
            <p>We stock the everyday essentials households need most, at competitive prices, with friendly service every day of the week.</p>
          </div>
          <div className="grid grid-4">
            <div className="card">
              <div className="ico-big">🥦</div>
              <h3>Fresh Produce</h3>
              <p>Fresh fruits and vegetables sourced daily to keep your kitchen stocked.</p>
            </div>
            <div className="card">
              <div className="ico-big">🛒</div>
              <h3>Fully Stocked</h3>
              <p>Groceries, household goods and everyday essentials, all in one place.</p>
            </div>
            <div className="card">
              <div className="ico-big">💰</div>
              <h3>Competitive Prices</h3>
              <p>Fair, honest pricing on the products Jinja families rely on.</p>
            </div>
            <div className="card">
              <div className="ico-big">🍽️</div>
              <h3>In-House Restaurant</h3>
              <p>Take a break and enjoy a meal at our on-site restaurant while you shop.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Stock</span>
            <h2>Our Departments</h2>
            <p>A quick look at what you&apos;ll find on our shelves.</p>
          </div>
          {categories.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Departments will appear here once added in the admin dashboard.</p>
          ) : (
            <div className="grid grid-4">
              {categories.map((cat) => (
                <div className="dept-card" key={cat.id}>
                  <div className="dept-thumb">
                    {cat.imageUrl ? (
                      <Image src={cat.imageUrl} alt={cat.name} fill sizes="(max-width: 600px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                    ) : '🛒'}
                  </div>
                  <div className="dept-overlay">
                    <h4>{cat.name}</h4>
                    <p>{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/supermarket" className="btn btn-outline-dark">See All Departments</Link>
          </div>
        </div>
      </section>

      {promotions.length > 0 && (
        <section>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Don&apos;t Miss Out</span>
              <h2>Current Offers</h2>
            </div>
            <div className="grid grid-3">
              {promotions.map((promo) => (
                <PromoCard promo={promo} key={promo.id} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/promotions" className="btn btn-outline-dark">See All Offers</Link>
            </div>
          </div>
        </section>
      )}

      {galleryPreview.length > 0 && (
        <section>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">A Look Inside</span>
              <h2>Gallery</h2>
            </div>
            <div className="grid grid-4">
              {galleryPreview.map((img) => (
                <div className="gallery-photo" key={img.id} style={{ cursor: 'default' }}>
                  <Image src={img.url} alt={img.caption || 'Taata Owen Supermarket'} width={300} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/gallery" className="btn btn-outline-dark">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="container">
          <h2>Hungry while you shop?</h2>
          <p>Visit our in-house restaurant for a freshly cooked meal.</p>
          <Link href="/restaurant" className="btn btn-primary" style={{ background: 'var(--green-dark)', color: '#fff' }}>See the Menu</Link>
        </div>
      </section>
    </>
  );
}
