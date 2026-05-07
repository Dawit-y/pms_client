export const requestFollowupExportColumns = [
  {
    key: 'rqf_request_id',
    label: 'rqf request id',
    format: (val) => val || '-',
  },
  {
    key: 'rqf_forwarding_dep_id',
    label: 'rqf forwarding dep id',
    format: (val) => val || '-',
  },
  {
    key: 'rqf_forwarded_to_dep_id',
    label: 'rqf forwarded to dep id',
    format: (val) => val || '-',
  },
  {
    key: 'rqf_forwarding_date',
    label: 'rqf forwarding date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'rqf_received_date',
    label: 'rqf received date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'rqf_description',
    label: 'rqf description',
    format: (val) => val || '-',
  },
];
