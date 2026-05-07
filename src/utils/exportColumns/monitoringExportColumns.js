export const monitoringExportColumns = [
  {
    key: 'prm_used_land',
    label: 'prm used land',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_unused_land',
    label: 'prm unused land',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_monitoring_date',
    label: 'prm monitoring date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'prm_actual_capital',
    label: 'prm actual capital',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_used_capital',
    label: 'prm used capital',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_challenge',
    label: 'prm challenge',
    format: (val) => val || '-',
  },
  {
    key: 'prm_commencement_date',
    label: 'prm commencement date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'prm_officer_name',
    label: 'prm officer name',
    format: (val) => val || '-',
  },
  {
    key: 'prm_officer_comment',
    label: 'prm officer comment',
    format: (val) => val || '-',
  },
  {
    key: 'prm_geo_location',
    label: 'prm geo location',
    format: (val) => val || '-',
  },
  {
    key: 'prm_remark',
    label: 'prm remark',
    format: (val) => val || '-',
  },
];
