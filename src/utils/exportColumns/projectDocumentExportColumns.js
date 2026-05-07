export const projectDocumentExportColumns = [
  {
    key: 'prd_id',
    label: 'prd id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prd_project_id',
    label: 'prd project id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prd_file',
    label: 'prd file',
    format: (val) => val || '-',
  },
  {
    key: 'prd_name',
    label: 'prd name',
    format: (val) => val || '-',
  },
  {
    key: 'prd_file_path',
    label: 'prd file path',
    format: (val) => val || '-',
  },
  {
    key: 'prd_size',
    label: 'prd size',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prd_file_extension',
    label: 'prd file extension',
    format: (val) => val || '-',
  },
  {
    key: 'prd_description',
    label: 'prd description',
    format: (val) => val || '-',
  },
  {
    key: 'prd_document_type_id',
    label: 'prd document type id',
    format: (val) => val || '-',
  },
];
