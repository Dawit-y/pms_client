import React, { memo, useMemo } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaIndustry,
  FaChartLine,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaCommentDots,
  FaCogs,
  FaTachometerAlt,
} from 'react-icons/fa';

import './DetailTabs.scss';

/* ── Stat Card helper ── */
// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, sub }) => (
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
        <div
          className="fw-semibold text-dark"
          style={{ fontSize: '1.3rem', lineHeight: 1.2 }}
        >
          {value}
        </div>
        {sub && (
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
            {sub}
          </div>
        )}
      </div>
    </Card.Body>
  </Card>
);

const ProductionCapacityTab = ({ data }) => {
  const { t } = useTranslation();
  const { production_capacitity = [] } = data;

  const sortedProduction = useMemo(() => {
    const projectEntry = {
      ppc_id: 'project-entry',
      ppc_date: data.project?.prj_create_time,
      act_activity_type_id: 1, // Project Entry
      ppc_design_capacity: data.project?.ppc_design_capacity,
      ppc_planned_capacity: data.project?.ppc_planned_capacity,
      ppc_product_detail: data.project?.ppc_product_detail,
      ppc_remark: t('initial_project_entry'),
    };

    return [...production_capacitity, projectEntry].sort(
      (a, b) => new Date(b.ppc_date) - new Date(a.ppc_date)
    );
  }, [production_capacitity, data.project, t]);

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

  const getCapacityTrend = (current, previous) => {
    if (!previous) return null;
    const curr = parseFloat(current.ppc_planned_capacity) || 0;
    const prev = parseFloat(previous.ppc_planned_capacity) || 0;
    if (prev === 0) return null;
    const change = ((curr - prev) / prev) * 100;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      percentage: Math.abs(change).toFixed(1),
    };
  };

  /* ── Empty ── */
  if (sortedProduction.length === 0) {
    return (
      <Card className="border rounded-3">
        <Card.Body className="text-center py-5 px-4">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72 }}
          >
            <FaIndustry size={28} className="text-secondary" />
          </div>
          <h5 className="fw-semibold text-dark">
            {t('no_production_capacity_data')}
          </h5>
          <p className="text-muted small mb-0">
            {t('no_production_capacity_data_desc')}
          </p>
        </Card.Body>
      </Card>
    );
  }

  const latestProd = sortedProduction[0];
  const latestDesign = parseFloat(latestProd.ppc_design_capacity) || 0;
  const latestPlanned = parseFloat(latestProd.ppc_planned_capacity) || 0;
  const latestUtil = parseFloat(latestProd.ppc_planned_capacity_percent) || 0;

  return (
    <div className="detail-tab">
      {/* ── Summary Cards ── */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg className="d-flex">
          <StatCard
            icon={FaIndustry}
            label={t('total_monitoring_records')}
            value={sortedProduction?.length ?? 0}
          />
        </Col>

        <Col xs={12} sm={6} lg className="d-flex">
          <StatCard
            icon={FaClock}
            label={t('latest_update')}
            value={
              latestProd?.ppc_date
                ? new Date(latestProd.ppc_date).toLocaleDateString()
                : '-'
            }
          />
        </Col>

        <Col xs={12} sm={6} lg className="d-flex">
          <StatCard
            icon={FaCogs}
            label={t('design_capacity')}
            value={latestDesign?.toLocaleString() ?? '-'}
            sub={t('most_recent')}
          />
        </Col>

        <Col xs={12} sm={6} lg className="d-flex">
          <StatCard
            icon={FaTachometerAlt}
            label={t('planned_capacity')}
            value={latestPlanned ?? '-'}
            sub={t('most_recent')}
          />
        </Col>

        <Col xs={12} sm={6} lg className="d-flex">
          <StatCard
            icon={FaTachometerAlt}
            label={t('utilization_rate')}
            value={
              latestUtil !== undefined && latestUtil !== null
                ? `${Number(latestUtil).toFixed(1)}%`
                : '-'
            }
            sub={t('most_recent')}
          />
        </Col>
      </Row>

      {/* ── Timeline ── */}
      <div className="dt-timeline">
        {sortedProduction.map((production, idx) => {
          const prev =
            idx < sortedProduction.length - 1
              ? sortedProduction[idx + 1]
              : null;
          const trend = getCapacityTrend(production, prev);

          const designCap = parseFloat(production.ppc_design_capacity) || 0;
          const plannedCap = parseFloat(production.ppc_planned_capacity) || 0;
          const utilRate =
            parseFloat(production.ppc_planned_capacity_percent) || 0;
          const isExceeding = plannedCap > designCap;
          const capDiff = plannedCap - designCap;
          const diffPct =
            designCap > 0 ? ((capDiff / designCap) * 100).toFixed(1) : 0;
          const latest = idx === 0;

          return (
            <div
              key={production.ppc_id}
              className={`dt-timeline-item position-relative mb-4 ${latest ? 'is-latest' : ''}`}
            >
              {/* Dot */}
              <div className="dt-dot">
                <div className="dt-dot-inner" />
              </div>

              <Card
                className={`dt-card border rounded-3 overflow-hidden ${latest ? 'border-primary border-opacity-25' : ''}`}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 bg-light border-bottom px-3 py-2">
                  {/* LEFT SIDE */}
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <span className="d-inline-flex align-items-center gap-1 bg-white border rounded px-2 py-1 fw-medium small text-dark">
                      <FaCalendarAlt
                        size={12}
                        style={{ color: 'var(--dt-accent)' }}
                      />
                      {new Date(production.ppc_date).toLocaleString()}
                    </span>

                    <Badge
                      bg={getActivityColor(production.act_activity_type_id)}
                      className="fw-medium"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {getActivityLabel(production.act_activity_type_id)}
                    </Badge>

                    {latest && (
                      <Badge
                        bg="warning"
                        text="dark"
                        className="fw-semibold"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {t('most_recent')}
                      </Badge>
                    )}
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="d-flex align-items-center gap-3">
                    {/* Capacity Analysis */}
                    {designCap > 0 && (
                      <div className="medium text-end">
                        <span className="fw-semibold text-muted me-1">
                          {t('capacity_analysis')}:
                        </span>
                        <span
                          className="fw-medium"
                          style={{ color: 'var(--dt-accent)' }}
                        >
                          {isExceeding
                            ? `${t('exceeding_design_by')} ${Math.abs(capDiff).toLocaleString()} (${diffPct}%)`
                            : `${t('below_design_by')} ${Math.abs(capDiff).toLocaleString()} (${diffPct}%)`}
                        </span>
                      </div>
                    )}

                    {/* Trend Badge */}
                    {trend && trend.direction !== 'same' && (
                      <Badge
                        bg={trend.direction === 'up' ? 'success' : 'danger'}
                        className="d-inline-flex align-items-center gap-1"
                      >
                        {trend.direction === 'up' ? (
                          <FaArrowUp size={10} />
                        ) : (
                          <FaArrowDown size={10} />
                        )}
                        {trend.percentage}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Body */}
                <Card.Body className="p-3">
                  {/* Capacity Metrics */}
                  <Row className="g-2 text-center mb-2">
                    <Col xs={4}>
                      <div className="border rounded py-2 px-1 h-100">
                        <small className="text-muted d-block">
                          {t('design_capacity')}
                        </small>
                        <div className="fw-semibold">
                          {designCap.toLocaleString()}
                        </div>
                      </div>
                    </Col>

                    <Col xs={4}>
                      <div className="border rounded py-2 px-1 h-100">
                        <small className="text-muted d-block">
                          {t('planned_capacity')}
                        </small>
                        <div
                          className="fw-semibold"
                          style={{ color: 'var(--dt-accent)' }}
                        >
                          {plannedCap.toLocaleString()}
                        </div>
                      </div>
                    </Col>

                    <Col xs={4}>
                      <div className="border rounded py-2 px-1 h-100">
                        <small className="text-muted d-block">
                          {t('utilization_rate')}
                        </small>
                        <div
                          className="fw-semibold"
                          style={{ color: 'var(--dt-accent)' }}
                        >
                          {utilRate}%
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Product Detail */}
                  {production.ppc_product_detail && (
                    <div
                      className="rounded px-3 py-2"
                      style={{
                        background: 'var(--dt-accent-05)',
                      }}
                    >
                      <small className="text-muted fw-semibold d-block mb-1">
                        {t('product_detail')}
                      </small>
                      <div className="small text-dark">
                        {production.ppc_product_detail}
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  {production.ppc_remark && (
                    <div
                      className="rounded px-3 py-2 mt-2"
                      style={{
                        background: 'var(--dt-accent-05)',
                      }}
                    >
                      <small
                        className="fw-semibold d-block mb-1"
                        style={{ color: 'var(--dt-accent)' }}
                      >
                        {t('remarks')}
                      </small>
                      <div className="small text-dark">
                        {production.ppc_remark}
                      </div>
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

export default memo(ProductionCapacityTab);
