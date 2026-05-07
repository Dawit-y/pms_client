import { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { Card, Button, Nav, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaLayerGroup, FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import { Outlet, useParams, useNavigate } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';
import { useFetchLookupTypes } from '../../queries/lookup_types_query';

const searchConfig = {
  textSearchKeys: ['lku_code'],
};

const SIDEBAR_COLLAPSE_BREAKPOINT = 1200;

export default function LookupsLayout() {
  const { t } = useTranslation();
  const { typeId } = useParams();
  const navigate = useNavigate();
  const pageFilter = usePageFilters(searchConfig);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const { data: lookupTypesData, isLoading } = useFetchLookupTypes({}, true);

  const lookupTypes = useMemo(() => {
    return lookupTypesData?.data || [];
  }, [lookupTypesData]);

  const navItems = useMemo(() => {
    const items = lookupTypes.map((type) => ({
      key: type.uuid.toString(),
      label: type.name_en,
      icon: FaLayerGroup,
    }));
    if (!sidebarSearch.trim()) return items;
    const q = sidebarSearch.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [lookupTypes, sidebarSearch]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < SIDEBAR_COLLAPSE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!typeId && lookupTypes.length > 0) {
      navigate(`/lookups/type/${lookupTypes[0].uuid}`, { replace: true });
    }
  }, [typeId, lookupTypes, navigate]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleTabClick = useCallback(
    (key) => {
      if (key !== typeId) {
        navigate(`/lookups/type/${key}`);
      }
    },
    [navigate, typeId]
  );

  const activeTypeName = useMemo(() => {
    return lookupTypes.find((t) => t.uuid.toString() === typeId)?.name_en;
  }, [lookupTypes, typeId]);

  const outletContext = {
    pageFilter,
    searchConfig,
    typeId,
    activeTypeName,
    lookupTypes,
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <Card className="flex-grow-1 m-3" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          {/* SIDEBAR */}
          <div
            className="bg-body-tertiary border-end d-flex flex-column flex-shrink-0"
            style={{
              width: isSidebarCollapsed ? '80px' : '20%',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
            }}
          >
            {/* Sidebar Header */}
            <div
              className={`d-flex align-items-center border-bottom p-3 ${
                isSidebarCollapsed
                  ? 'justify-content-center'
                  : 'justify-content-between'
              }`}
            >
              {!isSidebarCollapsed && (
                <h6 className="mb-0 fw-semibold text-body">
                  {t('navigation')}
                </h6>
              )}
              <Button
                variant="link"
                size="sm"
                onClick={toggleSidebar}
                className="p-0 text-secondary"
              >
                <FaBars size={18} />
              </Button>
            </div>

            {/* Sidebar Search */}
            {!isSidebarCollapsed && (
              <div className="px-3 py-2 border-bottom">
                <InputGroup size="sm">
                  <InputGroup.Text className="bg-transparent border-end-0 text-secondary">
                    <FaSearch size={12} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={t('search') || 'Search…'}
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    className="border-start-0"
                    style={{ boxShadow: 'none', fontSize: '0.8125rem' }}
                  />
                  {sidebarSearch && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 px-2 text-secondary"
                      onClick={() => setSidebarSearch('')}
                      tabIndex={-1}
                    >
                      <FaTimes size={11} />
                    </Button>
                  )}
                </InputGroup>
              </div>
            )}

            {/* Scrollable Nav */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Nav className="flex-column p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = typeId === item.key;

                  return (
                    <Nav.Item
                      key={item.key}
                      className="mb-1"
                      data-tooltip={item.label}
                    >
                      <Nav.Link
                        onClick={() => handleTabClick(item.key)}
                        className={`d-flex align-items-center rounded-2 ${
                          isActive
                            ? 'bg-primary text-white fw-semibold'
                            : 'text-body'
                        }`}
                        style={{
                          justifyContent: isSidebarCollapsed
                            ? 'center'
                            : 'flex-start',
                        }}
                      >
                        <Icon
                          size={16}
                          className={isSidebarCollapsed ? '' : 'me-2'}
                        />
                        {!isSidebarCollapsed && t(item.label)}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div
            style={{
              width: isSidebarCollapsed ? 'calc(100% - 80px)' : '80%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
              }}
            >
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center p-5">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <Outlet context={outletContext} />
              </Suspense>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
