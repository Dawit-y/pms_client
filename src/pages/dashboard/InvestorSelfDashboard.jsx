import {
  createElement,
  lazy,
  Suspense,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Badge, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaProjectDiagram,
  FaUsers,
  FaUserTie,
  FaHardHat,
  FaCertificate,
  FaIndustry,
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaExclamationCircle,
  FaLeaf,
  FaEye,
} from 'react-icons/fa';
import { useNavigate } from 'react-router';

import TableContainer from '../../components/Common/TableContainer';
import { useAuth } from '../../hooks/useAuth';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useFetchLetterReports } from '../../queries/letter_report_query';
import { useLookups } from '../../queries/lookups_query';
import { useFetchProjects } from '../../queries/project_query';
import { LOOKUP_TYPE_IDS } from '../../utils/constants/lookUpTypes';
import LetterDetailModal from '../letters/LetterDetailModal';
import {
  formatCompact,
  formatCurrency,
} from '../project/projectAnalyticsUtils';

/* ─── SCSS Derived Theme ─────────────────────────────────────────────── */
const getCssVar = (name, fallback) => {
  try {
    if (typeof window === 'undefined' || !window.getComputedStyle)
      return fallback;
    const val = getComputedStyle(document.documentElement).getPropertyValue(
      name
    );
    return (val || '').trim() || fallback;
  } catch {
    return fallback;
  }
};

const THEME = {
  get primary() {
    return getCssVar('--bs-primary', '#0c5c35');
  },
  get success() {
    return getCssVar('--bs-success', getCssVar('--bs-primary', '#0c5c35'));
  },
  get info() {
    return getCssVar('--bs-info', '#50a5f1');
  },
  get warning() {
    return getCssVar('--bs-warning', '#f1b44c');
  },
  get danger() {
    return getCssVar('--bs-danger', '#f46a6a');
  },
  get indigo() {
    return getCssVar('--bs-indigo', '#564ab1');
  },
  get dark() {
    return getCssVar('--bs-dark', '#343a40');
  },
  get muted() {
    return getCssVar('--bs-secondary', '#74788d');
  },
  get mutedBg() {
    return getCssVar('--bs-gray-100', '#f8f9fa');
  },
  get textDark() {
    return getCssVar('--bs-body-color', '#495057');
  },
  get bg() {
    return getCssVar('--bs-white', '#ffffff');
  },
  get border() {
    return getCssVar('--bs-border-color', '#eff2f7');
  },
};

const Plot = lazy(() => import('react-plotly.js'));

/* ─── Utilities ──────────────────────────────────────────────────────── */
const getGreeting = (t) => {
  const h = new Date().getHours();
  if (h < 12) return t('greeting_morning');
  if (h < 17) return t('greeting_afternoon');
  return t('greeting_evening');
};

const CHART_COLORS = () => [
  THEME.primary,
  THEME.indigo,
  THEME.info,
  THEME.warning,
  THEME.danger,
  THEME.muted,
];

const alpha = (color, a) => {
  if (!color) return `rgba(0,0,0,${a})`;
  const c = color.trim();
  const rgbMatch = c.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map((p) => p.trim());
    return `rgba(${parts[0]},${parts[1] || 0},${parts[2] || 0},${a})`;
  }
  const hexMatch = c.match(/^#([0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const v = hexMatch[1];
    return `rgba(${parseInt(v.slice(0, 2), 16)},${parseInt(v.slice(2, 4), 16)},${parseInt(v.slice(4, 6), 16)},${a})`;
  }
  return c;
};

