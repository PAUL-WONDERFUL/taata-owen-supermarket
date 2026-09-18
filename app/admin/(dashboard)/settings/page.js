import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import { canManageSiteSettings } from '../../../../lib/permissions.js';
import { getSiteSettings } from '../../../../lib/siteSettings.js';
import SiteSettingsClient from '../../../../components/SiteSettingsClient.js';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!canManageSiteSettings(session?.user?.role)) {
    return (
      <>
        <div className="admin-topline"><h1>Site Settings</h1></div>
        <div className="admin-panel">
          <p>Only a Super Admin can manage site-wide settings.</p>
        </div>
      </>
    );
  }

  const settings = await getSiteSettings();

  return (
    <>
      <div className="admin-topline"><h1>Site Settings</h1></div>
      <SiteSettingsClient initialBackgroundImageUrl={settings.backgroundImageUrl} />
    </>
  );
}
