export const letterExportColumns = [
  {
    key: 'ltr_reference_no',
    label: 'Reference No',
    format: (val) => val || '-',
  },
  {
    key: 'ltr_written_to',
    label: 'Written To',
    format: (val) => val || '-',
  },
  {
    key: 'ltr_subject',
    label: 'Subject',
    format: (val) => val || '-',
  },
  {
    key: 'ltr_object_type_id',
    label: 'Object Type',
    format: (val) => {
      const types = { 1: 'Investor', 2: 'Project' };
      return types[val] || val || '-';
    },
  },
  {
    key: 'ltr_status',
    label: 'Status',
    format: (val) => (val === 1 ? 'Active' : 'Inactive'),
  },
  {
    key: 'ltr_created_time',
    label: 'Created Time',
    format: (val) => val || '-',
  },
];
