import { useMemo } from 'react';
import { Dropdown, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaBell, FaRegClock, FaArrowAltCircleRight } from 'react-icons/fa';
import { Link } from 'react-router';
import SimpleBar from 'simplebar-react';

import { useFetchNotifications } from '../../../queries/notifications_query';

const NotificationDropdown = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useFetchNotifications();

  const unreadNotCount = useMemo(() => {
    return data?.data?.filter((not) => not.not_is_read === 0).length;
  }, [data]);

  return (
    <Dropdown className="dropdown d-inline-block" tag="li">
      <Dropdown.Toggle
        variant="transparent"
        className="header-item noti-icon position-relative"
        tag="button"
        id="page-header-notifications-dropdown"
      >
        <FaBell className="bx-tada" size={20} />
        {unreadNotCount > 0 && (
          <span className="badge bg-danger rounded-pill">{unreadNotCount}</span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">{t('notifications')}</h6>
            </Col>
          </Row>
        </div>

        {isError && (
          <h6 className="text-center text-danger text-sm">
            {t('error_occurred_during_fetching')}
          </h6>
        )}

        {!isError && data?.data?.length === 0 && (
          <h6 className="p-3 text-center">{t('no_new_notifications')}</h6>
        )}

        {isLoading && <div className="p-3 text-center">{t('loading')}</div>}

        {!isLoading && data?.data?.length > 0 && (
          <SimpleBar style={{ height: '230px' }}>
            {data?.data?.map((notification, index) => (
              <Link
                to="/notifications"
                key={index}
                className="text-reset notification-item"
              >
                <div className="d-flex">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                      <i
                        className={`bx bx-${notification.not_type.toLowerCase()}`}
                      />
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">
                      {t(notification.not_type.toLowerCase())}
                    </h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{t(notification.not_detail)}</p>
                      <p className="mb-0">
                        <FaRegClock className="me-1" />
                        {notification.not_date}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleBar>
        )}

        <div className="p-2 border-top d-grid">
          {data?.data?.length > 0 && (
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/notifications"
            >
              <FaArrowAltCircleRight className="me-1" />
              {t('view_all')}
            </Link>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
