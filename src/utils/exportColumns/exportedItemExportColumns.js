const hasValue = (val) => val !== null && val !== undefined && val !== '';

const formatText = (val) => (hasValue(val) ? val : '-');

const formatNumber = (val) =>
  hasValue(val) && !Number.isNaN(Number(val))
    ? Number(val).toLocaleString()
    : '-';

const formatDate = (val) =>
  hasValue(val) ? new Date(val).toLocaleDateString() : '-';

export const exportedItemExportColumns = [
  {
    key: 'exp_impex',
    label: 'exp_impex',
    format: formatText,
  },
  {
    key: 'exp_office',
    label: 'exp_office',
    format: formatText,
  },
  {
    key: 'exp_dec_code',
    label: 'exp_dec_code',
    format: formatText,
  },
  {
    key: 'exp_declarant_name',
    label: 'exp_declarant_name',
    format: formatText,
  },
  {
    key: 'exp_reg_no',
    label: 'exp_reg_no',
    format: formatText,
  },
  {
    key: 'exp_model_type',
    label: 'exp_model_type',
    format: formatText,
  },
  {
    key: 'exp_cpc',
    label: 'exp_cpc',
    format: formatText,
  },
  {
    key: 'exp_cpc_description',
    label: 'exp_cpc_description',
    format: formatText,
  },
  {
    key: 'exp_bank_permit_number',
    label: 'exp_bank_permit_number',
    format: formatText,
  },
  {
    key: 'exp_reg_date',
    label: 'exp_reg_date',
    format: formatDate,
    type: 'date',
  },
  {
    key: 'exp_ass_date',
    label: 'exp_ass_date',
    format: formatDate,
    type: 'date',
  },
  {
    key: 'exp_tin',
    label: 'exp_tin',
    format: formatText,
  },
  {
    key: 'exp_trader',
    label: 'exp_trader',
    format: formatText,
  },
  {
    key: 'exp_trader_address',
    label: 'exp_trader_address',
    format: formatText,
  },
  {
    key: 'exp_item',
    label: 'exp_item',
    format: formatText,
  },
  {
    key: 'exp_hs_code',
    label: 'exp_hs_code',
    format: formatText,
  },
  {
    key: 'exp_hs_description',
    label: 'exp_hs_description',
    format: formatText,
  },
  {
    key: 'exp_commercial_name',
    label: 'exp_commercial_name',
    format: formatText,
  },
  {
    key: 'exp_bill_of_landing',
    label: 'exp_bill_of_landing',
    format: formatText,
  },
  {
    key: 'exp_country_origin',
    label: 'exp_country_origin',
    format: formatText,
  },
  {
    key: 'exp_country_consignment',
    label: 'exp_country_consignment',
    format: formatText,
  },
  {
    key: 'exp_destination',
    label: 'exp_destination',
    format: formatText,
  },
  {
    key: 'exp_cif_fob_value',
    label: 'exp_cif_fob_value',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_number_of_packages',
    label: 'exp_number_of_packages',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_mot_code',
    label: 'exp_mot_code',
    format: formatText,
  },
  {
    key: 'exp_mot_description',
    label: 'exp_mot_description',
    format: formatText,
  },
  {
    key: 'exp_suppl_quantity',
    label: 'exp_suppl_quantity',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_gross_weight',
    label: 'exp_gross_weight',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_net_weight',
    label: 'exp_net_weight',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_duty_tax_tobe_paid',
    label: 'exp_duty_tax_tobe_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_duty_tax_paid',
    label: 'exp_duty_tax_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_excise_tax_tobe_paid',
    label: 'exp_excise_tax_tobe_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_excise_tax_paid',
    label: 'exp_excise_tax_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_vat_tobe_paid',
    label: 'exp_vat_tobe_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_vat_paid',
    label: 'exp_vat_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_wh_tax_tobe_paid',
    label: 'exp_wh_tax_tobe_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_wh_tax_paid',
    label: 'exp_wh_tax_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_sur_tax_tobe_paid',
    label: 'exp_sur_tax_tobe_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_sur_tax_paid',
    label: 'exp_sur_tax_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_total_tax_tobe_paid',
    label: 'exp_total_tax_tobe_paid',
    format: formatNumber,
    type: 'currency',
  },
  {
    key: 'exp_total_tax_scanning_fee',
    label: 'exp_total_tax_scanning_fee',
    format: formatNumber,
    type: 'currency',
  },
];
