import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaColumns, FaEye, FaEyeSlash, FaSearch } from 'react-icons/fa';

import './ReportTable.css';

const DEFAULT_COLUMN_WIDTH = 160;
const MIN_COLUMN_WIDTH = 80;

const pickLabel = (col, lang) =>
  (lang === 'am' && col.label_am) ||
  (lang === 'or' && col.label_or) ||
  col.label_en ||
  col.key;

/**
 * Generic, server-driven table for API-defined reports.
 *
 * Props:
 *   data:        array of row dicts (keys match columns[].key)
 *   columns:     array of column specs from the API definition
 *                ({ key, label_en, label_am, label_or, pdf_align })
 *   tableName:   string label for the table (used in empty state)
 *   pagination:  { pageIndex, pageSize }
 *   onPageChange(p): updates pagination
 *   totalRows / pageCount: from the server response
 */
const ReportTable = ({
  data = [],
  columns = [],
  tableName,
  pagination,
  onPageChange,
  totalRows = 0,
  pageCount = 0,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [columnWidths, setColumnWidths] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tableRef = useRef(null);
  const headerRowRef = useRef(null);

  const [resize, setResize] = useState({
    active: false,
    column: null,
    startX: 0,
    startWidth: 0,
  });

  useEffect(() => {
    const widths = {};
    columns.forEach((col) => {
      widths[col.key] = DEFAULT_COLUMN_WIDTH;
    });
    setColumnWidths(widths);
    setHiddenColumns([]);
  }, [columns]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const v = row[col.key];
        return v != null && v.toString().toLowerCase().includes(lower);
      })
    );
  }, [data, columns, searchTerm]);

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns.includes(col.key)),
    [columns, hiddenColumns]
  );

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const formatCell = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-ET').format(value);
    }
    if (typeof value === 'boolean') {
      return value ? t('yes') : t('no');
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };

  const alignFor = (col) => {
    const a = (col.pdf_align || 'LEFT').toUpperCase();
    if (a === 'RIGHT') return 'right';
    if (a === 'CENTER') return 'center';
    return 'left';
  };

  // ── Column resize ──
  const startResizing = (key, e) => {
    const cells = headerRowRef.current?.querySelectorAll('th') || [];
    let currentWidth = DEFAULT_COLUMN_WIDTH;
    cells.forEach((c) => {
      if (c.dataset.column === key) currentWidth = c.offsetWidth;
    });
    setResize({
      active: true,
      column: key,
      startX: e.clientX,
      startWidth: currentWidth,
    });
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!resize.active || !resize.column) return;
      const width = Math.max(
        MIN_COLUMN_WIDTH,
        resize.startWidth + (e.clientX - resize.startX)
      );
      setColumnWidths((prev) => ({ ...prev, [resize.column]: width }));
    },
    [resize]
  );

  const onMouseUp = useCallback(() => {
    if (resize.active) {
      setResize({ active: false, column: null, startX: 0, startWidth: 0 });
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [resize]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── Pagination helpers (1-indexed display) ──
  const currentPage = (pagination?.pageIndex ?? 0) + 1;
  const pageSize = pagination?.pageSize ?? 10;
  const goToPage = (page) => {
    if (!onPageChange) return;
    const target = Math.max(1, Math.min(page, Math.max(pageCount, 1)));
    onPageChange({ pageIndex: target - 1, pageSize });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    if (pageCount <= maxVisible) {
      for (let i = 1; i <= pageCount; i++) {
        items.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => goToPage(i)}>
              {i}
            </button>
          </li>
        );
      }
    } else {
      let start;
      let end;
      if (currentPage <= Math.ceil(maxVisible / 2)) {
        start = 1;
        end = maxVisible;
      } else if (currentPage + Math.floor(maxVisible / 2) >= pageCount) {
        start = pageCount - maxVisible + 1;
        end = pageCount;
      } else {
        start = currentPage - Math.floor(maxVisible / 2);
        end = currentPage + Math.floor(maxVisible / 2);
      }
      if (start > 1) {
        items.push(
          <li key="first" className="page-item">
            <button className="page-link" onClick={() => goToPage(1)}>
              1
            </button>
          </li>
        );
        if (start > 2) {
          items.push(
            <li key="ls" className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          );
        }
      }
      for (let i = start; i <= end; i++) {
        items.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => goToPage(i)}>
              {i}
            </button>
          </li>
        );
      }
      if (end < pageCount) {
        if (end < pageCount - 1) {
          items.push(
            <li key="le" className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          );
        }
        items.push(
          <li key="last" className="page-item">
            <button className="page-link" onClick={() => goToPage(pageCount)}>
              {pageCount}
            </button>
          </li>
        );
      }
    }
    return items;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Controls */}
      <Card className="mb-3">
        <CardBody className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-2">
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Form.Control
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '35px' }}
            />
            <FaSearch className="search-icon" />
          </div>

          <Dropdown
            show={dropdownOpen}
            onToggle={(open) => setDropdownOpen(open)}
          >
            <DropdownToggle as={Button} variant="outline-primary" size="sm">
              <FaColumns className="me-1" />
              {t('columns')}
            </DropdownToggle>
            <DropdownMenu align="end" className="columns-dropdown-menu">
              <DropdownItem header>{t('toggle_columns')}</DropdownItem>
              {columns.map((col) => (
                <DropdownItem
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{pickLabel(col, lang)}</span>
                  {hiddenColumns.includes(col.key) ? <FaEyeSlash /> : <FaEye />}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </CardBody>
      </Card>

      {/* Table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          ref={tableRef}
          className="table rpt-table"
          style={{ width: '100%', minWidth: '900px' }}
        >
          <thead>
            <tr ref={headerRowRef}>
              <th style={{ width: 50, minWidth: 50, textAlign: 'center' }}>
                {t('SN')}
              </th>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  data-column={col.key}
                  style={{
                    minWidth: columnWidths[col.key] || DEFAULT_COLUMN_WIDTH,
                    width: columnWidths[col.key] || DEFAULT_COLUMN_WIDTH,
                    position: 'relative',
                    textAlign: alignFor(col),
                  }}
                >
                  {pickLabel(col, lang)}
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => startResizing(col.key, e)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => {
                const sn = (pagination?.pageIndex ?? 0) * pageSize + index + 1;
                return (
                  <tr key={row.id ?? row.uuid ?? index}>
                    <td style={{ textAlign: 'center', width: 50 }}>{sn}</td>
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        data-column={col.key}
                        style={{ textAlign: alignFor(col) }}
                      >
                        {formatCell(row[col.key])}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + 1}
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6c757d',
                  }}
                >
                  {searchTerm
                    ? t('no_items_match_search')
                    : t('no_data_available_table')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRows > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <h6 className="text-muted mb-0">
            {t('Showing')} {filteredData.length} {t('of')}{' '}
            {totalRows.toLocaleString()} {t('rows')}
            {tableName ? <span className="ms-2">— {tableName}</span> : null}
          </h6>

          <div className="d-flex align-items-center">
            <nav>
              <ul className="pagination mb-0" style={{ fontSize: '0.875rem' }}>
                <li
                  className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lsaquo;
                  </button>
                </li>
                {renderPaginationItems()}
                <li
                  className={`page-item ${
                    currentPage === pageCount ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                  >
                    &rsaquo;
                  </button>
                </li>
                <li
                  className={`page-item ${
                    currentPage === pageCount ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(pageCount)}
                    disabled={currentPage === pageCount}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>

            <div className="ms-3 position-relative" style={{ width: '80px' }}>
              <select
                className="form-control form-control-sm"
                value={pageSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  if (onPageChange) {
                    onPageChange({ pageIndex: 0, pageSize: size });
                  }
                }}
                style={{ appearance: 'none', paddingRight: '25px' }}
              >
                {[10, 25, 50, 100].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  pointerEvents: 'none',
                  transform: 'translateY(-50%)',
                }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
