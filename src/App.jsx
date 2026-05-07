import { NuqsAdapter } from 'nuqs/adapters/react';
import { useMemo, useState, useEffect, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';
import { ToastContainer } from 'react-toastify';

import ErrorElement from './components/Common/ErrorElement';
import NotFound from './components/Common/NotFound';
import Unauthorized from './components/Common/Unauthorized';
import HorizontalLayout from './components/HorizontalLayout';
import NonAuthLayout from './components/NonAuthLayout';
import ProtectedLayout from './components/ProtectedLayout';
import VerticalLayout from './components/VerticalLayout';
import { refreshAccessToken } from './helpers/axios';
import { protectedRoutes, publicRoutes } from './routes';
import AccessGuard from './routes/AccessGuard';
import { selectAccessToken } from './store/auth/authSlice';
import { layoutSelectors } from './store/layout/layoutSlice';

const AppLayout = ({ layoutType, children }) =>
  layoutType === 'horizontal' ? (
    <HorizontalLayout>{children}</HorizontalLayout>
  ) : (
    <VerticalLayout>{children}</VerticalLayout>
  );

const renderRoute = (route, idx) => {
  // Auto-wrap with AccessGuard - authentication is automatic, permission is optional
  const element = (
    <AccessGuard permission={route.permission}>
      <Suspense
        fallback={
          <div className="d-flex align-items-center justify-content-center vh-100">
            <Spinner />
          </div>
        }
      >
        {route.element}
      </Suspense>
    </AccessGuard>
  );

  if (route.children) {
    return (
      <Route
        key={idx}
        path={route.path}
        element={element}
        errorElement={<ErrorElement />}
      >
        {route.children.map((child, childIdx) => renderRoute(child, childIdx))}
      </Route>
    );
  }

  return (
    <Route
      key={idx}
      path={route.path}
      index={route.index}
      element={element}
      errorElement={<ErrorElement />}
    />
  );
};

const App = () => {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);
  const accessToken = useSelector(selectAccessToken);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resolveAuth = async () => {
      if (!accessToken) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Initial auth resolution failed:', error);
        } finally {
          if (isMounted) setIsAuthResolved(true);
        }
      } else {
        setIsAuthResolved(true);
      }
    };

    resolveAuth();

    const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
    const intervalId = setInterval(async () => {
      if (accessToken) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Scheduled token refresh failed:', error);
        }
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [accessToken]);

  // Memoize router to prevent unnecessary re-creation
  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <>
          {publicRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={<NonAuthLayout>{route.element}</NonAuthLayout>}
              errorElement={<ErrorElement />}
            />
          ))}

          <Route element={<ProtectedLayout />}>
            {protectedRoutes.map((route, idx) => renderRoute(route, idx))}
          </Route>

          <Route
            path="/not_found"
            element={
              <AppLayout layoutType={layoutType}>
                <NotFound />
              </AppLayout>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <AppLayout layoutType={layoutType}>
                <Unauthorized />
              </AppLayout>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout layoutType={layoutType}>
                <NotFound />
              </AppLayout>
            }
          />
        </>
      )
    );
  }, [layoutType]); // Only recreate when layout changes

  if (!isAuthResolved) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner variant="primary" />
      </div>
    );
  }

  return (
    <>
      <NuqsAdapter>
        <RouterProvider router={router} />
      </NuqsAdapter>
      <ToastContainer />
    </>
  );
};

export default App;
