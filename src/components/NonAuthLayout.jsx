import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';
import { changeLayoutMode, layoutSelectors } from '../store/layout/layoutSlice';

const NonAuthLayout = ({ children }) => {
  const dispatch = useDispatch();
  const layoutModeType = useSelector(layoutSelectors.selectLayoutModeType);

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }
  }, [layoutModeType, dispatch]);

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense
      fallback={
        <div className="d-flex align-items-center justify-content-center vh-100">
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
};

export default NonAuthLayout;
