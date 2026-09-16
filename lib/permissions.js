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

export function canManageStaff(role) {
  return role === 'SUPER_ADMIN';
}

export function canViewMessages(role) {
  return role === 'SUPER_ADMIN' || role === 'MANAGER';
}
