export const projectExtensionExportColumns = [
  {
    key: 'pex_request_date',
    label: 'pex request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'pex_request_description',
    label: 'pex request description',
    format: (val) => val || '-',
  },
  {
    key: 'pex_processed_date',
    label: 'pex processed date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'pex_request_status_id',
    label: 'pex request status id',
    format: (val) => val || '-',
  },
  {
    key: 'pex_decision_body_id',
    label: 'pex decision body id',
    format: (val) => val || '-',
  },
  {
    key: 'pex_agreement_start_year',
    label: 'pex agreement start year',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pex_agreement_end_year',
    label: 'pex agreement end year',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pex_contract_duration',
    label: 'pex contract duration',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];
