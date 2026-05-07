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
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'ppp_requested_capacity_additional_kw',
    label: 'ppp requested capacity additional kw',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'ppp_transformer_type_kva',
    label: 'ppp transformer type kva',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
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
