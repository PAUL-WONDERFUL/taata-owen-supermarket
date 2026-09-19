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
            <p>More than a supermarket. A part of everyday life in Jinja. Taata Owen Supermarket brings together the products, convenience and service that make everyday shopping easier all under one roof.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <h2 style={{ marginBottom: 16 }}>How we started</h2>
              <p style={{ color: 'var(--gray)' }}>
                <em>From an idea to a trusted shopping destination. Taata Owen Supermarket was built with a simple purpose: to make quality products and everyday essentials more accessible to households in Jinja.</em>
              </p>
            </div>
            <div>
              <h2 style={{ marginBottom: 16 }}>Our vision</h2>
              <p style={{ color: 'var(--gray)' }}>
                <em>Making everyday shopping better for Jinja. Our vision is to create a convenient, welcoming shopping experience where customers can find what they need, discover more and feel confident every time they shop with us.</em>
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
              <p>Taata Owen Supermarket has grown into one of Jinja City&apos;s busiest and most popular shopping destinations, known for keeping shelves fully stocked with the everyday essentials local families rely on from fresh produce to household goods all at fair, competitive prices.</p>
            </div>
            <div className="card">
              <div className="ico-big">🍽️</div>
              <h3>The Restaurant</h3>
              <p><em>Good food, quick service. Take it with you. Our in-house restaurant makes it easy to grab a freshly prepared meal while you&apos;re shopping. Pick up something for the road, take it home or enjoy a quick bite while your order is being prepared.</em></p>
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
              <p><em>Part of Jinja. Part of your everyday. Located on Nizam Road, Taata Owen Supermarket is proud to serve the people, families and businesses that make Jinja home. We&apos;re here to make everyday shopping more convenient, one visit at a time.</em></p>
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
