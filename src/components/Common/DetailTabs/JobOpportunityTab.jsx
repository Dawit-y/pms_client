import React, { memo, useMemo } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaMale,
  FaFemale,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaBriefcase,
  FaFileContract,
  FaCommentDots,
  FaChartPie,
  FaLayerGroup,
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

/* ── Detail Row helper ── */
// eslint-disable-next-line no-unused-vars
const DetailRow = ({ icon: Icon, iconClass, label, value }) => (
  <div className="d-flex align-items-center justify-content-between py-1">
    <span className="d-flex align-items-center gap-2 text-muted small">
      <Icon size={13} className={iconClass} />
      {label}
    </span>
    <span className="fw-semibold text-dark small">{value}</span>
  </div>
);

const JobOpportunityTab = ({ data }) => {
  const { t } = useTranslation();
  const { job_capacity = [] } = data;

  const sortedJobs = useMemo(() => {
    const projectEntry = {
      pjc_id: 'project-entry',
      pjc_date: data.project?.prj_create_time,
      act_activity_type_id: 1, // Project Entry
      pjc_permanent_num: data.project?.pjc_permanent_num,
      pjc_contract_num: data.project?.pjc_contract_num,
      pjc_permanent_male_num: data.project?.pjc_permanent_male_num,
      pjc_permanent_female_num: data.project?.pjc_permanent_female_num,
      pjc_contract_male_num: data.project?.pjc_contract_male_num,
      pjc_contract_female_num: data.project?.pjc_contract_female_num,
      pjc_remark: t('initial_project_entry'),
    };

    return [...job_capacity, projectEntry].sort(
      (a, b) => new Date(b.pjc_date) - new Date(a.pjc_date)
    );
  }, [job_capacity, data.project, t]);

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

  const genderStats = (job) => {
    const permM = job.pjc_permanent_male_num || 0;
    const permF = job.pjc_permanent_female_num || 0;
    const contM = job.pjc_contract_male_num || 0;
    const contF = job.pjc_contract_female_num || 0;

    return {
      male: permM + contM,
      female: permF + contF,
      permM,
      permF,
      contM,
      contF,
      permT: job.pjc_permanent_num || permM + permF,
      contT: job.pjc_contract_num || contM + contF,
    };
  };

  const latestStats = useMemo(
    () => (sortedJobs.length > 0 ? genderStats(sortedJobs[0]) : null),
    [sortedJobs]
  );

  /* ── Empty ── */
  if (sortedJobs.length === 0) {
    return (
      <Card className="border rounded-3">
        <Card.Body className="text-center py-5 px-4">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72 }}
          >
            <FaInfoCircle size={28} className="text-secondary" />
          </div>
          <h5 className="fw-semibold text-dark">
            {t('no_job_opportunity_data')}
          </h5>
          <p className="text-muted small mb-0">
            {t('no_job_opportunity_data_desc')}
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="detail-tab">
      {/* ── Summary Cards ── */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3} className="d-flex">
          <StatCard
            icon={FaUsers}
            label={t('total_historical_records')}
            value={sortedJobs.length}
          />
        </Col>
        <Col sm={6} lg={3} className="d-flex">
          <StatCard
            icon={FaClock}
            label={t('latest_update')}
            value={new Date(sortedJobs[0].pjc_date).toLocaleDateString()}
          />
        </Col>
        <Col sm={6} lg={3} className="d-flex">
          <StatCard
            icon={FaMale}
            label={t('male')}
            value={latestStats?.male?.toLocaleString() ?? 0}
            sub={t('most_recent')}
          />
        </Col>
        <Col sm={6} lg={3} className="d-flex">
          <StatCard
            icon={FaFemale}
            label={t('female')}
            value={latestStats?.female?.toLocaleString() ?? 0}
            sub={t('most_recent')}
          />
        </Col>
      </Row>

      {/* ── Timeline ── */}
      <div className="dt-timeline">
        {sortedJobs.map((job, idx) => {
          const s = genderStats(job);
          const total = s.male + s.female;
          const malePct = total > 0 ? Math.round((s.male / total) * 100) : 0;
          const femalePct =
            total > 0 ? Math.round((s.female / total) * 100) : 0;
          const latest = idx === 0;

          return (
            <div
              key={job.pjc_id}
              className={`dt-timeline-item position-relative mb-4 ${latest ? 'is-latest' : ''}`}
            >
              {/* Dot */}
              <div className="dt-dot">
                <div className="dt-dot-inner" />
              </div>

              <Card
                className={`dt-card border rounded-3 overflow-hidden ${latest ? 'border-success border-opacity-50' : ''}`}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 bg-light border-bottom px-3 py-2">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <span className="d-inline-flex align-items-center gap-1 bg-white border rounded px-2 py-1 fw-medium small text-dark">
                      <FaCalendarAlt
                        size={12}
                        style={{ color: 'var(--dt-accent)' }}
                      />
                      {new Date(job.pjc_date).toLocaleString()}
                    </span>
                    <Badge
                      bg={getActivityColor(job.act_activity_type_id)}
                      className="fw-medium"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {getActivityLabel(job.act_activity_type_id)}
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
                  <div className="d-flex gap-1 flex-wrap">
                    <span
                      className="d-inline-flex align-items-center gap-1 rounded px-2 py-1 fw-medium"
                      style={{
                        fontSize: '0.72rem',
                        background: 'var(--dt-accent-10)',
                        color: 'var(--dt-accent)',
                      }}
                    >
                      <FaBriefcase size={10} />
                      {t('permanent')}: {s.permT.toLocaleString()}
                    </span>
                    <span
                      className="d-inline-flex align-items-center gap-1 rounded px-2 py-1 fw-medium"
                      style={{
                        fontSize: '0.72rem',
                        background: 'var(--dt-accent-08)',
                        color: 'var(--dt-accent)',
                      }}
                    >
                      <FaFileContract size={10} />
                      {t('contract')}: {s.contT.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <Card.Body className="p-3">
                  <Row>
                    {/* Gender Distribution */}
                    <Col md={4} className="border-end">
                      <div className="pe-md-3">
                        <div
                          className="text-muted text-uppercase fw-semibold d-flex align-items-center gap-1 mb-3"
                          style={{
                            fontSize: '0.7rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          <FaChartPie size={11} className="opacity-75" />
                          {t('gender_distribution')}
                        </div>

                        {/* Male */}
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div
                            className="dt-icon male"
                            style={{ width: 36, height: 36 }}
                          >
                            <FaMale size={16} />
                          </div>
                          <div className="flex-grow-1">
                            <div
                              className="text-muted mb-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              {t('male')}
                            </div>
                            <div className="dt-bar-track">
                              <div
                                className="dt-bar-fill male"
                                style={{ width: `${malePct}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-end" style={{ minWidth: 46 }}>
                            <div
                              className="fw-semibold text-dark"
                              style={{ fontSize: '0.95rem' }}
                            >
                              {s.male.toLocaleString()}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: '0.68rem' }}
                            >
                              {malePct}%
                            </div>
                          </div>
                        </div>

                        {/* Female */}
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div
                            className="dt-icon female"
                            style={{ width: 36, height: 36 }}
                          >
                            <FaFemale size={16} />
                          </div>
                          <div className="flex-grow-1">
                            <div
                              className="text-muted mb-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              {t('female')}
                            </div>
                            <div className="dt-bar-track">
                              <div
                                className="dt-bar-fill female"
                                style={{ width: `${femalePct}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-end" style={{ minWidth: 46 }}>
                            <div
                              className="fw-semibold text-dark"
                              style={{ fontSize: '0.95rem' }}
                            >
                              {s.female.toLocaleString()}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: '0.68rem' }}
                            >
                              {femalePct}%
                            </div>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="d-flex align-items-center justify-content-between bg-light border rounded px-2 py-2">
                          <span
                            className="text-muted text-uppercase fw-semibold"
                            style={{
                              fontSize: '0.72rem',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {t('total')}
                          </span>
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: '1.05rem' }}
                          >
                            {total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Col>

                    {/* Breakdown */}
                    <Col md={8}>
                      <div className="ps-md-2">
                        <div
                          className="text-muted text-uppercase fw-semibold d-flex align-items-center gap-1 mb-3"
                          style={{
                            fontSize: '0.7rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          <FaLayerGroup size={11} className="opacity-75" />
                          {t('employment_breakdown')}
                        </div>

                        <Row className="g-3">
                          {/* Permanent */}
                          <Col sm={6}>
                            <div className="dt-detail-block border rounded p-3 h-100">
                              <div
                                className="text-uppercase fw-semibold d-flex align-items-center gap-1 mb-2 pb-2 border-bottom"
                                style={{
                                  fontSize: '0.7rem',
                                  letterSpacing: '0.05em',
                                  color: 'var(--dt-accent)',
                                }}
                              >
                                <FaBriefcase size={11} />
                                {t('permanent_positions')}
                              </div>
                              <DetailRow
                                icon={FaMale}
                                iconClass="text-muted"
                                label={t('male')}
                                value={s.permM.toLocaleString()}
                              />
                              <div className="border-top border-dashed" />
                              <DetailRow
                                icon={FaFemale}
                                iconClass="text-muted"
                                label={t('female')}
                                value={s.permF.toLocaleString()}
                              />
                              <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top border-2">
                                <span className="fw-semibold small text-dark">
                                  {t('total')}
                                </span>
                                <span
                                  className="fw-bold"
                                  style={{
                                    color: 'var(--dt-accent)',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {s.permT.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Col>

                          {/* Contract */}
                          <Col sm={6}>
                            <div className="dt-detail-block border rounded p-3 h-100">
                              <div
                                className="text-uppercase fw-semibold d-flex align-items-center gap-1 mb-2 pb-2 border-bottom"
                                style={{
                                  fontSize: '0.7rem',
                                  letterSpacing: '0.05em',
                                  color: 'var(--dt-accent)',
                                }}
                              >
                                <FaFileContract size={11} />
                                {t('contract_positions')}
                              </div>
                              <DetailRow
                                icon={FaMale}
                                iconClass="text-muted"
                                label={t('male')}
                                value={s.contM.toLocaleString()}
                              />
                              <div className="border-top border-dashed" />
                              <DetailRow
                                icon={FaFemale}
                                iconClass="text-muted"
                                label={t('female')}
                                value={s.contF.toLocaleString()}
                              />
                              <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top border-2">
                                <span className="fw-semibold small text-dark">
                                  {t('total')}
                                </span>
                                <span
                                  className="fw-bold"
                                  style={{
                                    color: 'var(--dt-accent)',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {s.contT.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>

                  {/* Remarks */}
                  {job.pjc_remark && (
                    <div
                      className="mt-3 rounded p-2 px-3"
                      style={{
                        background: 'var(--dt-accent-05)',
                        borderLeft: '3px solid var(--dt-accent)',
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
                      <p className="text-dark small mb-0">{job.pjc_remark}</p>
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

export default memo(JobOpportunityTab);
