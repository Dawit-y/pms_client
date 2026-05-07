import { lazy, Suspense, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

import { useAuth } from '../../hooks/useAuth';

const InvestorSelfDashboard = lazy(() => import('./InvestorSelfDashboard'));

const SupersetDashboard = lazy(() => import('./SupersetDashboard'));

const INVESTOR_USER_TYPE = 3;

const Dashboard = () => {
  const { user } = useAuth();
  const isInvestor = user?.usr_user_type === INVESTOR_USER_TYPE;

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <Suspense
      fallback={
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '60vh' }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      }
    >
      {isInvestor ? <InvestorSelfDashboard /> : <SupersetDashboard />}
    </Suspense>
  );
};

export default Dashboard;
