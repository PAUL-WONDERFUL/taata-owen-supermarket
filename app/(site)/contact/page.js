import ContactForm from '../../../components/ContactForm.js';

export const metadata = {
  title: 'Contact Us | Taata Owen Supermarket',
  description: 'Visit or contact Taata Owen Supermarket on Nizam Road, Jinja, Uganda. Open 24/7. Call +256 756 761585.',
};

export default function ContactPage() {
  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="hero-eyebrow">Contact Us</span>
            <h1>We&apos;re here when you need us.</h1>
            <p>Visit Taata Owen on Nizam Road, Jinja — open 24/7 for your everyday shopping and freshly prepared meals.</p>
          </div>
        </div>
      </section>

      <section id="map">
        <div className="container">
          <div className="contact-wrap">
            <div>
              <h2 style={{ marginBottom: 20 }}>Store Details</h2>
              <ul className="contact-list">
                <li>
                  <span className="ico">📍</span>
                  <div><strong>Address</strong><p style={{ color: 'var(--gray)' }}>Nizam Road, Jinja, Uganda</p></div>
                </li>
                <li>
                  <span className="ico">🕗</span>
                  <div><strong>Opening Hours</strong><p style={{ color: 'var(--gray)' }}>Open 24/7 — Every Day</p></div>
                </li>
                <li>
                  <span className="ico">📞</span>
                  <div><strong>Phone</strong><p style={{ color: 'var(--gray)' }}><a href="tel:+256756761585">+256 756 761585</a></p></div>
                </li>
                <li>
                  <span className="ico">💬</span>
                  <div><strong>WhatsApp</strong><p style={{ color: 'var(--gray)' }}><a href="https://wa.me/256756761585" target="_blank" rel="noopener noreferrer">Message us directly</a></p></div>
                </li>
                <li>
                  <span className="ico">📘</span>
                  <div><strong>Facebook</strong><p style={{ color: 'var(--gray)' }}><a href="https://www.facebook.com/Taata-Owen-Supermarket-2178888285554806/" target="_blank" rel="noopener noreferrer">Taata Owen Supermarket</a></p></div>
                </li>
              </ul>

              <h2 style={{ margin: '32px 0 16px' }}>Send a Message</h2>
              <ContactForm />
            </div>

            <iframe
              className="map-frame"
              src="https://maps.google.com/maps?q=Taata+Owen+Supermarket+Jinja+Uganda&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Map to Taata Owen Supermarket"
            />
          </div>
        </div>
      </section>
    </>
  );
}
