export const lookupTypeExportColumns = [
  {
    key: 'lkt_type_code',
    label: 'lkt type code',
    format: (val) => val || '-',
  },
  {
    key: 'lkt_type_name',
    label: 'lkt type name',
    format: (val) => val || '-',
  },
  {
    key: 'lkt_remark',
    label: 'lkt remark',
    format: (val) => val || '-',
  },
  {
    key: 'lkt_status',
    label: 'lkt status',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'lkt_updated_by',
    label: 'lkt updated by',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];
