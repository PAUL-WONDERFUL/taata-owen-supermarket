'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/supermarket', label: 'Supermarket' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar-links">
            <span>📍 Nizam Road, Jinja, Uganda</span>
            <span>🕗 Open Daily · 8:00 AM – 10:00 PM</span>
          </div>
          <div className="topbar-links">
            <a href="tel:+256756761585">📞 +256 756 761585</a>
            <a href="https://wa.me/256756761585" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <nav className="navbar container">
          <Link href="/" className="logo">
            <Image src="/images/logo-sm.png" alt="Taata Owen Supermarket logo" width={140} height={124} className="logo-img" priority />
            <span>Taata Owen<span className="tag">Supermarket &amp; Restaurant</span></span>
          </Link>
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            <span></span><span></span><span></span>
          </button>
          <ul className={`nav-links${open ? ' open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
