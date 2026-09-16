export const metadata = {
  title: 'About Us | Taata Owen Supermarket',
  description: "Learn about Taata Owen Supermarket, one of Jinja's busiest and most trusted one-stop shops for groceries and everyday essentials.",
};

export default function AboutPage() {
  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="hero-eyebrow">About Us</span>
            <h1>Who We Are</h1>
            <p>The story, values and people behind Jinja&apos;s favourite one-stop shop.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <h2 style={{ marginBottom: 16 }}>How we started</h2>
              <p style={{ color: 'var(--gray)' }}>
                <em>[Owner note: replace with when Taata Owen Supermarket opened and how it began.]</em>
              </p>
            </div>
            <div>
              <h2 style={{ marginBottom: 16 }}>Our vision</h2>
              <p style={{ color: 'var(--gray)' }}>
                <em>[Owner note: replace with the vision behind the business — what you set out to offer Jinja.]</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Offer</span>
            <h2>Our supermarket &amp; our restaurant</h2>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <div className="ico-big">🛒</div>
              <h3>The Supermarket</h3>
              <p>Taata Owen Supermarket has grown into one of Jinja City&apos;s busiest and most popular shopping destinations, known for keeping shelves fully stocked with the everyday essentials local families rely on — from fresh produce to household goods — all at fair, competitive prices.</p>
            </div>
            <div className="card">
              <div className="ico-big">🍽️</div>
              <h3>The Restaurant</h3>
              <p><em>[Owner note: replace with a description of the restaurant — its style of food, atmosphere, and what makes a meal here worth stopping for.]</em></p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our Commitment</span>
            <h2>Community, quality and fair prices</h2>
          </div>
          <div className="grid grid-3">
            <div className="card">
              <div className="ico-big">🤝</div>
              <h3>Community First</h3>
              <p>We&apos;re proud to serve the families of Jinja, and to be part of everyday life in the city.</p>
            </div>
            <div className="card">
              <div className="ico-big">✅</div>
              <h3>Quality &amp; Freshness</h3>
              <p>We restock regularly so produce and pantry staples stay fresh on every visit.</p>
            </div>
            <div className="card">
              <div className="ico-big">📍</div>
              <h3>Rooted on Nizam Road</h3>
              <p><em>[Owner note: replace with anything you'd like to say about your place in the Jinja community.]</em></p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Come see us on Nizam Road</h2>
          <p>We&apos;d love to welcome you in store.</p>
          <a href="/contact#map" className="btn btn-primary" style={{ background: 'var(--green-dark)', color: '#fff' }}>Get Directions</a>
        </div>
      </section>
    </>
  );
}
