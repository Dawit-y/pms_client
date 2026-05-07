export const projectExportColumns = [
  { key: 'inv_name', label: 'Investor Name', width: 20 },
  { key: 'prj_file_number', label: 'File Number', width: 20 },
  { key: 'prj_zone_name', label: 'Zone', width: 25 },
  { key: 'prj_eco_sector_name', label: 'Economic Sector', width: 25 },
  { key: 'prj_sub_sector_name', label: 'Sub Sector', width: 25 },
  { key: 'prj_type_name', label: 'Project Type', width: 20 },
  { key: 'prj_decision_type_name', label: 'Decision Type', width: 20 },
  { key: 'prj_industry_scale_name', label: 'Industry Scale', width: 18 },
  {
    key: 'prj_capital_amt',
    label: 'Capital Amount',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
    type: 'number',
    width: 18,
  },
  {
    key: 'prj_own_capital_amt',
    label: 'Own Capital',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
    type: 'number',
    width: 16,
  },
  {
    key: 'prj_loan_capital_amt',
    label: 'Loan Capital',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
    type: 'number',
    width: 16,
  },
  {
    key: 'prj_land_size',
    label: 'Land Size',
    format: (val) => (val != null ? Number(val).toLocaleString() : '-'),
    type: 'number',
    width: 14,
  },
  { key: 'prj_land_source_name', label: 'Land Source', width: 18 },
  { key: 'prj_site_name', label: 'Project Site', width: 18 },
  { key: 'prj_start_date', label: 'Start Date', width: 14 },
  { key: 'prj_decision_date', label: 'Decision Date', width: 14 },
  { key: 'prj_decision_body_name', label: 'Decision Body', width: 20 },
  { key: 'prj_agreement_date', label: 'Agreement Date', width: 14 },
  { key: 'prj_agreement_end_date', label: 'Agreement End Date', width: 16 },
  { key: 'prj_contract_duration', label: 'Contract Duration', width: 16 },
  { key: 'prj_license_num', label: 'License Number', width: 18 },
  { key: 'prj_licensing_org_name', label: 'Licensing Org', width: 20 },
  { key: 'prj_phone_num', label: 'Phone Number', width: 16 },
  { key: 'prj_kebele', label: 'Kebele', width: 14 },
];

export const investorExportColumns = [
  { key: 'inv_title_name', label: 'Title', width: 10 },
  { key: 'inv_name', label: 'Investor Name', width: 25 },
  { key: 'inv_phone', label: 'Phone', width: 16 },
  { key: 'inv_email', label: 'Email', width: 25 },
  { key: 'inv_tin', label: 'TIN', width: 16 },
  { key: 'inv_id_card', label: 'ID Card', width: 16 },
  { key: 'inv_fayda_num', label: 'Fayda Number', width: 18 },
  { key: 'inv_investor_type_name', label: 'Investor Type', width: 18 },
  { key: 'inv_ownership_type_name', label: 'Ownership Type', width: 18 },
  { key: 'inv_source_name', label: 'Source of Investment', width: 20 },
  { key: 'inv_nationality_name', label: 'Nationality', width: 16 },
  { key: 'inv_citizenship_name', label: 'Citizenship', width: 16 },
  { key: 'inv_country_name', label: 'Country', width: 16 },
  { key: 'inv_ethinic_group_name', label: 'Ethnic Group', width: 16 },
  { key: 'inv_educ_backg_name', label: 'Education Background', width: 20 },
  { key: 'inv_address', label: 'Address', width: 25 },
  { key: 'inv_website', label: 'Website', width: 20 },
];

export const userExportColumns = [
  { key: 'first_name', label: 'first_name' },
  { key: 'last_name', label: 'last_name' },
  { key: 'email', label: 'email' },
  { key: 'phone_number', label: 'phone_number' },
];

export const projectPaymentExportColumns = [
  {
    key: 'amount',
    label: 'amount',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'payment_date',
    label: 'payment_date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'payment_method',
    label: 'payment_method',
    format: (val) => val || '-',
  },
  {
    key: 'status',
    label: 'status',
    format: (val) => val || '-',
  },
  {
    key: 'receipt_number',
    label: 'receipt_number',
    format: (val) => val || '-',
  },
];

