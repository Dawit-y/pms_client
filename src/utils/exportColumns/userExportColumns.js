export const userExportColumns = [
  {
    key: 'email',
    label: 'email',
    format: (val) => val || '-',
  },
  {
    key: 'full_name',
    label: 'full_name',
    format: (val) => val || '-',
  },
  {
    key: 'phone',
    label: 'phone',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
  },
];
