export const accessLogExportColumns = [
  {
    key: 'acl_ip',
    label: 'acl ip',
    format: (val) => val || '-',
  },
  {
    key: 'acl_user_id',
    label: 'acl user id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'acl_object_action',
    label: 'acl object action',
    format: (val) => val || '-',
  },
  {
    key: 'acl_object_name',
    label: 'acl object name',
    format: (val) => val || '-',
  },
  {
    key: 'acl_create_time',
    label: 'acl create time',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'acl_description',
    label: 'acl description',
    format: (val) => val || '-',
  },
];
