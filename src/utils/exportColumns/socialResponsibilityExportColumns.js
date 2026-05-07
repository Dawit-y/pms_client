export const socialResponsibilityExportColumns = [
  {
    key: 'srt_monitoring_id',
    label: 'Monitoring',
    format: (val) => val || '-',
  },
  {
    key: 'srt_type_id',
    label: 'Type',
    format: (val) => val || '-',
  },
  {
    key: 'srt_amount',
    label: 'Amount',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'srt_beneficiery',
    label: 'Beneficiary',
    format: (val) => val || '-',
  },
];
