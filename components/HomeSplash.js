'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'taata-splash-shown';

export default function HomeSplash({ imageUrl }) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage unavailable (private mode, etc.) -- just show it once and move on.
    }

    setVisible(true);
    const fadeTimer = setTimeout(() => setFading(true), 1400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore
      }
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [imageUrl]);

  if (!imageUrl || !visible) return null;

  return (
    <div className={`home-splash${fading ? ' fade-out' : ''}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" />
    </div>
  );
}
