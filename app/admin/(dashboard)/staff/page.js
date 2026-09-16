import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { prisma } from '../../../../lib/prisma.js';
import StaffClient from '../../../../components/StaffClient.js';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  const staff = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <>
      <div className="admin-topline"><h1>Staff Accounts</h1></div>
      <StaffClient initialStaff={staff} currentUserId={session?.user?.id} />
    </>
  );
}
