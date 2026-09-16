import { prisma } from '../../../../lib/prisma.js';
import MessagesClient from '../../../../components/MessagesClient.js';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <div className="admin-topline"><h1>Contact Messages</h1></div>
      <MessagesClient initialMessages={messages} />
    </>
  );
}
