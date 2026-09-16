import Image from 'next/image';
import AdminSidebarNav from '../../../components/AdminSidebarNav.js';

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/admin" className="logo">
          <Image src="/images/logo-sm.png" alt="Taata Owen Supermarket" width={100} height={89} className="logo-img" />
          <span>Taata Owen<span className="tag" style={{ color: 'rgba(255,255,255,0.6)' }}>Admin</span></span>
        </a>
        <AdminSidebarNav />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
