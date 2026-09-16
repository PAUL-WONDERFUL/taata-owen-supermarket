import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canManagePromotions } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import PromotionsClient from '../../../../components/PromotionsClient.js';

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
  const session = await getServerSession(authOptions);

  if (!canManagePromotions(session?.user?.role)) {
    return (
      <>
        <div className="admin-topline"><h1>Promotions</h1></div>
        <div className="admin-panel">
          <p>Only a Super Admin or Manager can manage promotions.</p>
        </div>
      </>
    );
  }

  const promotions = await prisma.promotion.findMany({ orderBy: { startDate: 'desc' } });

  return (
    <>
      <div className="admin-topline"><h1>Promotions</h1></div>
      <PromotionsClient initialPromotions={promotions} />
    </>
  );
}
