import React, { useState, useCallback, Suspense } from 'react';
import {
  Card,
  Col,
  Row,
  Button,
  Nav,
  Spinner,
  Offcanvas,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router';

import { useIsMobile } from '../../hooks/useIsMobile';

const DetailLayout = ({
  id,
  basePath,
  accessibleNavItems,
  activeKey,
  children,
  isLoading = false,
  minHeight = 'calc(100vh - 200px)',
  title = '',
  subtitle = '',
  projectId,
  actions,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // desktop sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // mobile drawer state
  const [showMobileNav, setShowMobileNav] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const openMobileNav = useCallback(() => {
    setShowMobileNav(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setShowMobileNav(false);
  }, []);

  const handleTabClick = useCallback(
    (key) => {
      if (key !== activeKey) {
        navigate(`${basePath}/${id}/${key}`);
      }

      // auto close drawer after navigation on mobile
      if (isMobile) {
        closeMobileNav();
      }
    },
    [navigate, basePath, id, activeKey, isMobile, closeMobileNav]
  );

  const renderNavItems = () =>
    accessibleNavItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeKey === item.key;

      return (
        <Nav.Item key={item.key} className="mb-1">
          <Nav.Link
            onClick={() => !item.disabled && handleTabClick(item.key)}
            disabled={item.disabled}
            className={`d-flex align-items-center rounded-2 ${
              isActive ? 'bg-primary text-white fw-semibold' : 'text-dark'
            } ${item.disabled ? 'opacity-50 text-muted' : ''}`}
            style={{
              justifyContent: isMobile
                ? 'flex-start'
                : isSidebarCollapsed
                  ? 'center'
                  : 'flex-start',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              pointerEvents: item.disabled ? 'none' : 'auto',
            }}
          >
            <Icon
              size={16}
              className={isMobile || !isSidebarCollapsed ? 'me-2' : ''}
            />

            {(isMobile || !isSidebarCollapsed) && t(item.label)}
          </Nav.Link>
        </Nav.Item>
      );
    });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {/* MOBILE OFFCANVAS NAV */}
      <Offcanvas show={showMobileNav} onHide={closeMobileNav} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('navigation')}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-2">
          <Nav className="flex-column">{renderNavItems()}</Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Card>
        <Card.Body className="p-0">
          <Row className="g-0" style={{ minHeight }}>
            {/* DESKTOP SIDEBAR ONLY */}
            {!isMobile && (
              <Col
                xs="auto"
                className="bg-light border-end d-flex flex-column"
                style={{
                  flexBasis: isSidebarCollapsed ? '60px' : '20%',
                  maxWidth: isSidebarCollapsed ? '60px' : '20%',
                  transition: 'all .3s ease',
                }}
              >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  {!isSidebarCollapsed && (
                    <h6 className="mb-0 fw-semibold">{t('navigation')}</h6>
                  )}

                  <Button
                    variant="link"
                    size="sm"
                    onClick={toggleSidebar}
                    className="p-0"
                  >
                    <FaBars size={18} />
                  </Button>
                </div>

                <Nav
                  className="flex-column p-2 flex-grow-1"
                  style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  {renderNavItems()}
                </Nav>
              </Col>
            )}

            {/* MAIN CONTENT */}
            <Col
              className="flex-grow-1 d-flex flex-column"
              style={{ overflowY: 'auto' }}
            >
              {(projectId || title || subtitle || actions || isMobile) && (
                <div
                  className="border-bottom bg-light p-3"
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    {/* Left side */}
                    <div className="d-flex align-items-start gap-3 flex-grow-1">
                      {/* Mobile hamburger */}
                      {isMobile && (
                        <Button
                          variant="link"
                          className="p-0 mt-1"
                          onClick={openMobileNav}
                        >
                          <FaBars size={20} />
                        </Button>
                      )}

                      <div>
                        {title && <h5 className="mb-1 fw-semibold">{title}</h5>}

                        {subtitle && (
                          <p className="mb-0 text-muted small">{subtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {actions && <div className="flex-shrink-0">{actions}</div>}
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="p-3 p-md-4 flex-grow-1">
                <Suspense
                  fallback={
                    <div className="d-flex justify-content-center p-5">
                      <Spinner animation="border" />
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default DetailLayout;
