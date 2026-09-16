import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canViewMessages } from '../../../../lib/permissions.js';
import { prisma } from '../../../../lib/prisma.js';
import MessagesClient from '../../../../components/MessagesClient.js';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!canViewMessages(session?.user?.role)) {
    return (
      <>
        <div className="admin-topline"><h1>Contact Messages</h1></div>
        <div className="admin-panel">
          <p>Only a Super Admin or Manager can view customer messages.</p>
        </div>
      </>
    );
  }

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <div className="admin-topline"><h1>Contact Messages</h1></div>
      <MessagesClient initialMessages={messages} />
    </>
  );
}
