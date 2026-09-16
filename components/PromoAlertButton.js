export default function PromoAlertButton() {
  return (
    <a href="/promotions" className="promo-alert-floating" aria-label="View current promotions and offers">
      🔔
      <span className="promo-alert-dot" />
    </a>
  );
}
