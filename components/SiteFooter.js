import Image from 'next/image';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="/" className="logo">
              <Image src="/images/logo-sm.png" alt="Taata Owen Supermarket logo" width={140} height={124} className="logo-img" />
              <span>Taata Owen</span>
            </a>
            <p style={{ marginTop: 14, fontSize: '0.9rem', maxWidth: '32ch' }}>
              Jinja&apos;s busiest one-stop supermarket, with a restaurant on site.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/supermarket">Supermarket</a></li>
              <li><a href="/restaurant">Restaurant</a></li>
              <li><a href="/promotions">Offers</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>Nizam Road, Jinja, Uganda</li>
              <li>+256 756 761585</li>
              <li>Daily, 8am – 10pm</li>
            </ul>
          </div>
          <div>
            <h4>Follow Us</h4>
            <ul>
              <li><a href="https://www.facebook.com/Taata-Owen-Supermarket-2178888285554806/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://wa.me/256756761585" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">&copy; {year} Taata Owen Supermarket. All rights reserved.</div>
      </div>
    </footer>
  );
}
