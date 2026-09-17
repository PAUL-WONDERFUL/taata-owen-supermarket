'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/media', label: 'Media Library' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/menu', label: 'Restaurant Menu' },
  { href: '/admin/menu-categories', label: 'Menu Sections' },
  { href: '/admin/promotions', label: 'Promotions', roles: ['SUPER_ADMIN', 'MANAGER'] },
  { href: '/admin/messages', label: 'Messages', roles: ['SUPER_ADMIN', 'MANAGER'] },
  { href: '/admin/staff', label: 'Staff Accounts', roles: ['SUPER_ADMIN', 'MANAGER'] },
  { href: '/admin/account', label: 'My Account' },
];

export default function AdminSidebarNav({ role }) {
  const pathname = usePathname();
  const visibleLinks = LINKS.filter((link) => !link.roles || link.roles.includes(role));

  return (
    <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div>
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
      </div>
      <form style={{ marginTop: 'auto', padding: '0 20px' }}>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="btn-sm-outline"
          style={{ width: '100%', borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
        >
          Sign Out
        </button>
      </form>
    </nav>
  );
}
