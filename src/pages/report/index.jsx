import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaDownload,
  FaFileExcel,
  FaFilePdf,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import TreeForLists from '../../components/Common/TreeForLists';
import {
  useCancelReportJob,
  useExportReport,
  useFetchReportData,
  useFetchReportJob,
  useFetchReports,
} from '../../queries/reports_query';
import ReportTable from './ReportTable';

// Filter keys we'll auto-populate from the tree selection if the report's
// filter schema exposes them. Keys are matched in priority order so the most
// specific selected level wins.
const TREE_FILTER_KEYS = ['woreda', 'zone', 'region', 'location'];
const TERMINAL_STATUSES = new Set(['success', 'failed', 'cancelled']);

const pickReportLabel = (def, lang) =>
  (lang === 'am' && def.name_am) ||
  (lang === 'or' && def.name_or) ||
  def.name_en ||
  def.code;

const Report = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  useEffect(() => {
    document.title = t('reports');
  }, [t]);

  // ── Report list ──────────────────────────────────────────────────────
  const {
    data: reportsResp,
    isLoading: isReportsLoading,
    isError: isReportsError,
    error: reportsError,
    refetch: refetchReports,
  } = useFetchReports();

  const reports = useMemo(() => {
    if (!reportsResp?.data) return [];
    return reportsResp.data || [];
  }, [reportsResp]);

  const [selectedCode, setSelectedCode] = useState('');
  const currentReport = useMemo(
    () => reports.find((r) => r.code === selectedCode) || null,
    [reports, selectedCode]
  );

  // ── Tree selection (local; merged into filters on Search) ────────────
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tree, setTree] = useState({
    regionId: null,
    zoneId: null,
    woredaId: null,
    include: 1,
  });

  const handleNodeSelect = (node) => {
    if (!node || !node.level) {
      setTree({
        regionId: null,
        zoneId: null,
        woredaId: null,
        include: tree.include,
      });
      return;
    }
    if (node.level === 'region') {
      setTree({
        regionId: node.id,
        zoneId: null,
        woredaId: null,
        include: tree.include,
      });
    } else if (node.level === 'zone') {
      setTree((prev) => ({ ...prev, zoneId: node.id, woredaId: null }));
    } else if (node.level === 'woreda') {
      setTree((prev) => ({ ...prev, woredaId: node.id }));
    }
  };
  const setInclude = (val) =>
    setTree((prev) => ({ ...prev, include: val ? 1 : 0 }));

  // ── Local filter form state (resets when report changes) ─────────────
  const [filterDraft, setFilterDraft] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  // We trigger /data/ only AFTER the user clicks Search at least once.
  const [hasSearched, setHasSearched] = useState(false);

  const handleSelectReport = (code) => {
    setSelectedCode(code);
    setFilterDraft({});
    setAppliedFilters({});
    setPageIndex(0);
    setHasSearched(false);
  };

  const treeFilterPatch = useMemo(() => {
    if (!currentReport) return {};
    const schemaKeys = Object.keys(currentReport.filter_schema || {});
    const target = TREE_FILTER_KEYS.find((k) => schemaKeys.includes(k));
    if (!target) return {};
    const value = tree.woredaId || tree.zoneId || tree.regionId;
    return value ? { [target]: value } : {};
  }, [currentReport, tree]);

  const dataParams = useMemo(
    () => ({
      ...appliedFilters,
      ...treeFilterPatch,
      page: pageIndex + 1,
      per_page: pageSize,
    }),
    [appliedFilters, treeFilterPatch, pageIndex, pageSize]
  );

  const {
    data: tableResp,
    isFetching: isDataLoading,
    isError: isDataError,
    error: dataError,
    refetch: refetchData,
  } = useFetchReportData(
    selectedCode,
    dataParams,
    !!selectedCode && hasSearched
  );

  const tableRows = tableResp?.data ?? [];
  const totalRows = tableResp?.meta?.count ?? 0;
  const pageCount = tableResp?.meta?.pages ?? 0;

  // ── Export mutation + job polling ────────────────────────────────────
  const exportMutation = useExportReport();
  const cancelMutation = useCancelReportJob();
  const [activeJobUuid, setActiveJobUuid] = useState(null);

  const { data: jobResp } = useFetchReportJob(activeJobUuid, !!activeJobUuid);
  const activeJob = jobResp?.data ?? null;
  const isJobTerminal = activeJob && TERMINAL_STATUSES.has(activeJob.status);
  const activeJobReport = useMemo(
    () =>
      activeJob ? reports.find((r) => r.code === activeJob.report_code) : null,
    [activeJob, reports]
  );

  const handleExport = (format) => {
    if (!currentReport) return;
    const payload = {
      format,
      filters: { ...appliedFilters, ...treeFilterPatch },
      include_summary: false,
    };
    exportMutation.mutate(
      { code: currentReport.code, payload },
      {
        onSuccess: (resp) => {
          const uuid = resp?.data?.uuid;
          if (uuid) setActiveJobUuid(uuid);
        },
      }
    );
  };

  const handleCancelJob = () => {
    if (!activeJobUuid) return;
    cancelMutation.mutate(activeJobUuid, {
      onSettled: () => {
        // keep showing the cancelled state until user dismisses
      },
    });
  };

  const handleDismissJob = () => setActiveJobUuid(null);

  // ── Filter input renderer (driven by filter_schema) ──────────────────
  const handleDraftChange = (key, value) => {
    setFilterDraft((prev) => ({ ...prev, [key]: value }));
  };

  const renderFilterField = (key, spec) => {
    if (TREE_FILTER_KEYS.includes(key)) return null; // tree owns these
    const value = filterDraft[key] ?? '';
    const placeholder = t(key);

    if (spec.choices && spec.choices.length > 0) {
      return (
        <Form.Select
          key={key}
          value={value}
          onChange={(e) => handleDraftChange(key, e.target.value)}
          aria-label={placeholder}
        >
          <option value="">{placeholder}</option>
          {spec.choices.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    if (spec.type === 'boolean') {
      return (
        <Form.Check
          key={key}
          type="checkbox"
          id={`filter-${key}`}
          label={placeholder}
          checked={value === true || value === 'true'}
          onChange={(e) => handleDraftChange(key, e.target.checked)}
        />
      );
    }

    if (spec.type === 'date' || spec.type === 'datetime') {
      return (
        <Form.Control
          key={key}
          type={spec.type === 'datetime' ? 'datetime-local' : 'date'}
          value={value}
          onChange={(e) => handleDraftChange(key, e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      );
    }

    if (
      spec.type === 'integer' ||
      spec.type === 'decimal' ||
      spec.type === 'float'
    ) {
      return (
        <Form.Control
          key={key}
          type="number"
          step={spec.type === 'integer' ? '1' : 'any'}
          value={value}
          onChange={(e) => handleDraftChange(key, e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      );
    }

    return (
      <Form.Control
        key={key}
        type="text"
        value={value}
        onChange={(e) => handleDraftChange(key, e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
    );
  };

  const handleSearch = () => {
    // Strip empty values so we don't send `?foo=` to the API
    const cleaned = Object.fromEntries(
      Object.entries(filterDraft).filter(
        ([, v]) => v !== '' && v !== null && v !== undefined
      )
    );
    setAppliedFilters(cleaned);
    setPageIndex(0);
    setHasSearched(true);
  };

  const handleClear = () => {
    setFilterDraft({});
    setAppliedFilters({});
    setTree({ regionId: null, zoneId: null, woredaId: null, include: 0 });
    setPageIndex(0);
    setHasSearched(false);
  };

  // ── Render ───────────────────────────────────────────────────────────
  if (isReportsError) {
    return (
      <div className="page-content">
        <Breadcrumbs items={[{ label: t('reports'), active: true }]} />
        <FetchErrorHandler error={reportsError} refetch={refetchReports} />
      </div>
    );
  }

  const filterEntries = currentReport
    ? Object.entries(currentReport.filter_schema || {}).filter(
        ([k]) => !TREE_FILTER_KEYS.includes(k)
      )
    : [];

  return (
    <div className="page-content px-0">
      <Breadcrumbs items={[{ label: t('reports'), active: true }]} />

      <div className="w-100 d-flex gap-2">
        {/* Left: location tree */}
        <div
          className="d-flex flex-column gap-2"
          style={{
            flex: isCollapsed ? '0 0 60px' : '0 0 280px',
            minWidth: isCollapsed ? '60px' : '280px',
            transition: 'all 0.3s ease',
          }}
        >
          <Card className="p-0 m-0 shadow-sm border-0 w-100">
            <Card.Body className="p-2">
              <Form.Select
                value={selectedCode}
                onChange={(e) => handleSelectReport(e.target.value)}
                onClick={() => setIsCollapsed(false)}
                aria-label={t('select_report')}
                disabled={isReportsLoading}
              >
                <option value="">
                  {isReportsLoading ? t('loading') : t('select_report')}
                </option>
                {reports.map((r) => (
                  <option key={r.code} value={r.code}>
                    {isCollapsed
                      ? (r.code || '').charAt(0).toUpperCase()
                      : pickReportLabel(r, lang)}
                  </option>
                ))}
              </Form.Select>
            </Card.Body>
          </Card>

          <div className="flex-grow-1 w-100 d-flex flex-row">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setInclude={setInclude}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              activeRegionId={tree.regionId}
              activeZoneId={tree.zoneId}
              activeWoredaId={tree.woredaId}
              include={tree.include}
              widthInPercent={100}
            />
          </div>
        </div>

        {/* Right: filters + table */}
        <div style={{ flex: '1 1 0%', minWidth: 0 }}>
          {!currentReport && (
            <Card>
              <Card.Body className="text-center text-muted py-5">
                {isReportsLoading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <>{t('select_a_report_to_begin')}</>
                )}
              </Card.Body>
            </Card>
          )}

          {currentReport && (
            <>
              <Card className="mb-3 shadow-sm border-0">
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                    <div>
                      <h5 className="mb-0">
                        {pickReportLabel(currentReport, lang)}
                      </h5>
                      {currentReport.description && (
                        <small className="text-muted">
                          {currentReport.description}
                        </small>
                      )}
                    </div>
                    <ButtonGroup>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleExport('xlsx')}
                        disabled={
                          exportMutation.isPending ||
                          (activeJob && !isJobTerminal)
                        }
                      >
                        <FaFileExcel className="me-1" />
                        {t('export_to_excel')}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleExport('pdf')}
                        disabled={
                          exportMutation.isPending ||
                          (activeJob && !isJobTerminal)
                        }
                      >
                        <FaFilePdf className="me-1" />
                        {t('export_to_pdf')}
                      </Button>
                    </ButtonGroup>
                  </div>

                  {filterEntries.length > 0 && (
                    <Row className="g-2 align-items-end">
                      {filterEntries.map(([key, spec]) => (
                        <Col key={key} xs={12} sm={6} md={4} lg={3}>
                          {renderFilterField(key, spec)}
                        </Col>
                      ))}
                      <Col xs="auto" className="ms-auto d-flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSearch}
                        >
                          <FaSearch className="me-1" />
                          {t('search')}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={handleClear}
                        >
                          <FaTimes className="me-1" />
                          {t('clear')}
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {filterEntries.length === 0 && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSearch}
                      >
                        <FaSearch className="me-1" />
                        {t('search')}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleClear}
                      >
                        <FaTimes className="me-1" />
                        {t('clear')}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Active export job panel */}
              {activeJob && (
                <Alert
                  variant={
                    activeJob.status === 'success'
                      ? 'success'
                      : activeJob.status === 'failed'
                        ? 'danger'
                        : activeJob.status === 'cancelled'
                          ? 'warning'
                          : 'info'
                  }
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <Badge bg="secondary">
                      {t(`status_${activeJob.status}`)}
                    </Badge>
                    <span>
                      {activeJob.format?.toUpperCase()} ·{' '}
                      {activeJobReport
                        ? pickReportLabel(activeJobReport, lang)
                        : activeJob.report_code}
                    </span>
                    {!isJobTerminal && (
                      <div style={{ minWidth: 180, flex: 1 }}>
                        <ProgressBar
                          now={activeJob.progress || 0}
                          label={`${activeJob.progress || 0}%`}
                          animated
                          striped
                        />
                      </div>
                    )}
                    {activeJob.status === 'failed' &&
                      activeJob.error_message && (
                        <small className="text-muted">
                          {activeJob.error_message}
                        </small>
                      )}
                  </div>
                  <div className="d-flex gap-2">
                    {activeJob.status === 'success' &&
                      activeJob.download_url && (
                        <a
                          href={activeJob.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-success"
                        >
                          <FaDownload className="me-1" />
                          {t('download')}
                        </a>
                      )}
                    {!isJobTerminal && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleCancelJob}
                        disabled={cancelMutation.isPending}
                      >
                        {t('cancel')}
                      </Button>
                    )}
                    {isJobTerminal && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleDismissJob}
                      >
                        {t('dismiss')}
                      </Button>
                    )}
                  </div>
                </Alert>
              )}

              {/* Table */}
              {!hasSearched && (
                <Card>
                  <Card.Body className="text-center text-muted py-5">
                    {t('apply_filters_to_view_data')}
                  </Card.Body>
                </Card>
              )}

              {hasSearched && isDataError && (
                <FetchErrorHandler error={dataError} refetch={refetchData} />
              )}

              {hasSearched && !isDataError && (
                <Card>
                  <Card.Body style={{ padding: '10px' }}>
                    {isDataLoading && tableRows.length === 0 ? (
                      <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <ReportTable
                        data={tableRows}
                        columns={currentReport.columns || []}
                        tableName={pickReportLabel(currentReport, lang)}
                        pagination={{ pageIndex, pageSize }}
                        onPageChange={(p) => {
                          setPageIndex(p.pageIndex);
                          setPageSize(p.pageSize);
                        }}
                        totalRows={totalRows}
                        pageCount={pageCount}
                      />
                    )}
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
