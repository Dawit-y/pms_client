import { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import HorizontalLayout from '../components/HorizontalLayout';
import VerticalLayout from '../components/VerticalLayout';
import AccessGuard from '../routes/AccessGuard';
import { layoutSelectors } from '../store/layout/layoutSlice';

const AppLayout = ({ layoutType, children }) => {
  if (layoutType === 'horizontal') {
    return <HorizontalLayout>{children}</HorizontalLayout>;
  }
  return <VerticalLayout>{children}</VerticalLayout>;
};

export default function ProtectedLayout({ children }) {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);

  return (
    <AccessGuard>
      <AppLayout layoutType={layoutType}>
        <Suspense
          fallback={
            <div className="d-flex align-items-center justify-content-center vh-100">
              <Spinner />
            </div>
          }
        >
          {children || <Outlet />}
        </Suspense>
      </AppLayout>
    </AccessGuard>
  );
}
