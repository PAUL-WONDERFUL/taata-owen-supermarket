export const ROLES = ['SUPER_ADMIN', 'MANAGER', 'STAFF'];

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

// Manager: full content management (categories, menu, gallery/media, messages).
// Staff: can add/edit content but not delete it, and has no access to staff
// accounts or customer messages.
export function canDeleteContent(role) {
  return role === 'SUPER_ADMIN' || role === 'MANAGER';
}

// Full staff management (view roster, change roles, remove accounts): Super Admin only.
export function canManageStaff(role) {
  return role === 'SUPER_ADMIN';
}

// Managers are often on-site when a Super Admin isn't, so they can add new
// Staff-tier accounts -- but never Manager or Super Admin accounts, and they
// can't see the roster or remove/promote anyone. That stays Super Admin only.
export function canAddStaff(role) {
  return role === 'SUPER_ADMIN' || role === 'MANAGER';
}

export function canViewMessages(role) {
  return role === 'SUPER_ADMIN' || role === 'MANAGER';
}

export function canManagePromotions(role) {
  return role === 'SUPER_ADMIN' || role === 'MANAGER';
}

// The site-wide background photo (Home splash/hero, admin login) is a major,
// site-wide look-and-feel choice -- Super Admin only, unlike ordinary content.
export function canManageSiteSettings(role) {
  return role === 'SUPER_ADMIN';
}
