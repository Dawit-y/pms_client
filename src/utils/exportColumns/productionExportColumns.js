export const productionExportColumns = [
  {
    key: '_ppr_year_label',
    label: 'ppr_year_id',
    format: (val) => val || '-',
  },
  {
    key: '_ppr_month_label',
    label: 'ppr_month_id',
    format: (val) => val || '-',
  },
  {
    key: 'ppr_product_detail',
    label: 'ppr_product_detail',
    format: (val) => val || '-',
  },
  {
    key: '_ppr_uom_label',
    label: 'ppr_uom_id',
    format: (val) => val || '-',
  },
  {
    key: 'ppr_planned_volume',
    label: 'ppr_planned_volume',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
  },
  {
    key: 'ppr_planned_amount_etb',
    label: 'ppr_planned_amount_etb',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
  },
  {
    key: 'ppr_planned_amount_usd',
    label: 'ppr_planned_amount_usd',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
  },
  {
    key: 'ppr_actual_volume',
    label: 'ppr_actual_volume',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
  },
  {
    key: 'ppr_actual_amount_etb',
    label: 'ppr_actual_amount_etb',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
  },
  {
    key: 'ppr_actual_amount_usd',
    label: 'ppr_actual_amount_usd',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
  },
  {
    key: 'ppr_challenge',
    label: 'ppr_challenge',
    format: (val) => val || '-',
  },
  {
    key: 'ppr_remark',
    label: 'ppr_remark',
    format: (val) => val || '-',
  },
];
