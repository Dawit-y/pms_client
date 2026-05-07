import { Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

const AccessGuard = ({ children, permission }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasPermission, isLoading: permissionLoading } = usePermissions();

  if (authLoading || permissionLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AccessGuard;
