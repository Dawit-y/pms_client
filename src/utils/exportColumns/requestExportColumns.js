export const requestExportColumns = [
  {
    key: 'rqt_request_type_id',
    label: 'rqt request type id',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_project_id',
    label: 'rqt project id',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_request_description',
    label: 'rqt request description',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_request_date',
    label: 'rqt request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'rqt_status_id',
    label: 'rqt status id',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_response_date',
    label: 'rqt response date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'rqt_remark',
    label: 'rqt remark',
    format: (val) => val || '-',
  },
];
