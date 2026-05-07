export const lookupExportColumns = [
  {
    key: 'lku_type_id',
    label: 'lku type id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'lku_name_or',
    label: 'lku name or',
    format: (val) => val || '-',
  },
  {
    key: 'lku_name_am',
    label: 'lku name am',
    format: (val) => val || '-',
  },
  {
    key: 'lku_name_en',
    label: 'lku name en',
    format: (val) => val || '-',
  },
  {
    key: 'lku_code',
    label: 'lku code',
    format: (val) => val || '-',
  },
  {
    key: 'lku_color_code',
    label: 'lku color code',
    format: (val) => val || '-',
  },
  {
    key: 'lku_order_id',
    label: 'lku order id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'lku_extra_attr1',
    label: 'lku extra attr1',
    format: (val) => val || '-',
  },
  {
    key: 'lku_extra_attr2',
    label: 'lku extra attr2',
    format: (val) => val || '-',
  },
  {
    key: 'lku_remark',
    label: 'lku remark',
    format: (val) => val || '-',
  },
  {
    key: 'lku_status',
    label: 'lku status',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'lku_updated_by',
    label: 'lku updated by',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];
