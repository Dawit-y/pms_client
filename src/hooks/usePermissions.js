import { useSelector } from 'react-redux';

import { selectPermissions } from '../store/auth/authSlice';

/**
 * Hook for checking user permissions.
 * @returns {Object} { hasPermission, permissions }
 */
export const usePermissions = () => {
  const permissions = useSelector(selectPermissions);

  /**
   * Checks if the user has a specific permission or any/all of a set of permissions.
   * @param {string|string[]} requiredPermissions - A single permission string or an array of permissions.
   * @param {Object} options - Options for checking.
   * @param {'any'|'all'} options.match - Whether to match any or all of the required permissions (default: 'all').
   * @returns {boolean}
   */
  const hasPermission = (requiredPermissions, { match = 'all' } = {}) => {
    if (!requiredPermissions) return true;
    if (!permissions || permissions.length === 0) return false;

    const required = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];
    if (match === 'any') {
      return required.some((perm) => permissions.includes(perm));
    }

    return required.every((perm) => permissions.includes(perm));
  };

  return { hasPermission, permissions };
};
