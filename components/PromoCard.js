import Image from 'next/image';

function formatPrice(price) {
  return `UGX ${price.toLocaleString('en-US')}`;
}

function formatDateRange(start, end) {
  const opts = { day: 'numeric', month: 'short' };
  return `${new Date(start).toLocaleDateString('en-GB', opts)} – ${new Date(end).toLocaleDateString('en-GB', opts)}`;
}

export default function PromoCard({ promo, showDates = false }) {
  return (
    <div className="promo-card">
      <div className="promo-photo">
        <span className="promo-badge">Offer</span>
        {promo.imageUrl && (
          <Image src={promo.imageUrl} alt={promo.title} fill sizes="(max-width: 600px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
        )}
        <div className="promo-overlay">
          <h3>{promo.title}</h3>
        </div>
      </div>
      <div className="promo-body">
        {promo.description && <p>{promo.description}</p>}
        {(promo.originalPrice != null || promo.price != null) && (
          <div className="promo-price-row">
            {promo.originalPrice != null && <span className="promo-price-original">{formatPrice(promo.originalPrice)}</span>}
            {promo.price != null && <span className="promo-price-offer">{formatPrice(promo.price)}</span>}
          </div>
        )}
        {showDates && <div className="promo-dates">Valid {formatDateRange(promo.startDate, promo.endDate)}</div>}
      </div>
    </div>
  );
}
