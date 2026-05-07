export const userRoleExportColumns = [
  {
    key: 'url_id',
    label: 'url id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'url_role_id',
    label: 'url role id',
    format: (val) => val || '-',
  },
  {
    key: 'url_user_id',
    label: 'url user id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'url_description',
    label: 'url description',
    format: (val) => val || '-',
  },
];
