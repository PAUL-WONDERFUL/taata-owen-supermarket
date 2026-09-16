'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/supermarket', label: 'Supermarket' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/promotions', label: 'Offers' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link href="/" className="logo">
          <Image src="/images/logo-sm.png" alt="Taata Owen Supermarket logo" width={140} height={124} className="logo-img" priority />
          <span>Taata Owen<span className="tag">Supermarket &amp; Restaurant</span></span>
        </Link>
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span><span></span><span></span>
        </button>
        <div
          className={`nav-backdrop${open ? ' open' : ''}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
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
  );
}
