import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Card,
  CardBody,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaFileExport,
  FaRedoAlt,
  FaInfoCircle,
  FaColumns,
} from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Switch from 'react-switch';

import ExportToExcel from '../ExportToExcel';
import ExportToPdf from '../ExportToPdf';
import PrintTable from '../PrintTable';
import DebouncedInput from './DebounceInput';
import Filter from './Filter';
import TablePagination from './Pagination';

/* ─────────────────────────────────────────────
   Sticky-column helpers
───────────────────────────────────────────── */
const getLeftOffset = (column, table) => {
  const leftPinned = table.getLeftLeafColumns();
  let offset = 0;
  for (const col of leftPinned) {
    if (col.id === column.id) break;
    offset += col.getSize();
  }
  return offset;
};

const getRightOffset = (column, table) => {
  const rightPinned = [...table.getRightLeafColumns()].reverse();
  let offset = 0;
  for (const col of rightPinned) {
    if (col.id === column.id) break;
    offset += col.getSize();
  }
  return offset;
};

const getStickyStyle = (column, table, isHeader = false) => {
  const isPinnedLeft = column.getIsPinned() === 'left';
  const isPinnedRight = column.getIsPinned() === 'right';
  if (!isPinnedLeft && !isPinnedRight) return {};

  const leftPinned = table.getLeftLeafColumns();
  const rightPinned = table.getRightLeafColumns();
  const isLastLeft =
    isPinnedLeft && leftPinned[leftPinned.length - 1]?.id === column.id;
  const isFirstRight = isPinnedRight && rightPinned[0]?.id === column.id;
  const sep = '2px solid #6c757d';

  return {
    position: 'sticky',
    left: isPinnedLeft ? getLeftOffset(column, table) : undefined,
    right: isPinnedRight ? getRightOffset(column, table) : undefined,
    zIndex: 2,
    backgroundColor: isHeader ? '#f8f9fa' : '#ffffff',
    borderRight: isLastLeft ? sep : undefined,
    borderLeft: isFirstRight ? sep : undefined,
  };
};

