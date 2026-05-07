import React, { useEffect, useMemo, lazy, memo } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaHome } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import DetailLayout from '../../components/Common/DetailLayout';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import { usePermissions } from '../../hooks/usePermissions';
import { useFetchUser } from '../../queries/users_query';

const OverviewTab = lazy(() => import('./OverviewTab'));

// Navigation items configuration
const navItems = [
  {
    key: 'overview',
    label: 'overview',
    icon: FaHome,
    component: OverviewTab,
    permission: 'accounts.view_user',
  },
  // Add more tabs here as needed
];

const UserDetails = () => {
  const { t } = useTranslation();
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    document.title = t('user_details');
  }, [t]);

  const { data, isLoading, isError, error, refetch } = useFetchUser(id);
  const user = data?.data;

  // Filter nav items based on permissions
  const accessibleNavItems = useMemo(
    () =>
      navItems.filter(
        (item) => !item.permission || hasPermission(item.permission)
      ),
    [hasPermission]
  );

  // Determine active tab
  const defaultTab = useMemo(
    () => (accessibleNavItems.length > 0 ? accessibleNavItems[0].key : ''),
    [accessibleNavItems]
  );

  const activeKey = useMemo(() => {
    if (!tab) return defaultTab;
    return accessibleNavItems.some((item) => item.key === tab)
      ? tab
      : defaultTab;
  }, [tab, accessibleNavItems, defaultTab]);

  // Redirect if tab is not accessible
  useEffect(() => {
    if (tab && !accessibleNavItems.some((item) => item.key === tab)) {
      navigate(`/user/${id}/${defaultTab}`, { replace: true });
    }
  }, [tab, accessibleNavItems, id, defaultTab, navigate]);

  if (isLoading) {
    return (
      <div className="page-content">
        <Container
          fluid
          className="d-flex justify-content-center align-items-center min-vh-50"
        >
          <Spinner animation="border" />
        </Container>
      </div>
    );
  }

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  // If no accessible tabs, show message
  if (accessibleNavItems.length === 0) {
    return (
      <div className="page-content">
        <Breadcrumbs
          items={[
            { label: t('users'), path: '/user' },
            { label: t('user_details'), active: true },
          ]}
        />
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body className="text-center p-5">
                <h5>{t('no_access')}</h5>
                <p className="text-muted">{t('no_permission_view')}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Get active component
  const ActiveComponent = accessibleNavItems.find(
    (item) => item.key === activeKey
  )?.component;

  return (
    <div className="page-content">
      <Breadcrumbs
        items={[
          { label: t('users'), path: '/user' },
          { label: t('user_details'), active: true },
        ]}
      />

      <Row>
        <Col lg={12}>
          <DetailLayout
            id={id}
            basePath="/user"
            navItems={navItems}
            accessibleNavItems={accessibleNavItems}
            activeKey={activeKey}
            defaultTab={defaultTab}
            contentClassName="detail-layout-content"
          >
            {ActiveComponent && <ActiveComponent user={user} isActive />}
          </DetailLayout>
        </Col>
      </Row>
    </div>
  );
};

export default memo(UserDetails);
