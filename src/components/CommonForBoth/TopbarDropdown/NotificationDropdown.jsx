import { useMemo } from 'react';
import { Dropdown, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaBell, FaRegClock, FaArrowAltCircleRight } from 'react-icons/fa';
import { Link } from 'react-router';
import SimpleBar from 'simplebar-react';

import {
  useFetchNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../../../queries/notifications_query';

const formatNotificationDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString();
};

const NotificationDropdown = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useFetchNotifications();
  const markOne = useMarkNotificationAsRead();
  const markAll = useMarkAllNotificationsAsRead();

  const notifications = useMemo(() => data?.data || [], [data]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  return (
    <Dropdown className="dropdown d-inline-block" tag="li">
      <Dropdown.Toggle
        variant="transparent"
        className="header-item noti-icon position-relative"
        tag="button"
        id="page-header-notifications-dropdown"
      >
        <FaBell className="bx-tada" size={20} />
        {unreadCount > 0 && (
          <span className="badge bg-danger rounded-pill">{unreadCount}</span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">{t('notifications')}</h6>
            </Col>
            {unreadCount > 0 && (
              <Col xs="auto">
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0"
                  onClick={() => markAll.mutate()}
                  disabled={markAll.isPending}
                >
                  {t('mark_all_as_read')}
                </button>
              </Col>
            )}
          </Row>
        </div>

        {isError && (
          <h6 className="text-center text-danger text-sm">
            {t('error_occurred_during_fetching')}
          </h6>
        )}

        {!isError && !isLoading && notifications.length === 0 && (
          <h6 className="p-3 text-center">{t('no_new_notifications')}</h6>
        )}

        {isLoading && <div className="p-3 text-center">{t('loading')}</div>}

        {!isLoading && notifications.length > 0 && (
          <SimpleBar style={{ height: '230px' }}>
            {notifications.map((notification) => (
              <Link
                to="/notifications"
                key={notification.uuid}
                className={`text-reset notification-item ${
                  notification.is_read ? '' : 'fw-semibold'
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    markOne.mutate(notification.uuid);
                  }
                }}
              >
                <div className="d-flex">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                      <FaBell />
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">
                      {notification.actor_email || t('notification')}
                    </h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{notification.verb}</p>
                      <p className="mb-0">
                        <FaRegClock className="me-1" />
                        {formatNotificationDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleBar>
        )}

        <div className="p-2 border-top d-grid">
          {notifications.length > 0 && (
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
