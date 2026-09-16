export default function FindUsButton({ floating = false }) {
  return (
    <a href="/contact#map" className={`glass-cta${floating ? ' glass-cta-floating' : ''}`}>
      📍 Find Us in Jinja
    </a>
  );
}
