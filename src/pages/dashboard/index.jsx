import { Suspense, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

const INVESTOR_USER_TYPE = 3;

const Dashboard = () => {
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
      <h1>Dashboard</h1>
    </Suspense>
  );
};

export default Dashboard;
