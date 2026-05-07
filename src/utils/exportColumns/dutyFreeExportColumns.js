export const dutyFreeExportColumns = [
  {
    key: 'dtf_owner_name',
    label: 'dtf owner name',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_sex',
    label: 'dtf sex',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_phone',
    label: 'dtf phone',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_town',
    label: 'dtf town',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_zone',
    label: 'dtf zone',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_tin',
    label: 'dtf tin',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_town_woreda',
    label: 'dtf town woreda',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_project_sector',
    label: 'dtf project sector',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_project_type',
    label: 'dtf project type',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_commodity_id',
    label: 'dtf commodity id',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_specific_name',
    label: 'dtf specific name',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_hs_code',
    label: 'dtf hs code',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_invoice_amount',
    label: 'dtf invoice amount',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_measurement_id',
    label: 'dtf measurement id',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_qty',
    label: 'dtf qty',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_unit_price',
    label: 'dtf unit price',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_invoice_amount_birr',
    label: 'dtf invoice amount birr',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_approved_qty',
    label: 'dtf approved qty',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_rejected_qty',
    label: 'dtf rejected qty',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_tax_forgone',
    label: 'dtf tax forgone',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_submission_date',
    label: 'dtf submission date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'dtf_approved_date',
    label: 'dtf approved date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'dtf_custom_branch',
    label: 'dtf custom branch',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_remark',
    label: 'dtf remark',
    format: (val) => val || '-',
  },
];
