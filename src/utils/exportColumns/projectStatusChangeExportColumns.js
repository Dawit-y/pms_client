export const projectStatusChangeExportColumns = [
  {
    key: 'psc_activity_date',
    label: 'psc activity date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'psc_remark',
    label: 'psc remark',
    format: (val) => val || '-',
  },
];
