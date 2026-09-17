import { getFeaturedImage } from '../../../lib/featuredImage.js';
import AdminLoginForm from '../../../components/AdminLoginForm.js';

export const revalidate = 60;

export default async function AdminLoginPage() {
  const featuredImage = await getFeaturedImage();

  return <AdminLoginForm imageUrl={featuredImage?.url} />;
}
