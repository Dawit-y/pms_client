import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaAngleLeft,
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import './Pagination.css';

const TablePagination = ({
  table,
  totalRows = 0,
  isServerSidePagination = false,
  paginationState,
}) => {
  const { t } = useTranslation();

  const currentPage = paginationState.pageIndex; // 0-based
  const pageSize = paginationState.pageSize;
  const totalPages = table.getPageCount();

  /* ── Go-to input local state ── */
  const [inputValue, setInputValue] = React.useState(String(currentPage + 1));

  React.useEffect(() => {
    setInputValue(String(currentPage + 1));
  }, [currentPage]);

  const commitGoTo = (raw) => {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      table.setPageIndex(n - 1);
    } else {
      setInputValue(String(currentPage + 1));
    }
  };

  /* ── Row-range label ──────────────────────────────────────────────────── */
  const rowRangeLabel = () => {
    /*
     * For server-side pagination, the 'totalRows' prop holds the real total.
     * Otherwise, fallback to the filtered data length.
     */
    const filteredTotal = isServerSidePagination
      ? totalRows
      : table.getFilteredRowModel().rows.length;

    // Use rowCount for the current page rendering length if available,
    // but in server-side we may need to calculate it manually based on current page bounds
    const pageRows = isServerSidePagination
      ? Math.min(pageSize, filteredTotal - currentPage * pageSize)
      : table.getRowModel().rows.length;

    // No data at all
    if (filteredTotal === 0 && pageRows === 0) return null;

    const start = currentPage * pageSize + 1;
    const end = start + pageRows - 1;

    if (filteredTotal <= pageSize) {
      // Everything fits on one page — just show total
      return (
        <>
          {t('showing') || 'Showing'}{' '}
          <strong>{filteredTotal.toLocaleString()}</strong>{' '}
          {t('entries') || 'entries'}
        </>
      );
    }

    return (
      <>
        {t('showing') || 'Showing'}{' '}
        <strong>
          {start.toLocaleString()}–{end.toLocaleString()}
        </strong>{' '}
        {t('of') || 'of'} <strong>{filteredTotal.toLocaleString()}</strong>{' '}
        {t('entries') || 'entries'}
      </>
    );
  };

  /* ── Page list with smart ellipsis ───────────────────────────────────── */
  const buildPageList = () => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);

    const pages = [];

    // Window: always show 2 siblings on each side of the current page
    const windowStart = Math.max(1, currentPage - 2);
    const windowEnd = Math.min(totalPages - 2, currentPage + 2);

    pages.push(0); // first page always

    if (windowStart > 1) pages.push('ellipsis-start');

    for (let i = windowStart; i <= windowEnd; i++) {
      pages.push(i);
    }

    if (windowEnd < totalPages - 2) pages.push('ellipsis-end');

    pages.push(totalPages - 1); // last page always

    return pages;
  };

  const pageList = buildPageList();

  /* ── Helpers ── */
  const navBtnClass = (disabled) =>
    `tpag-btn${disabled ? ' tpag-btn--disabled' : ''}`;
  const pageBtnClass = (pageIndex) =>
    `tpag-btn${pageIndex === currentPage ? ' tpag-btn--active' : ''}`;

  const activePageStyle = {
    background: 'var(--bs-primary, #0d6efd)',
    borderColor: 'var(--bs-primary, #0d6efd)',
    color: '#fff',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.6rem 0.875rem',
        background: 'var(--bs-tertiary-bg, #f8f9fa)',
        border: '1px solid var(--bs-border-color, #dee2e6)',
        borderRadius: 'var(--bs-border-radius, 0.375rem)',
        marginTop: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      }}
    >
      {/* ── Left: row range info ─────────────────────────────────────── */}
      <div
        style={{
          fontSize: '0.8125rem',
          color: 'var(--bs-secondary-color, #6c757d)',
          fontWeight: 500,
          minWidth: 120,
        }}
      >
        {rowRangeLabel() ??
          (t('no_data_available_table') || 'No data available')}
      </div>

      {/* ── Right: go-to + nav ───────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Total pages badge */}
        {totalPages > 1 && (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--bs-secondary-color, #6c757d)',
              padding: '2px 10px',
              background: 'var(--bs-secondary-bg, #e9ecef)',
              borderRadius: '20px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {totalPages.toLocaleString()} {t('pages') || 'pages'}
          </span>
        )}

        {/* Go-to input */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              color: 'var(--bs-secondary-color, #6c757d)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{t('go_to_page') || 'Go to'}:</span>
            <input
              type="number"
              className="tpag-goto"
              min={1}
              max={totalPages}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={(e) => commitGoTo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitGoTo(e.target.value);
              }}
              style={{
                width: '68px',
                height: '2rem',
                border: '1px solid var(--bs-border-color, #ced4da)',
                borderRadius: 'var(--bs-border-radius, 0.375rem)',
                textAlign: 'center',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--bs-body-color, #343a40)',
                background: 'var(--bs-body-bg, #fff)',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Page nav buttons */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            {/* First */}
            <button
              className={navBtnClass(!table.getCanPreviousPage())}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              data-tooltip={t('first_page') || 'First page'}
              aria-label="First page"
            >
              <FaAngleLeft size={11} />
            </button>

            {/* Prev */}
            <button
              className={navBtnClass(!table.getCanPreviousPage())}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              data-tooltip={t('previous_page') || 'Previous page'}
              aria-label="Previous page"
            >
              <FaChevronLeft size={11} />
            </button>

            {/* Page numbers */}
            {pageList.map((item) => {
              if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                return (
                  <span
                    key={item}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '1.75rem',
                      height: '2rem',
                      fontSize: '0.875rem',
                      color: 'var(--bs-secondary-color, #adb5bd)',
                      letterSpacing: '1px',
                      userSelect: 'none',
                    }}
                  >
                    …
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  className={pageBtnClass(item)}
                  style={item === currentPage ? activePageStyle : {}}
                  onClick={() => table.setPageIndex(item)}
                  aria-label={`Page ${item + 1}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                  data-tooltip={`${t('page') || 'Page'} ${item + 1}`}
                >
                  {(item + 1).toLocaleString()}
                </button>
              );
            })}

            {/* Next */}
            <button
              className={navBtnClass(!table.getCanNextPage())}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              data-tooltip={t('next_page') || 'Next page'}
              aria-label="Next page"
            >
              <FaChevronRight size={11} />
            </button>

            {/* Last */}
            <button
              className={navBtnClass(!table.getCanNextPage())}
              onClick={() => table.setPageIndex(totalPages - 1)}
              disabled={!table.getCanNextPage()}
              data-tooltip={t('last_page') || 'Last page'}
              aria-label="Last page"
            >
              <FaAngleRight size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablePagination;
