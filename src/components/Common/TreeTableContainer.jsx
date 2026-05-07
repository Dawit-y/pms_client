import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import React, { useState, useMemo, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { FaArrowsAlt } from 'react-icons/fa';

const TreeTableContainer = ({
  data,
  columns,
  onDragEnd,
  draggableLevel = 'woreda',
  droppableLevel = 'zone',
  isDraggable: customIsDraggable,
  isDroppable: customIsDroppable,
  findNodeById: customFindNodeById,
  size = 'sm',
}) => {
  const [expanded, setExpanded] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);

  ('use no memo');
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      columnFilters,
    },
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.id,
    filterFns: {
      treeContains: treeContainsFilter,
    },
    defaultColumn: {
      minSize: 100,
      maxSize: 800,
      filterFn: 'treeContains',
    },
    columnResizeMode: 'onChange',
  });

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = (event) => {
    setActiveId(null);
    if (onDragEnd) onDragEnd(event);
  };

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const sizes = {};
    headers.forEach((header) => {
      sizes[`--header-${header.id}-size`] = header.getSize();
      sizes[`--col-${header.column.id}-size`] = header.column.getSize();
    });
    return sizes;
  }, [table]);

  const findNode = (id) => {
    if (customFindNodeById) return customFindNodeById(data, id);
    return findNodeById(data, id);
  };

  const getIsDraggable = (row) => {
    if (customIsDraggable !== undefined) {
      return typeof customIsDraggable === 'function'
        ? customIsDraggable(row)
        : row.original.level === customIsDraggable;
    }
    return row.original.level === draggableLevel;
  };

  const getIsDroppable = (row) => {
    if (customIsDroppable !== undefined) {
      return typeof customIsDroppable === 'function'
        ? customIsDroppable(row)
        : row.original.level === customIsDroppable;
    }
    return row.original.level === droppableLevel;
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}
    >
      <div
        className="table-responsive"
        style={{ maxHeight: '80vh', overflow: 'auto', minHeight: '400px' }}
      >
        <Table
          hover
          bordered
          size={size}
          style={{ ...columnSizeVars, width: '100%' }}
        >
          <thead
            className="sticky-top table-light"
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
                      position: 'relative',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() && (
                          <div className="mt-1">
                            <Filter column={header.column} />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <DraggableRow
                key={row.id}
                row={row}
                isDraggable={getIsDraggable(row)}
                isDroppable={getIsDroppable(row)}
                expanded={expanded}
              />
            ))}
          </tbody>
        </Table>
      </div>
      <DragOverlay>
        {activeId ? <DefaultDragOverlay node={findNode(activeId)} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TreeTableContainer;

// ---------- Filter Functions ----------
const treeContainsFilter = (row, columnId, filterValue) => {
  const search = String(filterValue).toLowerCase().trim();
  if (!search) return true;

  const cellValue = String(row.getValue(columnId) ?? '').toLowerCase();
  if (cellValue.includes(search)) return true;

  if (row.subRows && row.subRows.length > 0) {
    return row.subRows.some((sub) =>
      treeContainsFilter(sub, columnId, filterValue)
    );
  }

  return false;
};

// ---------- Helper Components ----------
const DefaultDragOverlay = ({ node }) => (
  <div className="d-flex align-items-center gap-3 p-2 bg-white border rounded shadow-sm">
    <FaArrowsAlt className="text-muted" />
    <div>
      <strong>{node?.name || 'Dragging...'}</strong>
      <span className="text-secondary small ms-2">
        Level: {node?.level || 'N/A'}
      </span>
    </div>
  </div>
);

// Filter with local state so the input value is never wiped by a mid-type re-render
const Filter = ({ column }) => {
  const [value, setValue] = useState(() => column.getFilterValue() ?? '');

  // Sync local state if the filter is cleared externally (e.g. column reset)
  const externalValue = column.getFilterValue();
  useEffect(() => {
    // eslint-disable-next-line
    setValue(externalValue ?? '');
  }, [externalValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        column.setFilterValue(e.target.value || undefined);
      }}
      placeholder="Search..."
      className="form-control form-control-sm"
    />
  );
};

// ---------- Row Components ----------
const DraggableRow = ({ row, isDraggable, isDroppable, expanded }) => {
  const sortable = useSortable({
    id: row.id,
    disabled: !isDraggable,
  });
  const { setNodeRef, transform, transition, isDragging } = sortable;

  const droppable = useDroppable({
    id: row.id,
    disabled: !isDroppable,
  });

  // Derive a stable primitive boolean from the `expanded` state object.
  // The compiler tracks this prop change even when `row` reference is reused.
  const rowIsExpanded = expanded === true || Boolean(expanded?.[row.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging
      ? '#f8f9fa'
      : droppable.isOver
        ? '#e2f0ff'
        : 'inherit',
  };

  return (
    <tr
      ref={(node) => {
        if (isDroppable && droppable.setNodeRef) droppable.setNodeRef(node);
        if (isDraggable && setNodeRef) setNodeRef(node);
      }}
      style={style}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
        >
          {flexRender(cell.column.columnDef.cell, {
            ...cell.getContext(),
            // Inject the reactive boolean into the cell context so column
            // cell functions can pass it to ExpandButton as a plain prop.
            isRowExpanded: rowIsExpanded,
          })}
        </td>
      ))}
    </tr>
  );
};

// ---------- Utility Functions ----------

//eslint-disable-next-line
export function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

//eslint-disable-next-line
export function findParentNode(nodes, childId, parentLevel = null) {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((child) => child.id === childId)) return node;
      const found = findParentNode(node.children, childId, parentLevel);
      if (found) return found;
    }
  }
  return null;
}
