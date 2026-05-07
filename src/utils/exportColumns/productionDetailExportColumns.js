export const productionDetailExportColumns = [
  {
    key: 'ppd_product',
    label: 'ppd_product',
    format: (val) => val || '-',
  },
  {
    key: 'ppd_product_detail',
    label: 'ppd_product_detail',
    format: (val) => val || '-',
  },
  {
    key: 'ppd_planned_volume',
    label: 'ppd_planned_volume',
    type: 'number',
  },
  {
    key: 'ppd_planned_amount_etb',
    label: 'ppd_planned_amount_etb',
    type: 'number',
  },
  {
    key: 'ppd_planned_amount_usd',
    label: 'ppd_planned_amount_usd',
    type: 'number',
  },
  {
    key: 'ppd_actual_volume',
    label: 'ppd_actual_volume',
    type: 'number',
  },
  {
    key: 'ppd_actual_amount_etb',
    label: 'ppd_actual_amount_etb',
    type: 'number',
  },
  {
    key: 'ppd_actual_amount_usd',
    label: 'ppd_actual_amount_usd',
    type: 'number',
  },
  {
    key: '_ppd_uom_label',
    label: 'ppd_uom_id',
    format: (val) => val || '-',
  },
  {
    key: 'ppd_challenge',
    label: 'ppd_challenge',
    format: (val) => val || '-',
  },
  {
    key: 'ppd_remark',
    label: 'ppd_remark',
    format: (val) => val || '-',
  },
];