/* ─── KPI Card ───────────────────────────────────────────────────────── */
const KpiCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color,
  isLoading,
  onClick,
}) => (
  <Card
    className="border-0 h-100"
    style={{
      borderRadius: '16px',
      background: THEME.bg,
      border: `1px solid ${THEME.border}`,
      boxShadow: `0 2px 14px ${alpha(THEME.dark, 0.05)}`,
      transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      cursor: onClick ? 'pointer' : 'default',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 10px 30px ${alpha(color, 0.2)}`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = `0 2px 14px ${alpha(THEME.dark, 0.05)}`;
    }}
    onClick={onClick}
  >
    <Card.Body style={{ padding: '1.2rem 1.35rem' }}>
      <div className="d-flex align-items-start justify-content-between">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.68rem',
              color: THEME.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              fontWeight: 700,
              marginBottom: '0.55rem',
            }}
          >
            {label}
          </div>
          {isLoading ? (
            <Spinner
              size="sm"
              animation="border"
              style={{ color, marginTop: 4 }}
            />
          ) : (
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: THEME.textDark,
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {value}
            </div>
          )}
          {sub && !isLoading && (
            <div
              style={{
                fontSize: '0.7rem',
                color,
                fontWeight: 600,
                marginTop: '0.45rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {sub}
            </div>
          )}
        </div>
        {/* Icon — right side with gradient tint */}
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.07)} 100%)`,
            color,
            flexShrink: 0,
            marginLeft: '0.75rem',
          }}
        >
          {createElement(Icon, { size: 21 })}
        </div>
      </div>
    </Card.Body>
  </Card>
);
/* ─── Status Badge ───────────────────────────────────────────────────── */
const STATUS_COLORS = {
  186: { bg: alpha(THEME.success, 0.12), text: THEME.success, label: 'Active' },
  193: {
    bg: alpha(THEME.success, 0.12),
    text: THEME.success,
    label: 'Operational',
  },
  192: { bg: alpha(THEME.info, 0.12), text: THEME.info, label: 'In Progress' },
  184: {
    bg: alpha(THEME.warning, 0.12),
    text: THEME.warning,
    label: 'Pending',
  },
  183: { bg: alpha(THEME.primary, 0.12), text: THEME.primary, label: 'New' },
  182: { bg: alpha(THEME.info, 0.12), text: THEME.info, label: 'Processing' },
  194: { bg: alpha(THEME.danger, 0.12), text: THEME.danger, label: 'Inactive' },
  1: { bg: alpha(THEME.warning, 0.12), text: THEME.warning, label: 'Draft' },
  default: { bg: alpha(THEME.info, 0.12), text: THEME.info, label: 'Unknown' },
};

