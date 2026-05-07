import React, { memo, useMemo } from 'react';
import { Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaHistory,
  FaArrowRight,
  FaCalendarAlt,
  FaCommentDots,
  FaExchangeAlt,
} from 'react-icons/fa';

import { useFetchLookups, useLookups } from '../../../queries/lookups_query';
import {
  LOOKUP_GROUPS,
  LOOKUP_TYPE_IDS,
} from '../../../utils/constants/lookUpTypes';
import ColorBadge from '../ColorBadge';
import './DetailTabs.scss';
import FetchErrorHandler from '../FetchErrorHandler';

/* ── Stat Card helper ── */
// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, children }) => (
  <Card className="dt-stat-card border rounded-3 w-100">
    <Card.Body className="d-flex align-items-center gap-3 py-3 px-3">
      <div className="dt-icon">
        <Icon size={20} />
      </div>
      <div>
        <div
          className="text-muted text-uppercase small fw-medium"
          style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
        >
          {label}
        </div>
        {children}
      </div>
    </Card.Body>
  </Card>
);

const ProjectStatusTab = ({ data }) => {
  const { t } = useTranslation();
  const { status = [] } = data;

  const {
    data: lookups,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchLookups();
  const { getLookupLabel } = useLookups(LOOKUP_GROUPS.PROJECT_STATUS_FIELDS);

  const sortedStatus = useMemo(() => {
    const projectEntry = {
      prs_id: 'project-entry',
      prs_date: data.project?.prj_create_time,
      act_activity_type_id: 1, // Project Entry
      prs_new_status_id: data.project?.prj_status,
      prs_previous_status_id: null,
      prs_remark: t('initial_project_entry'),
      prs_created_time: data.project?.prj_create_time,
    };

    return [...status, projectEntry].sort(
      (a, b) => new Date(b.prs_date) - new Date(a.prs_date)
    );
  }, [status, data.project, t]);

  const getActivityLabel = (id) =>
    ({
      1: t('project_entry'),
      2: t('monitoring'),
      3: t('expansion'),
      4: t('extension'),
      5: t('termination'),
    })[id] || t('unknown_activity');

  const getActivityColor = (id) =>
    ({ 1: 'success', 2: 'info', 3: 'danger', 4: 'warning', 5: 'primary' })[
      id
    ] || 'secondary';

  const getLookupColor = (id) => {
    const lookup = lookups?.results?.find((l) => l.lku_id === id);
    return lookup?.lku_color_code || '';
  };

  /* ── Date formatting helper ── */
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ── Empty ── */
  if (sortedStatus.length === 0) {
    return (
      <Card className="border rounded-3">
        <Card.Body className="text-center py-5 px-4">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72 }}
          >
            <FaHistory size={28} className="text-secondary" />
          </div>
          <h5 className="fw-semibold text-dark">{t('no_status_history')}</h5>
          <p className="text-muted small mb-0">{t('no_status_history_desc')}</p>
        </Card.Body>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border rounded-3">
        <Card.Body className="text-center py-5 px-4">
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    );
  }

  if (isError) return <FetchErrorHandler error={error} onRetry={refetch} />;

  return (
    <div className="detail-tab">
      {/* ── Summary Cards ── */}
      <Row className="g-3 mb-4">
        <Col sm={6} className="d-flex">
          <StatCard icon={FaHistory} label={t('total_status_changes')}>
            <div
              className="fw-semibold text-dark"
              style={{ fontSize: '1.3rem', lineHeight: 1.2 }}
            >
              {sortedStatus.length}
            </div>
          </StatCard>
        </Col>
        <Col sm={6} className="d-flex">
          <StatCard icon={FaExchangeAlt} label={t('current_status')}>
            <ColorBadge
              color={getLookupColor(sortedStatus[0].prs_new_status_id)}
              className="mt-1"
              style={{ fontSize: '0.78rem' }}
            >
              {getLookupLabel(
                LOOKUP_TYPE_IDS.PROJECT_STATUS,
                sortedStatus[0].prs_new_status_id
              )}
            </ColorBadge>
          </StatCard>
        </Col>
      </Row>

      {/* ── Timeline ── */}
      <div className="dt-timeline">
        {sortedStatus.map((statusItem, idx) => {
          const isFirst = idx === 0;
          const statusDate = new Date(statusItem.prs_date);

          return (
            <div
              key={statusItem.prs_id}
              className={`dt-timeline-item position-relative mb-4 ${isFirst ? 'is-latest' : ''}`}
            >
              {/* Dot */}
              <div className="dt-dot">
                <div className="dt-dot-inner" />
              </div>

              <Card
                className={`dt-card border rounded-3 overflow-hidden ${isFirst ? 'border-primary border-opacity-25' : ''}`}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 bg-light border-bottom px-3 py-2">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <span className="d-inline-flex align-items-center gap-1 bg-white border rounded px-2 py-1 fw-medium small text-dark">
                      <FaCalendarAlt
                        size={12}
                        style={{ color: 'var(--dt-accent)' }}
                      />
                      {statusDate.toLocaleString()}
                    </span>
                    <Badge
                      bg={getActivityColor(statusItem.act_activity_type_id)}
                      className="fw-medium"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {getActivityLabel(statusItem.act_activity_type_id)}
                    </Badge>
                    {isFirst && (
                      <Badge
                        bg="warning"
                        text="dark"
                        className="fw-semibold"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {t('current')}
                      </Badge>
                    )}
                  </div>
                  {/* <div>
                    <div
                      className="text-muted text-uppercase"
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.04em',
                        lineHeight: 1.2,
                      }}
                    >
                      {t('created_by')}
                    </div>
                    <div
                      className="fw-semibold text-dark"
                      style={{ fontSize: '0.82rem', lineHeight: 1.3 }}
                    >
                      {statusItem.prs_created_by}
                    </div>
                  </div> */}
                  <div>
                    <div
                      className="text-muted text-uppercase"
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.04em',
                        lineHeight: 1.2,
                      }}
                    >
                      {t('created_at')}
                    </div>
                    <div
                      className="fw-semibold text-dark"
                      style={{ fontSize: '0.82rem', lineHeight: 1.3 }}
                    >
                      {formatDateTime(statusItem.prs_created_time)}
                    </div>
                  </div>
                </div>

                <Card.Body className="p-3">
                  {/* Status Transition */}
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                    {statusItem.prs_previous_status_id && (
                      <>
                        <ColorBadge
                          color={getLookupColor(
                            statusItem.prs_previous_status_id
                          )}
                          className="px-3 py-2"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {getLookupLabel(
                            LOOKUP_TYPE_IDS.PROJECT_STATUS,
                            statusItem.prs_previous_status_id
                          )}
                        </ColorBadge>
                        <FaArrowRight className="text-muted" size={14} />
                      </>
                    )}
                    <ColorBadge
                      color={getLookupColor(statusItem.prs_new_status_id)}
                      className="px-3 py-2"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {getLookupLabel(
                        LOOKUP_TYPE_IDS.PROJECT_STATUS,
                        statusItem.prs_new_status_id
                      )}
                    </ColorBadge>
                  </div>

                  {/* Justification */}
                  {statusItem.prs_status_justification && (
                    <div
                      className="rounded p-2 px-3 mt-3"
                      style={{
                        background: 'var(--dt-accent-05)',
                      }}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <div>
                          <div
                            className="text-muted text-uppercase fw-semibold"
                            style={{
                              fontSize: '0.7rem',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {t('justification')}
                          </div>
                          <div className="text-dark small fw-medium">
                            {statusItem.prs_status_justification}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Remarks */}
                  {statusItem.prs_remark && (
                    <div
                      className="mt-3 rounded p-2 px-3"
                      style={{
                        background: 'var(--dt-accent-05)',
                      }}
                    >
                      <div
                        className="text-uppercase fw-semibold d-flex align-items-center gap-1 mb-1"
                        style={{
                          fontSize: '0.7rem',
                          letterSpacing: '0.04em',
                          color: 'var(--dt-accent)',
                        }}
                      >
                        <FaCommentDots size={11} />
                        {t('remarks')}
                      </div>
                      <p className="text-dark small mb-0">
                        {statusItem.prs_remark}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProjectStatusTab);
