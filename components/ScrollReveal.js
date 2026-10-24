'use client';

import { useEffect } from 'react';

// Content blocks that fade/slide up the first time they scroll into view.
// Anything already on screen when it's found is left alone, so there's no
// flash of hidden content on load -- only below-the-fold blocks animate.
const SELECTOR = [
  '.section-head',
  '.card',
  '.dept-card',
  '.promo-card',
  '.gallery-photo',
  '.info-strip .item',
  '.menu-section',
  '.contact-list li',
  '.map-frame',
  '.cta-band .container',
].join(',');

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('is-visible');
          io.unobserve(el);
          // Once it has arrived, drop the reveal classes so the element's own
          // hover transitions (card lift, photo zoom) work normally again.
          setTimeout(() => {
            el.classList.remove('reveal', 'is-visible');
            el.style.removeProperty('--reveal-delay');
          }, 1100);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.dataset.reveal) return;
        el.dataset.reveal = '1';
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        // Stagger siblings in the same grid row so they cascade in.
        const index = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
        el.classList.add('reveal');
        io.observe(el);
      });
    };

    scan();
    // Pick up content rendered later (client-side page changes, gallery filters).
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
