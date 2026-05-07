export const monitoringChecklistExportColumns = [
  {
    key: 'pmc_monitoring_id',
    label: 'pmc monitoring id',
    format: (val) => val || '-',
  },
  {
    key: 'pmc_checklist_id',
    label: 'pmc checklist id',
    format: (val) => val || '-',
  },
  {
    key: 'pmc_checklist_value',
    label: 'pmc checklist value',
    format: (val) => val || '-',
  },
  {
    key: 'pmc_is_reason_for_up',
    label: 'reason for under production',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pmc_remark',
    label: 'pmc remark',
    format: (val) => val || '-',
  },
];