/* ─────────────────────────────────────────────
   TableContainer
───────────────────────────────────────────── */
const TableContainer = ({
  columns: columnsProp,
  data,
  isLoading = false,
  isBordered = true,
  isPagination = true,
  isGlobalFilter = true,
  buttonName = null,
  isAddButton = false,
  secondaryButtonName = null,
  isSecondaryButton = false,
  rowHeight = 35,
  isCustomPageSize = true,
  onAddClick,
  onSecondaryButtonClick,
  SecondaryButtonIcon,
  isExcelExport = true,
  isPdfExport = true,
  isPrint = true,
  exportColumns = [],
  exportSearchParams = {},
  exportData,
  tableName = '',
  infoIcon = false,
  refetch,
  isFetching = false,
  showToolbar = true,
  // Server-side pagination props
  isServerSidePagination = false,
  totalRows = 0,
  pageCount = 0,
  paginationState: externalPaginationState,
  onPaginationChange,
}) => {
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [showColumnDropdown, setShowColumnDropdown] = React.useState(false);

  const [internalPaginationState, setInternalPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const paginationState =
    isServerSidePagination && externalPaginationState
      ? externalPaginationState
      : internalPaginationState;

  const { t } = useTranslation();

  /* ── Column visibility ── */
  const initialColumnVisibility = React.useMemo(() => {
    const visibility = {};
    const visit = (cols) => {
      cols.forEach((col) => {
        if (col.columns) {
          visit(col.columns);
          return;
        }
        const id = col.id || col.accessorKey;
        visibility[id] = col.visible !== false;
      });
    };
    visit(columnsProp);
    return visibility;
  }, [columnsProp]);

  const [columnVisibility, setColumnVisibility] = React.useState(
    initialColumnVisibility
  );
  React.useEffect(() => {
    setColumnVisibility(initialColumnVisibility);
  }, [initialColumnVisibility]);

  /* ── Column pinning ── */
  const initialColumnPinning = React.useMemo(() => {
    const left = [],
      right = [];
    const visit = (cols) => {
      cols.forEach((col) => {
        if (col.columns) {
          visit(col.columns);
          return;
        }
        const id = col.id || col.accessorKey;
        if (col.pinned === 'left') left.push(id);
        if (col.pinned === 'right') right.push(id);
      });
    };
    visit(columnsProp);
    return { left, right };
  }, [columnsProp]);

  const [columnPinning, setColumnPinning] =
    React.useState(initialColumnPinning);

  /* ── Pagination ── */
  const calculatedPageCount = isServerSidePagination
    ? pageCount
    : Math.ceil(data.length / paginationState.pageSize);

  const handlePaginationChange = React.useCallback(
    (updater) => {
      const newState =
        typeof updater === 'function' ? updater(paginationState) : updater;
      if (isServerSidePagination && onPaginationChange) {
        onPaginationChange(newState);
      } else {
        setInternalPaginationState(newState);
      }
    },
    [isServerSidePagination, onPaginationChange, paginationState]
  );

  ('use no memo');
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columnsProp,
    defaultColumn: { size: 200 },
    filterFns: {
      between: (row, columnId, value) => {
        if (!value) return true;
        const v = Number(row.getValue(columnId));
        const min = value[0];
        const max = value[1];
        if (min !== undefined && min !== '' && v < Number(min)) return false;
        if (max !== undefined && max !== '' && v > Number(max)) return false;
        return true;
      },
    },
    ...(isServerSidePagination && { rowCount: totalRows }),
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination: paginationState,
      columnPinning,
    },
    onPaginationChange: handlePaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(!isServerSidePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    manualPagination: isServerSidePagination,
    pageCount: calculatedPageCount,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  return (
    <Card>
      <CardBody className="p-2">
        {/* ── Toolbar ── */}
        {showToolbar && (
          <Row className="mb-2 d-flex align-items-center justify-content-between">
            <>
              {isCustomPageSize && (
                <Col sm={2} className="mb-2">
                  <select
                    className="form-select pageSize my-auto"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      handlePaginationChange({
                        pageIndex: 0,
                        pageSize: Number(e.target.value),
                      });
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {t('showing')} {pageSize}
                      </option>
                    ))}
                  </select>
                </Col>
              )}
              {isGlobalFilter && (
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={(value) => setGlobalFilter(String(value))}
                  className="form-control search-box me-2 my-auto d-inline-block mb-2"
                  placeholder={t('filter_placeholder')}
                  globalFilter={true}
                />
              )}
            </>

            <Col sm={6} className="mb-2">
              <div className="text-sm-end d-flex align-items-center justify-content-end gap-2">
                {isAddButton && (
                  <Button
                    type="button"
                    className="btn-soft-success"
                    onClick={onAddClick}
                  >
                    <FaPlus className="me-1" /> {buttonName || t('add_new')}
                  </Button>
                )}

                {isSecondaryButton && (
                  <Button
                    type="button"
                    variant="outline-primary"
                    onClick={onSecondaryButtonClick}
                    className="d-flex align-items-center"
                  >
                    {SecondaryButtonIcon ? (
                      <SecondaryButtonIcon className="me-1" />
                    ) : null}
                    {secondaryButtonName}
                  </Button>
                )}

                {/* Toggle Columns */}
                <Dropdown
                  show={showColumnDropdown}
                  onToggle={(isOpen) => setShowColumnDropdown(isOpen)}
                  drop="start"
                >
                  <div
                    data-tooltip={t('toggle_columns')}
                    className="tooltip-wrapper"
                  >
                    <DropdownToggle
                      variant="primary"
                      id="toggle-columns-tooltip"
                    >
                      <FaColumns size={18} />
                    </DropdownToggle>
                  </div>
                  <DropdownMenu
                    className="py-2 mt-1 bg-light"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      minWidth: '220px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    <DropdownItem
                      as="div"
                      className="px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Row className="g-1">
                        <Col xs={4}>
                          <Button
                            className="w-100"
                            variant="secondary"
                            size="sm"
                            style={{
                              paddingTop: '0.25rem',
                              paddingBottom: '0.25rem',
                            }}
                            onClick={() => {
                              const v = {};
                              table.getAllLeafColumns().forEach((c) => {
                                v[c.id] = false;
                              });
                              setColumnVisibility(v);
                            }}
                            disabled={table
                              .getAllLeafColumns()
                              .every((c) => !c.getIsVisible())}
                          >
                            {t('hide_all')}
                          </Button>
                        </Col>
                        <Col xs={4}>
                          <Button
                            className="w-100"
                            variant="success"
                            size="sm"
                            style={{
                              paddingTop: '0.25rem',
                              paddingBottom: '0.25rem',
                            }}
                            onClick={() => {
                              const v = {};
                              table.getAllLeafColumns().forEach((c) => {
                                v[c.id] = true;
                              });
                              setColumnVisibility(v);
                            }}
                            disabled={table
                              .getAllLeafColumns()
                              .every((c) => c.getIsVisible())}
                          >
                            {t('show_all')}
                          </Button>
                        </Col>
                        <Col xs={4}>
                          <Button
                            className="w-100"
                            variant="outline-danger"
                            size="sm"
                            style={{
                              paddingTop: '0.25rem',
                              paddingBottom: '0.25rem',
                            }}
                            onClick={() =>
                              setColumnVisibility(initialColumnVisibility)
                            }
                          >
                            {t('reset')}
                          </Button>
                        </Col>
                      </Row>
                    </DropdownItem>

                    {table.getAllLeafColumns().map((column) => {
                      const pinState = column.getIsPinned();
                      return (
                        <DropdownItem
                          key={column.id}
                          as="div"
                          className="px-3 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <Switch
                              height={16}
                              width={36}
                              checked={column.getIsVisible()}
                              onChange={(checked) =>
                                setColumnVisibility((prev) => ({
                                  ...prev,
                                  [column.id]: checked,
                                }))
                              }
                              onColor="#34c38f"
                            />
                            <span className="flex-grow-1">
                              {t(column.columnDef.accessorKey) ||
                                t(column.columnDef.header) ||
                                t(column.id)}
                            </span>
                            <div className="d-flex gap-1 ms-auto">
                              <Button
                                size="sm"
                                variant={
                                  pinState === 'left'
                                    ? 'primary'
                                    : 'outline-secondary'
                                }
                                style={{ padding: '1px 5px', fontSize: '10px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  column.pin(
                                    pinState === 'left' ? false : 'left'
                                  );
                                }}
                              >
                                ◀
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  pinState === 'right'
                                    ? 'primary'
                                    : 'outline-secondary'
                                }
                                style={{ padding: '1px 5px', fontSize: '10px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  column.pin(
                                    pinState === 'right' ? false : 'right'
                                  );
                                }}
                              >
                                ▶
                              </Button>
                            </div>
                          </div>
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>

                {/* Export */}
                {(isExcelExport || isPdfExport || isPrint) && (
                  <Dropdown>
                    <div data-tooltip={t('export')} className="tooltip-wrapper">
                      <DropdownToggle variant="primary" id="export_toggle">
                        <FaFileExport size={18} />
                      </DropdownToggle>
                    </div>
                    <DropdownMenu className="py-2 mt-1">
                      {isExcelExport && (
                        <ExportToExcel
                          tableData={exportData || data}
                          tableName={tableName}
                          dropdownItem={true}
                          exportColumns={exportColumns}
                          exportSearchParams={exportSearchParams}
                        />
                      )}
                      {isPdfExport && (
                        <ExportToPdf
                          tableData={exportData || data}
                          tableName={tableName}
                          dropdownItem={true}
                          exportColumns={exportColumns}
                          exportSearchParams={exportSearchParams}
                        />
                      )}
                      {isPrint && (
                        <PrintTable
                          tableData={exportData || data}
                          tableName={tableName}
                          dropdownItem={true}
                          exportColumns={exportColumns}
                          exportSearchParams={exportSearchParams}
                        />
                      )}
                    </DropdownMenu>
                  </Dropdown>
                )}

                {/* Refresh */}
                {refetch && (
                  <Button
                    id="refresh_btn"
                    onClick={refetch}
                    variant="outline-primary"
                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '30px', height: '30px', fontSize: '14px' }}
                  >
                    {isFetching ? (
                      <Spinner variant="light" size="sm" />
                    ) : (
                      <FaRedoAlt />
                    )}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        )}

        {/* ── Table ── */}
        <div className="position-relative">
          {isLoading && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75"
              style={{ zIndex: 2 }}
            >
              <Spinner color="primary" />
            </div>
          )}
          {infoIcon && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '-18px',
                zIndex: 1,
              }}
            >
              <FaInfoCircle size={18} id="info" />
            </div>
          )}

          <div
            style={{
              overflowX: 'scroll',
              overflowY: 'hidden',
              minHeight: '400px',
            }}
            className="table-responsive"
          >
            <Table
              hover
              className="table-sm table-bordered table-striped h-100"
              bordered={isBordered}
            >
              <thead className="table-light">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isPinned = header.column.getIsPinned();
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            minWidth: header.getSize(),
                            ...getStickyStyle(header.column, table, true),
                          }}
                          className={isPinned ? `pinned-${isPinned}` : ''}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                className={
                                  header.column.getCanSort()
                                    ? 'cursor-pointer select-none'
                                    : ''
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  t(header.column.columnDef.accessorKey) ||
                                    header.column.columnDef.header ||
                                    t(header.id),
                                  header.getContext()
                                )}
                                {{ asc: ' 🔼', desc: ' 🔽' }[
                                  header.column.getIsSorted()
                                ] ?? null}
                              </div>
                              {header.column.getCanFilter() && (
                                <div>
                                  <Filter column={header.column} />
                                </div>
                              )}
                            </>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className="text-center py-5 bg-white shadow-none border-0"
                    >
                      {!isLoading && t('no_data_available_table')}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} style={{ maxHeight: rowHeight }}>
                      {row.getVisibleCells().map((cell) => {
                        const isPinned = cell.column.getIsPinned();
                        return (
                          <td
                            key={cell.id}
                            style={{
                              maxHeight: rowHeight,
                              ...getStickyStyle(cell.column, table, false),
                            }}
                            className={isPinned ? `pinned-${isPinned}` : ''}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* ── Pagination ── */}
          {isPagination && (
            <TablePagination
              table={table}
              totalRows={totalRows}
              isServerSidePagination={isServerSidePagination}
              paginationState={table.getState().pagination}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default TableContainer;
