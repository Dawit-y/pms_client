export const demandExportColumns = [
  {
    key: 'pdd_year_id',
    label: 'pdd year id',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_request_date',
    label: 'pdd request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'pdd_request_description',
    label: 'pdd request description',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_local_qty',
    label: 'pdd local qty',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pdd_import_qty',
    label: 'pdd import qty',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pdd_request_status_id',
    label: 'pdd request status id',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_demand_type_id',
    label: 'pdd demand type id',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_remark',
    label: 'pdd remark',
    format: (val) => val || '-',
  },
];
