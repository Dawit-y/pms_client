export const projectTerminationExportColumns = [
  {
    key: 'ptr_request_date',
    label: 'ptr request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ptr_request_description',
    label: 'ptr request description',
    format: (val) => val || '-',
  },
  {
    key: 'ptr_request_status_id',
    label: 'ptr request status id',
    format: (val) => val || '-',
  },
  {
    key: 'ptr_decision_body_id',
    label: 'ptr decision body id',
    format: (val) => val || '-',
  },
  {
    key: 'ptr_term_date',
    label: 'ptr term date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ptr_term_description',
    label: 'ptr term description',
    format: (val) => val || '-',
  },
  {
    key: 'ptr_appeal_flag',
    label: 'ptr appeal flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ptr_final_term_letter_no',
    label: 'ptr final term letter no',
    format: (val) => val || '-',
  },
];