function StatusBadge({ statusId, label }) {
  const s = STATUS_COLORS[statusId] || STATUS_COLORS.default;
  return (
    <Badge
      bg="none"
      style={{
        background: s.bg,
        color: s.text,
        fontSize: '0.63rem',
        fontWeight: 700,
        borderRadius: '20px',
        padding: '3px 10px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {label || s.label}
    </Badge>
  );
}

/* ─── Project Card ───────────────────────────────────────────────────── */
function ProjectCard({ project, getLookupLabel, onClick }) {
  const { t } = useTranslation();
  const statusId = project.prj_status;
  const statusLabel = getLookupLabel(LOOKUP_TYPE_IDS.PROJECT_STATUS, statusId);
  const industryScale = getLookupLabel(
    LOOKUP_TYPE_IDS.INDUSTRY_SCALE,
    project.prj_industry_scale_id
  );

  const totalEmployees =
    (parseInt(project.pjc_permanent_num) || 0) +
    (parseInt(project.pjc_contract_num) || 0);

  const capital = parseFloat(project.prj_capital_amt) || 0;
  const landSize = parseFloat(project.prj_land_size) || 0;
  const capacityPercent = parseFloat(project.ppc_planned_capacity_percent) || 0;
  const hasLicense = project.prj_has_license === 1 || project.prj_license_num;
  const hasGeoLocation = project.prj_geo_location;

  const endDate = project.prj_agreement_end_date
    ? new Date(project.prj_agreement_end_date)
    : null;
  const daysRemaining = endDate
    ? Math.ceil((endDate - new Date()) / 86400000)
    : null;

  return (
    <Card
      className="border-0 h-100"
      style={{
        borderRadius: '16px',
        border: `1px solid ${THEME.border}`,
        boxShadow: `0 2px 10px ${alpha(THEME.dark, 0.04)}`,
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 14px 34px ${alpha(THEME.primary, 0.14)}`;
        e.currentTarget.style.borderColor = alpha(THEME.primary, 0.35);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 10px ${alpha(THEME.dark, 0.04)}`;
        e.currentTarget.style.borderColor = THEME.border;
      }}
      onClick={() => onClick(project.prj_id)}
    >
      <Card.Body style={{ padding: '1.1rem 1.2rem' }}>
        {/* ── Header ── */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div style={{ flex: 1, paddingRight: '0.5rem', minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: THEME.textDark,
                lineHeight: 1.3,
                marginBottom: '3px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {project.prj_file_number || `Project #${project.prj_id}`}
            </div>
            {industryScale && (
              <div
                style={{
                  fontSize: '0.7rem',
                  color: THEME.muted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaIndustry size={9} />
                {industryScale}
              </div>
            )}
          </div>
          <StatusBadge statusId={statusId} label={statusLabel} />
        </div>

        {/* ── 2×2 Metric Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.45rem',
            marginBottom: '0.8rem',
          }}
        >
          {[
            {
              label: t('metric_capital'),
              value: capital > 0 ? formatCompact(capital) : '—',
              color: THEME.success,
            },
            {
              label: t('metric_land_size'),
              value: landSize > 0 ? `${landSize} ha` : '—',
              color: THEME.warning,
            },
            {
              label: t('metric_employees'),
              value: totalEmployees > 0 ? totalEmployees.toLocaleString() : '—',
              color: THEME.info,
            },
            {
              label: t('metric_agreement'),
              value: project.prj_agreement_date
                ? new Date(project.prj_agreement_date).toLocaleDateString(
                    undefined,
                    { month: 'short', year: 'numeric' }
                  )
                : '—',
              color: THEME.indigo,
            },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                background: THEME.mutedBg,
                borderRadius: '8px',
                padding: '0.45rem 0.6rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.58rem',
                  color: THEME.muted,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '2px',
                }}
              >
                {m.label}
              </div>
              <div
                style={{ fontSize: '0.83rem', fontWeight: 700, color: m.color }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Capacity bar ── */}
        {capacityPercent > 0 && (
          <div style={{ marginBottom: '0.8rem' }}>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginBottom: '4px' }}
            >
              <span
                style={{
                  fontSize: '0.67rem',
                  color: THEME.muted,
                  fontWeight: 600,
                }}
              >
                {t('capacity')}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color:
                    capacityPercent >= 80
                      ? THEME.success
                      : capacityPercent >= 50
                        ? THEME.warning
                        : THEME.info,
                }}
              >
                {capacityPercent}%
              </span>
            </div>
            <div
              style={{
                height: '5px',
                borderRadius: '3px',
                background: THEME.border,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${capacityPercent}%`,
                  borderRadius: '3px',
                  background:
                    capacityPercent >= 80
                      ? THEME.success
                      : capacityPercent >= 50
                        ? THEME.warning
                        : THEME.info,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* ── Agreement expiry ── */}
        {daysRemaining !== null && (
          <div
            style={{
              fontSize: '0.67rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color:
                daysRemaining > 30
                  ? THEME.success
                  : daysRemaining > 0
                    ? THEME.warning
                    : THEME.danger,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'currentColor',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            {daysRemaining > 0
              ? `${daysRemaining} ${t('days_remaining')}`
              : t('agreement_expired')}
          </div>
        )}

        {/* ── Product detail ── */}
        {project.ppc_product_detail && (
          <div
            style={{
              fontSize: '0.7rem',
              color: THEME.textDark,
              marginBottom: '0.8rem',
              padding: '0.4rem 0.6rem',
              background: alpha(THEME.success, 0.06),
              border: `1px solid ${alpha(THEME.success, 0.12)}`,
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaLeaf size={9} color={THEME.success} style={{ flexShrink: 0 }} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {project.ppc_product_detail}
            </span>
          </div>
        )}

        {/* ── Footer: tags + button ── */}
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex gap-1 flex-wrap">
            {hasLicense && (
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '20px',
                  background: alpha(THEME.success, 0.1),
                  color: THEME.success,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <FaCheckCircle size={7} /> {t('licensed')}
              </span>
            )}
            {hasGeoLocation && (
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '20px',
                  background: alpha(THEME.info, 0.1),
                  color: THEME.info,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <FaMapMarkerAlt size={7} /> {t('mapped')}
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick(project.prj_id);
            }}
            aria-label={
              t('view_project_details') ||
              `View details for ${project.prj_file_number || project.prj_id}`
            }
            style={{
              background: THEME.primary,
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '0.33rem 0.8rem',
              border: 'none',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {t('details') || 'Details'} <FaArrowRight size={8} />
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}

function ProjectsTable({ projects, getLookupLabel, onView }) {
  const { t } = useTranslation();
  return (
    <div style={{ overflowX: 'auto' }}>
      <Table hover responsive className="mb-0" style={{ minWidth: 720 }}>
        <thead>
          <tr>
            <th>{t('prj_file_number') || 'File #'}</th>
            <th>{t('status') || 'Status'}</th>
            <th>{t('metric_capital') || 'Capital'}</th>
            <th>{`${t('metric_land_size') || 'Land'} (ha)`}</th>
            <th>{t('metric_employees') || 'Employees'}</th>
            <th>{t('metric_agreement') || 'Agreement'}</th>
            <th style={{ width: 90 }} />
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const status =
              getLookupLabel(LOOKUP_TYPE_IDS.PROJECT_STATUS, p.prj_status) ||
              '';
            const capital = parseFloat(p.prj_capital_amt) || 0;
            const land = parseFloat(p.prj_land_size) || 0;
            const employees =
              (parseInt(p.pjc_permanent_num) || 0) +
              (parseInt(p.pjc_contract_num) || 0);
            return (
              <tr key={p.prj_id}>
                <td style={{ verticalAlign: 'middle' }}>
                  {p.prj_file_number || `#${p.prj_id}`}
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <StatusBadge statusId={p.prj_status} label={status} />
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  {capital > 0 ? formatCompact(capital) : '—'}
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  {land > 0 ? land : '—'}
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  {employees > 0 ? employees.toLocaleString() : '—'}
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  {p.prj_agreement_date
                    ? new Date(p.prj_agreement_date).toLocaleDateString(
                        undefined,
                        { month: 'short', year: 'numeric' }
                      )
                    : '—'}
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: THEME.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                    }}
                    onClick={() => onView(p.prj_id)}
                  >
                    {t('view') || 'View'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────── */

function InvestorSelfDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { getLookupLabel } = useLookups([
    LOOKUP_TYPE_IDS.PROJECT_STATUS,
    LOOKUP_TYPE_IDS.INDUSTRY_SCALE,
    LOOKUP_TYPE_IDS.DECISION_TYPE,
  ]);

  const projectsQuery = useFetchProjects({ page_size: 100 });
  const projectsData = projectsQuery.data;

  /* ── Extract project list (handle both API response shapes) ── */
  const projectList = useMemo(() => {
    if (!projectsData) return [];
    if (Array.isArray(projectsData.results)) return projectsData.results;
    if (Array.isArray(projectsData.json)) return projectsData.json;
    if (Array.isArray(projectsData.data)) return projectsData.data;
    return [];
  }, [projectsData]);

  const totalCapital = useMemo(
    () =>
      projectList.reduce(
        (sum, p) => sum + (parseFloat(p.prj_capital_amt) || 0),
        0
      ),
    [projectList]
  );

  const totalLoanCapital = useMemo(
    () =>
      projectList.reduce(
        (sum, p) => sum + (parseFloat(p.prj_loan_capital_amt) || 0),
        0
      ),
    [projectList]
  );

  const totalOwnCapital = useMemo(
    () =>
      projectList.reduce(
        (sum, p) => sum + (parseFloat(p.prj_own_capital_amt) || 0),
        0
      ),
    [projectList]
  );

  // Employee breakdown
  const totalPermanentEmployees = useMemo(
    () =>
      projectList.reduce(
        (sum, p) => sum + (parseInt(p.pjc_permanent_num) || 0),
        0
      ),
    [projectList]
  );

  const totalContractEmployees = useMemo(
    () =>
      projectList.reduce(
        (sum, p) => sum + (parseInt(p.pjc_contract_num) || 0),
        0
      ),
    [projectList]
  );

  const _totalMaleEmployees = useMemo(
    () =>
      projectList.reduce(
        (sum, p) =>
          sum +
          (parseInt(p.pjc_permanent_male_num) || 0) +
          (parseInt(p.pjc_contract_male_num) || 0),
        0
      ),
    [projectList]
  );

  const _totalFemaleEmployees = useMemo(
    () =>
      projectList.reduce(
        (sum, p) =>
          sum +
          (parseInt(p.pjc_permanent_female_num) || 0) +
          (parseInt(p.pjc_contract_female_num) || 0),
        0
      ),
    [projectList]
  );

  const totalEmployees = totalPermanentEmployees + totalContractEmployees;

  const totalLandSize = useMemo(
    () =>
      projectList.reduce(
        (sum, p) => sum + (parseFloat(p.prj_land_size) || 0),
        0
      ),
    [projectList]
  );

  // License stats
  const licensedProjects = useMemo(
    () =>
      projectList.filter((p) => p.prj_has_license === 1 || p.prj_license_num)
        .length,
    [projectList]
  );

  // Projects with geo location
  const geoTaggedProjects = useMemo(
    () => projectList.filter((p) => p.prj_geo_location).length,
    [projectList]
  );

  // Total projects count
  const totalProjects = projectList.length;

  // Average capacity utilization
  const avgCapacityUtilization = useMemo(() => {
    const projectsWithCapacity = projectList.filter(
      (p) => parseFloat(p.ppc_planned_capacity_percent) > 0
    );
    if (projectsWithCapacity.length === 0) return 0;
    return (
      projectsWithCapacity.reduce(
        (sum, p) => sum + (parseFloat(p.ppc_planned_capacity_percent) || 0),
        0
      ) / projectsWithCapacity.length
    );
  }, [projectList]);

  /* ── Investor name (from project data or user object) ── */
  const investorName = useMemo(
    () => projectList[0]?.inv_name || user?.full_name || t('investor'),
    [projectList, user, t]
  );

  /* ── Chart: Project Status Distribution ── */
  const _statusChart = useMemo(() => {
    if (!projectList.length) return null;
    const counts = {};
    projectList.forEach((p) => {
      const statusId = p.prj_status;
      if (!statusId) return;
      const lbl =
        getLookupLabel(LOOKUP_TYPE_IDS.PROJECT_STATUS, statusId) ||
        `Status ${statusId}`;
      counts[lbl] = (counts[lbl] || 0) + 1;
    });
    const labels = Object.keys(counts);
    if (!labels.length) return null;
    return {
      data: [
        {
          labels,
          values: labels.map((l) => counts[l]),
          type: 'pie',
          hole: 0.65,
          marker: {
            colors: CHART_COLORS().slice(0, labels.length),
            line: { color: THEME.bg, width: 2 },
          },
          textinfo: 'percent',
          textfont: { size: 10 },
          hovertemplate:
            '<b>%{label}</b><br>%{value} project(s) (%{percent})<extra></extra>',
          sort: false,
        },
      ],
      layout: {
        showlegend: true,
        legend: {
          orientation: 'h',
          y: -0.15,
          xanchor: 'center',
          x: 0.5,
          font: { size: 9 },
        },
        margin: { t: 10, b: 50, l: 10, r: 10 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        height: 220,
        annotations: [
          {
            text: `<b>${projectList.length}</b><br><span style="font-size:9px;color:${THEME.muted}">Projects</span>`,
            showarrow: false,
            font: { size: 20, color: THEME.textDark },
          },
        ],
      },
      config: { displayModeBar: false, responsive: true },
    };
  }, [projectList, getLookupLabel]);

  /* ── Chart: Capital Breakdown (Loan vs Own) ── */
  const _capitalChart = useMemo(() => {
    if (totalCapital <= 0) return null;
    const loanPct =
      totalCapital > 0 ? (totalLoanCapital / totalCapital) * 100 : 0;
    const ownPct =
      totalCapital > 0 ? (totalOwnCapital / totalCapital) * 100 : 0;
    return {
      loanPct,
      ownPct,
      data: [
        {
          values: [totalLoanCapital, totalOwnCapital],
          labels: [t('prj_loan_capital_amt'), t('prj_own_capital_amt')],
          type: 'pie',
          hole: 0.7,
          marker: {
            colors: [THEME.primary, THEME.success],
            line: { color: THEME.bg, width: 2 },
          },
          textinfo: 'percent',
          textfont: { size: 10 },
          hovertemplate:
            '<b>%{label}</b><br>ETB %{value:,.0f} (%{percent})<extra></extra>',
          sort: false,
        },
      ],
      layout: {
        showlegend: false,
        margin: { t: 5, b: 5, l: 5, r: 5 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        height: 140,
        annotations: [
          {
            text: `<b>${formatCompact(totalCapital)}</b><br><span style="font-size:8px;color:${THEME.muted}">ETB Total</span>`,
            showarrow: false,
            font: { size: 13, color: THEME.textDark },
          },
        ],
      },
      config: { displayModeBar: false, responsive: true },
    };
  }, [totalCapital, totalLoanCapital, totalOwnCapital, t]);

  // Letters table (replaces project table on the right)
  const [letterFilters, setLetterFilters] = useState({ page: 1, pageSize: 6 });
  const { pagination: lettersPagination, onChange: onLettersPaginationChange } =
    useUrlPagination(letterFilters, setLetterFilters);

  const lettersQuery = useFetchLetterReports(letterFilters, true);
  const lettersData = lettersQuery.data;

  const lettersList = useMemo(() => {
    if (!lettersData) return [];
    if (Array.isArray(lettersData.results)) return lettersData.results;
    if (Array.isArray(lettersData.json)) return lettersData.json;
    if (Array.isArray(lettersData.data)) return lettersData.data;
    return [];
  }, [lettersData]);

  const lettersTotal =
    lettersData?.pagination?.total ||
    lettersData?.total ||
    lettersData?.count ||
    0;
  const lettersPageCount =
    lettersData?.pagination?.total_pages ||
    Math.ceil(lettersTotal / (letterFilters.pageSize || 6));

  const [detailModal, setDetailModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const handleViewLetter = useCallback((ltr) => {
    setSelectedLetter(ltr);
    setDetailModal(true);
  }, []);

  const letterColumns = useMemo(() => {
    return [
      {
        accessorKey: 'ltr_reference_no',
        header: t('reference_no'),
        cell: (info) =>
          info.getValue() || <span className="text-muted">—</span>,
      },
      {
        accessorKey: 'ltr_written_to',
        header: t('written_to'),
        cell: (info) =>
          info.getValue() || <span className="text-muted">—</span>,
      },
      {
        accessorKey: 'ltr_subject',
        header: t('subject'),
        cell: (info) => {
          const v = info.getValue();
          return v ? (
            <span
              className="text-truncate d-inline-block"
              style={{ maxWidth: 220 }}
              title={v}
            >
              {v}
            </span>
          ) : (
            <span className="text-muted">—</span>
          );
        },
      },
      {
        accessorKey: 'ltr_created_time',
        header: t('created_time'),
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <span className="text-muted">—</span>;
          try {
            const date = new Date(value);
            return (
              <span className="text-muted small">
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            );
          } catch {
            return value;
          }
        },
      },
      {
        id: 'actions',
        header: t('actions'),
        size: 80,
        cell: (info) => (
          <button
            className="btn btn-sm btn-light"
            onClick={() => handleViewLetter(info.row.original)}
            title={t('view')}
            aria-label={t('view')}
            style={{ padding: '0.25rem 0.45rem' }}
          >
            <FaEye />
          </button>
        ),
      },
    ];
  }, [t, handleViewLetter]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-content">
      {/* ─── Welcome Banner ─── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0,0,0,0.03)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
          position: 'relative',
        }}
      >
        <Row className="align-items-center justify-content-between">
          <Col md={7}>
            {/* Greeting text */}
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#6B7280',
                marginBottom: '0.5rem',
                letterSpacing: '0.3px',
              }}
            >
              {getGreeting(t)}
            </div>

            {/* Name */}
            <h1
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: '2.2rem',
                color: '#111827',
                lineHeight: 1.2,
              }}
            >
              {investorName}
            </h1>

            {/* Organization & Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '0.75rem',
                color: '#6B7280',
                fontSize: '0.9rem',
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M3 9L12 4L21 9L12 14L3 9Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L3 15L12 20L21 15L15 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t('organization_name')}
              </span>

              <span
                style={{
                  width: '3px',
                  height: '3px',
                  background: '#D1D5DB',
                  borderRadius: '50%',
                }}
              />

              <span
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="8"
                    y1="2"
                    x2="8"
                    y2="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="3"
                    y1="10"
                    x2="21"
                    y2="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {dateStr}
              </span>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            {/* Simple status indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#F9FAFB',
                borderRadius: '40px',
                border: '1px solid #F0F0F0',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '40px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(4px)',
                }}
              >
                Welcome back 👋
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* ─── Primary KPI Cards ─── */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <KpiCard
            icon={FaProjectDiagram}
            label={t('total_projects')}
            value={
              totalProjects != null
                ? Number(totalProjects).toLocaleString()
                : '—'
            }
            sub={`${licensedProjects} ${t('licensed')} · ${geoTaggedProjects} ${t('geo_tagged')}`}
            color={THEME.primary}
            isLoading={projectsQuery.isLoading}
            onClick={() => navigate('/project')}
          />
        </Col>
        <Col xs={6} xl={3}>
          <KpiCard
            icon={FaMoneyBillWave}
            label={t('total_registered_capital')}
            value={projectsQuery.isLoading ? '—' : formatCompact(totalCapital)}
            sub={
              !projectsQuery.isLoading && totalCapital > 0
                ? formatCurrency(totalCapital)
                : undefined
            }
            color={THEME.success}
            isLoading={projectsQuery.isLoading}
          />
        </Col>
        <Col xs={6} xl={3}>
          <KpiCard
            icon={FaUsers}
            label={t('total_employees')}
            value={
              projectsQuery.isLoading ? '—' : totalEmployees.toLocaleString()
            }
            sub={
              !projectsQuery.isLoading && totalEmployees > 0
                ? `${totalPermanentEmployees.toLocaleString()} ${t('permanent')} · ${totalContractEmployees.toLocaleString()} ${t('contract')}`
                : undefined
            }
            color={THEME.info}
            isLoading={projectsQuery.isLoading}
          />
        </Col>
        <Col xs={6} xl={3}>
          <KpiCard
            icon={FaMapMarkerAlt}
            label={t('total_land_size')}
            value={
              projectsQuery.isLoading
                ? '—'
                : totalLandSize > 0
                  ? `${totalLandSize.toLocaleString(undefined, { maximumFractionDigits: 1 })} ha`
                  : '—'
            }
            sub={
              avgCapacityUtilization > 0
                ? `${t('avg')} ${avgCapacityUtilization.toFixed(1)}% ${t('capacity')}`
                : undefined
            }
            color={THEME.warning}
            isLoading={projectsQuery.isLoading}
          />
        </Col>
      </Row>

      {/* ─── Insights Strip ─── */}
      <Card
        className="border-0 mb-4"
        style={{
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          boxShadow: `0 2px 14px ${alpha(THEME.dark, 0.04)}`,
          overflow: 'hidden',
        }}
      >
        <Card.Body style={{ padding: 0 }}>
          <Row className="g-0">
            {[
              {
                icon: FaCertificate,
                label: t('licensed_projects'),
                value: projectsQuery.isLoading ? '…' : String(licensedProjects),
                sub: `${totalProjects > 0 ? ((licensedProjects / totalProjects) * 100).toFixed(0) : 0}% ${t('of_total')}`,
                color: THEME.success,
              },
              {
                icon: FaHardHat,
                label: t('contract_workers'),
                value: projectsQuery.isLoading
                  ? '…'
                  : totalContractEmployees.toLocaleString(),
                sub: `${totalEmployees > 0 ? ((totalContractEmployees / totalEmployees) * 100).toFixed(0) : 0}% ${t('of_workforce')}`,
                color: THEME.warning,
              },
              {
                icon: FaUserTie,
                label: t('permanent_staff'),
                value: projectsQuery.isLoading
                  ? '…'
                  : totalPermanentEmployees.toLocaleString(),
                sub: `${totalEmployees > 0 ? ((totalPermanentEmployees / totalEmployees) * 100).toFixed(0) : 0}% ${t('of_workforce')}`,
                color: THEME.info,
              },
              {
                icon: FaChartLine,
                label: t('avg_capacity'),
                value: projectsQuery.isLoading
                  ? '…'
                  : `${avgCapacityUtilization.toFixed(1)}%`,
                sub: t('across_all_projects'),
                color: THEME.primary,
              },
            ].map((item, idx) => (
              <Col key={item.label} xs={6} md={3}>
                <div
                  style={{
                    padding: '1.25rem 1.4rem',
                    borderRight: idx < 3 ? `1px solid ${THEME.border}` : 'none',
                    height: '100%',
                  }}
                >
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{ marginBottom: '0.6rem' }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '9px',
                        background: alpha(item.color, 0.1),
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {createElement(item.icon, { size: 14 })}
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: THEME.muted,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: THEME.textDark,
                      lineHeight: 1,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: item.color,
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {item.sub}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* ─── Projects Grid ─── */}
      <Card
        className="border-0"
        style={{
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          marginBottom: '1.5rem',
          boxShadow: `0 2px 14px ${alpha(THEME.dark, 0.04)}`,
          overflow: 'hidden',
        }}
      >
        {/* Card header bar */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: `1px solid ${THEME.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: THEME.bg,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: alpha(THEME.primary, 0.1),
                color: THEME.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaBuilding size={16} />
            </div>
            <div>
              <h5
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: THEME.textDark,
                }}
              >
                {t('my_projects')}
              </h5>
              <div style={{ fontSize: '0.72rem', color: THEME.muted }}>
                {totalProjects} {totalProjects === 1 ? 'project' : 'projects'}{' '}
                registered
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm"
            aria-label={t('view_all_projects') || 'View all projects'}
            style={{
              background: THEME.primary,
              color: '#fff',
              borderRadius: '9px',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.45rem 1.1rem',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={() => navigate('/project')}
          >
            {t('view_all') || 'View All'} <FaArrowRight size={11} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {projectsQuery.isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner style={{ color: THEME.primary }} />
            </div>
          ) : projectList.length ? (
            <Row>
              <Col md={5} className="pe-3">
                <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                  {projectList.map((project) => (
                    <div key={project.prj_id} style={{ width: '100%' }}>
                      <ProjectCard
                        project={project}
                        getLookupLabel={getLookupLabel}
                        onClick={(id) => navigate(`/project/${id}/overview`)}
                      />
                    </div>
                  ))}
                </div>
              </Col>

              <Col md={7} className="ps-3">
                <div
                  style={{
                    background: THEME.bg,
                    borderRadius: 12,
                    padding: '0.8rem',
                    border: `1px solid ${THEME.border}`,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      marginBottom: 10,
                      fontWeight: 700,
                      color: THEME.textDark,
                    }}
                  >
                    {t('letters')}
                  </h6>
                  <TableContainer
                    columns={letterColumns}
                    data={lettersList}
                    isLoading={lettersQuery.isLoading}
                    isGlobalFilter={false}
                    isAddButton={false}
                    isCustomPageSize={false}
                    showToolbar={false}
                    isPagination={true}
                    tableName={t('letters')}
                    paginationState={lettersPagination}
                    isServerSidePagination={true}
                    onPaginationChange={onLettersPaginationChange}
                    totalRows={lettersTotal}
                    pageCount={lettersPageCount}
                    refetch={lettersQuery.refetch}
                    isFetching={lettersQuery.isFetching}
                  />
                  <LetterDetailModal
                    isOpen={detailModal}
                    toggle={() => setDetailModal(false)}
                    letter={selectedLetter}
                  />
                </div>
              </Col>
            </Row>
          ) : (
            <EmptyState
              icon={FaBuilding}
              message={t('no_projects_found') || 'No projects found'}
              height={160}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

export default InvestorSelfDashboard;
