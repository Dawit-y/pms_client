export const statusChangeReasonExportColumns = [
  {
    key: 'scr_status_id',
    label: 'scr status id',
    format: (val) => val || '-',
  },
  {
    key: 'scr_name_or',
    label: 'scr name or',
    format: (val) => val || '-',
  },
  {
    key: 'scr_name_am',
    label: 'scr name am',
    format: (val) => val || '-',
  },
  {
    key: 'scr_name_en',
    label: 'scr name en',
    format: (val) => val || '-',
  },
  {
    key: 'scr_code',
    label: 'scr code',
    format: (val) => val || '-',
  },
  {
    key: 'scr_color_code',
    label: 'scr color code',
    format: (val) => val || '-',
  },
  {
    key: 'scr_order_id',
    label: 'scr order id',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];
