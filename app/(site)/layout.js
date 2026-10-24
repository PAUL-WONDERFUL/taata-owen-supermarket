import SiteHeader from '../../components/SiteHeader.js';
import SiteFooter from '../../components/SiteFooter.js';
import FindUsButton from '../../components/FindUsButton.js';
import PromoAlertButton from '../../components/PromoAlertButton.js';
import ScrollReveal from '../../components/ScrollReveal.js';
import { prisma } from '../../lib/prisma.js';

export const revalidate = 30;

export default async function SiteLayout({ children }) {
  const now = new Date();
  const activePromoCount = await prisma.promotion.count({
    where: { startDate: { lte: now }, endDate: { gte: now } },
  });

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      {activePromoCount > 0 && <PromoAlertButton />}
      <FindUsButton floating />
      <ScrollReveal />
    </>
  );
}
