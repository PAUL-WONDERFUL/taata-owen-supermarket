import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions.js';
import { prisma } from '../../../lib/prisma.js';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions);
  const now = new Date();

  const [categoryCount, menuCount, galleryCount, staffCount, activePromoCount, recentUploads] = await Promise.all([
    prisma.category.count(),
    prisma.menuItem.count(),
    prisma.galleryImage.count(),
    prisma.adminUser.count(),
    prisma.promotion.count({ where: { startDate: { lte: now }, endDate: { gte: now } } }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <div className="admin-topline">
        <h1>{greeting}, {session?.user?.name || 'Admin'}</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{categoryCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Menu Items</div>
          <div className="stat-value">{menuCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Gallery Photos</div>
          <div className="stat-value">{galleryCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Promotions</div>
          <div className="stat-value">{activePromoCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Staff Accounts</div>
          <div className="stat-value">{staffCount}</div>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Recent Uploads</h2>
        {recentUploads.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No photos uploaded yet — head to the Media Library to add your first one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th></th><th>Caption</th><th>Category</th><th>Uploaded</th></tr>
            </thead>
            <tbody>
              {recentUploads.map((img) => (
                <tr key={img.id}>
                  <td><img src={img.url} alt="" className="thumb" /></td>
                  <td>{img.caption || <span style={{ color: 'var(--gray)' }}>—</span>}</td>
                  <td>{img.category}</td>
                  <td>{new Date(img.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
