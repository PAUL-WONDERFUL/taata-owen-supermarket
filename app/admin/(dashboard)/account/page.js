import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { ROLE_LABELS } from '../../../../lib/permissions.js';
import AccountClient from '../../../../components/AccountClient.js';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="admin-topline"><h1>My Account</h1></div>
      <div className="admin-panel">
        <h2>Account Details</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
          {session?.user?.name} · {session?.user?.email} · Role: {ROLE_LABELS[session?.user?.role] || session?.user?.role}
        </p>
      </div>
      <AccountClient userId={session?.user?.id} />
    </>
  );
}