export const userRoleExportColumns = [
  {
    key: 'url_id',
    label: 'url id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'url_role_id',
    label: 'url role id',
    format: (val) => val || '-',
  },
  {
    key: 'url_user_id',
    label: 'url user id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'url_description',
    label: 'url description',
    format: (val) => val || '-',
  },
];

export const accessLogExportColumns = [
  {
    key: 'acl_ip',
    label: 'acl ip',
    format: (val) => val || '-',
  },
  {
    key: 'acl_user_id',
    label: 'acl user id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'acl_object_action',
    label: 'acl object action',
    format: (val) => val || '-',
  },
  {
    key: 'acl_object_name',
    label: 'acl object name',
    format: (val) => val || '-',
  },
  {
    key: 'acl_create_time',
    label: 'acl create time',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'acl_description',
    label: 'acl description',
    format: (val) => val || '-',
  },
];

export const roleExportColumns = [
  {
    key: 'rol_name',
    label: 'rol name',
    format: (val) => val || '-',
  },
  {
    key: 'rol_description',
    label: 'rol description',
    format: (val) => val || '-',
  },
];

export const permissionExportColumns = [
  {
    key: 'pem_page_id',
    label: 'pem page id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pag_id',
    label: 'pag id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pag_name',
    label: 'pag name',
    format: (val) => val || '-',
  },
  {
    key: 'pem_id',
    label: 'pem id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pem_role_id',
    label: 'pem role id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pem_enabled',
    label: 'pem enabled',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_edit',
    label: 'pem edit',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_insert',
    label: 'pem insert',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_view',
    label: 'pem view',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_delete',
    label: 'pem delete',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_show',
    label: 'pem show',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_search',
    label: 'pem search',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pem_description',
    label: 'pem description',
    format: (val) => val || '-',
  },
];

