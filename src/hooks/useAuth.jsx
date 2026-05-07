import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectUserData } from '../store/auth/authSlice';

export const useAuth = () => {
  const user = useSelector(selectUserData);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userUpdatedPassword = user?.usr_password_changed === 1;

  const userId = user?.usr_id ?? null;
  const departmentId = user?.usr_department_id ?? null;
  const isLoading = user === undefined || user === null;

  return {
    user,
    userId,
    departmentId,
    isAuthenticated,
    isLoading,
    userUpdatedPassword,
  };
};
