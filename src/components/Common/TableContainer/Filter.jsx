import { FormSelect } from 'react-bootstrap';

import DebouncedInput from './DebounceInput';

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, options } = column.columnDef.meta ?? {};

  return filterVariant === 'range' ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={columnFilterValue?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded mb-1"
        />
        <DebouncedInput
          type="number"
          value={columnFilterValue?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === 'select' && options.length > 0 ? (
    <FormSelect
      size="sm"
      htmlSize={'sm'}
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </FormSelect>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={columnFilterValue ?? ''}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

export default Filter;