export const lookupExportColumns = [
  {
    key: 'lku_type_id',
    label: 'lku type id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'lku_name_or',
    label: 'lku name or',
    format: (val) => val || '-',
  },
  {
    key: 'lku_name_am',
    label: 'lku name am',
    format: (val) => val || '-',
  },
  {
    key: 'lku_name_en',
    label: 'lku name en',
    format: (val) => val || '-',
  },
  {
    key: 'lku_code',
    label: 'lku code',
    format: (val) => val || '-',
  },
  {
    key: 'lku_color_code',
    label: 'lku color code',
    format: (val) => val || '-',
  },
  {
    key: 'lku_order_id',
    label: 'lku order id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'lku_extra_attr1',
    label: 'lku extra attr1',
    format: (val) => val || '-',
  },
  {
    key: 'lku_extra_attr2',
    label: 'lku extra attr2',
    format: (val) => val || '-',
  },
  {
    key: 'lku_remark',
    label: 'lku remark',
    format: (val) => val || '-',
  },
  {
    key: 'lku_status',
    label: 'lku status',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'lku_updated_by',
    label: 'lku updated by',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];

export const lookupTypeExportColumns = [
  {
    key: 'lkt_type_code',
    label: 'lkt type code',
    format: (val) => val || '-',
  },
  {
    key: 'lkt_type_name',
    label: 'lkt type name',
    format: (val) => val || '-',
  },
  {
    key: 'lkt_remark',
    label: 'lkt remark',
    format: (val) => val || '-',
  },
  {
    key: 'lkt_status',
    label: 'lkt status',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'lkt_updated_by',
    label: 'lkt updated by',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];

export const projectDocumentExportColumns = [
  {
    key: 'prd_id',
    label: 'prd id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prd_project_id',
    label: 'prd project id',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
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
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
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

export const monitoringExportColumns = [
  {
    key: 'prm_used_land',
    label: 'prm used land',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_unused_land',
    label: 'prm unused land',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_monitoring_date',
    label: 'prm monitoring date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'prm_actual_capital',
    label: 'prm actual capital',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_used_capital',
    label: 'prm used capital',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'prm_challenge',
    label: 'prm challenge',
    format: (val) => val || '-',
  },
  {
    key: 'prm_commencement_date',
    label: 'prm commencement date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'prm_officer_name',
    label: 'prm officer name',
    format: (val) => val || '-',
  },
  {
    key: 'prm_officer_comment',
    label: 'prm officer comment',
    format: (val) => val || '-',
  },
  {
    key: 'prm_geo_location',
    label: 'prm geo location',
    format: (val) => val || '-',
  },
  {
    key: 'prm_remark',
    label: 'prm remark',
    format: (val) => val || '-',
  },
];

export const demandExportColumns = [
  {
    key: 'pdd_year_id',
    label: 'pdd year id',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_request_date',
    label: 'pdd request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'pdd_request_description',
    label: 'pdd request description',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_local_qty',
    label: 'pdd local qty',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pdd_import_qty',
    label: 'pdd import qty',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pdd_request_status_id',
    label: 'pdd request status id',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_demand_type_id',
    label: 'pdd demand type id',
    format: (val) => val || '-',
  },
  {
    key: 'pdd_remark',
    label: 'pdd remark',
    format: (val) => val || '-',
  },
];

export const loanExportColumns = [
  {
    key: 'pln_year_id',
    label: 'pln year id',
    format: (val) => val || '-',
  },
  {
    key: 'pln_requested_amount',
    label: 'pln requested amount',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_date_requested',
    label: 'pln date requested',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'pln_amount_granted',
    label: 'pln amount granted',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_bank_id',
    label: 'pln bank id',
    format: (val) => val || '-',
  },
  {
    key: 'pln_bank_released_date',
    label: 'pln bank released date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'pln_confirmed_receipt',
    label: 'pln confirmed receipt',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'pln_request_operational',
    label: 'pln request operational',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_request_machinery',
    label: 'pln request machinery',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_request_project',
    label: 'pln request project',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_request_supplier',
    label: 'pln request supplier',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_request_other',
    label: 'pln request other',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_released_operational',
    label: 'pln released operational',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_released_machinery',
    label: 'pln released machinery',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_released_project',
    label: 'pln released project',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_released_supplier',
    label: 'pln released supplier',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_released_other',
    label: 'pln released other',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pln_remark',
    label: 'pln remark',
    format: (val) => val || '-',
  },
];

export const powerProblemExportColumns = [
  {
    key: 'ppp_request_date',
    label: 'ppp request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ppp_request_description',
    label: 'ppp request description',
    format: (val) => val || '-',
  },
  {
    key: 'ppp_requested_capacity_new_kw',
    label: 'ppp requested capacity new kw',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'ppp_requested_capacity_additional_kw',
    label: 'ppp requested capacity additional kw',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'ppp_transformer_type_kva',
    label: 'ppp transformer type kva',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'ppp_problem_line_flag',
    label: 'ppp problem line flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_problem_meter_flag',
    label: 'ppp problem meter flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_problem_pole_flag',
    label: 'ppp problem pole flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_problem_other_flag',
    label: 'ppp problem other flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_status_line_flag',
    label: 'ppp status line flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_status_meter_flag',
    label: 'ppp status meter flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_status_pole_flag',
    label: 'ppp status pole flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_status_other_flag',
    label: 'ppp status other flag',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    key: 'ppp_problem_reported_date',
    label: 'ppp problem reported date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ppp_estimated_not_completed_date',
    label: 'ppp estimated not completed date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ppp_estimated_completed_paid_date',
    label: 'ppp estimated completed paid date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ppp_estimated_completed_not_paid_date',
    label: 'ppp estimated completed not paid date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ppp_reason_not_solved',
    label: 'ppp reason not solved',
    format: (val) => val || '-',
  },
  {
    key: 'ppp_problem_solved_date',
    label: 'ppp problem solved date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'ppp_request_status_id',
    label: 'ppp request status id',
    format: (val) => val || '-',
  },
];

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

export const exportedItemExportColumns = [
  {
    key: 'exp_office_name',
    label: 'exp office name',
    format: (val) => val || '-',
  },
  {
    key: 'exp_cpc_desc',
    label: 'exp cpc desc',
    format: (val) => val || '-',
  },
  {
    key: 'exp_assess_date',
    label: 'exp assess date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'exp_tin',
    label: 'exp tin',
    format: (val) => val || '-',
  },
  {
    key: 'exp_trader_name',
    label: 'exp trader name',
    format: (val) => val || '-',
  },
  {
    key: 'exp_trader_addr',
    label: 'exp trader addr',
    format: (val) => val || '-',
  },
  {
    key: 'exp_item_desc',
    label: 'exp item desc',
    format: (val) => val || '-',
  },
  {
    key: 'exp_hs_code',
    label: 'exp hs code',
    format: (val) => val || '-',
  },
  {
    key: 'exp_hs_desc',
    label: 'exp hs desc',
    format: (val) => val || '-',
  },
  {
    key: 'exp_brand_name',
    label: 'exp brand name',
    format: (val) => val || '-',
  },
  {
    key: 'exp_origin_country',
    label: 'exp origin country',
    format: (val) => val || '-',
  },
  {
    key: 'exp_dest_country',
    label: 'exp dest country',
    format: (val) => val || '-',
  },
  {
    key: 'exp_trade_value_etb',
    label: 'exp trade value etb',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'exp_trade_value_usd',
    label: 'exp trade value usd',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'exp_mot_desc',
    label: 'exp mot desc',
    format: (val) => val || '-',
  },
  {
    key: 'exp_net_wt_kg',
    label: 'exp net wt kg',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'exp_remark',
    label: 'exp remark',
    format: (val) => val || '-',
  },
];

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
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pex_agreement_end_year',
    label: 'pex agreement end year',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'pex_contract_duration',
    label: 'pex contract duration',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];

export const projectStatusChangeExportColumns = [
  {
    key: 'psc_activity_date',
    label: 'psc activity date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'psc_remark',
    label: 'psc remark',
    format: (val) => val || '-',
  },
];

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
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
];

export const letterTemplateExportColumns = [
  {
    key: 'ltt_name_or',
    label: 'ltt name or',
    format: (val) => val || '-',
  },
  {
    key: 'ltt_name_am',
    label: 'ltt name am',
    format: (val) => val || '-',
  },
  {
    key: 'ltt_name_en',
    label: 'ltt name en',
    format: (val) => val || '-',
  },
  {
    key: 'ltt_code',
    label: 'ltt code',
    format: (val) => val || '-',
  },
  {
    key: 'ltt_content',
    label: 'ltt content',
    format: (val) => val || '-',
  },
  {
    key: 'ltt_type_id',
    label: 'ltt type id',
    format: (val) => val || '-',
  },
  {
    key: 'ltt_remark',
    label: 'ltt remark',
    format: (val) => val || '-',
  },
];

export const requestExportColumns = [
  {
    key: 'rqt_request_type_id',
    label: 'rqt request type id',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_project_id',
    label: 'rqt project id',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_request_description',
    label: 'rqt request description',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_request_date',
    label: 'rqt request date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'rqt_status_id',
    label: 'rqt status id',
    format: (val) => val || '-',
  },
  {
    key: 'rqt_response_date',
    label: 'rqt response date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'rqt_remark',
    label: 'rqt remark',
    format: (val) => val || '-',
  },
];

export const dutyFreeExportColumns = [
  {
    key: 'dtf_owner_name',
    label: 'dtf_owner_name',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_sex',
    label: 'dtf_sex',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_phone',
    label: 'dtf_phone',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_town',
    label: 'dtf_town',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_zone',
    label: 'dtf_zone',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_tin',
    label: 'dtf_tin',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_town_woreda',
    label: 'dtf_town_woreda',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_project_sector',
    label: 'dtf_project_sector',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_project_type',
    label: 'dtf_project_type',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_commodity_id',
    label: 'dtf_commodity_id',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_specific_name',
    label: 'dtf_specific_name',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_hs_code',
    label: 'dtf_hs_code',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_invoice_amount',
    label: 'dtf_invoice_amount',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_measurement_id',
    label: 'dtf_measurement_id',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_qty',
    label: 'dtf_qty',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_unit_price',
    label: 'dtf_unit_price',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_invoice_amount_birr',
    label: 'dtf_invoice_amount_birr',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_approved_qty',
    label: 'dtf_approved_qty',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_rejected_qty',
    label: 'dtf_rejected_qty',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_tax_forgone',
    label: 'dtf_tax_forgone',
    format: (val) => (val ? `${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'dtf_submission_date',
    label: 'dtf_submission_date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'dtf_approved_date',
    label: 'dtf_approved_date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'dtf_custom_branch',
    label: 'dtf_custom_branch',
    format: (val) => val || '-',
  },
  {
    key: 'dtf_remark',
    label: 'dtf_remark',
    format: (val) => val || '-',
  },
];
