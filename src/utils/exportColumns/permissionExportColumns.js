export const permissionExportColumns = [
  {
    key: 'pem_page_id',
    label: 'pem page id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pag_id',
    label: 'pag id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pag_name',
    label: 'pag name',
    format: (val) => val || '-',
  },
  {
    key: 'pem_id',
    label: 'pem id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pem_role_id',
    label: 'pem role id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pem_enabled',
    label: 'pem enabled',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_edit',
    label: 'pem edit',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_insert',
    label: 'pem insert',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_view',
    label: 'pem view',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_delete',
    label: 'pem delete',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_show',
    label: 'pem show',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_search',
    label: 'pem search',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_description',
    label: 'pem description',
    format: (val) => val || '-',
  },
];
