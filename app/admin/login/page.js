import { getBackgroundImageUrl } from '../../../lib/siteSettings.js';
import AdminLoginForm from '../../../components/AdminLoginForm.js';

export const revalidate = 60;

export default async function AdminLoginPage() {
  const backgroundImageUrl = await getBackgroundImageUrl();

  return <AdminLoginForm imageUrl={backgroundImageUrl} />;
}
