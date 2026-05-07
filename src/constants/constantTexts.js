import i18n from '../i18n';
const t = i18n.t.bind(i18n);

import logo from '../../src/assets/images/logo.png';

// Application Texts
export const APP_NAME = 'PROJECT Management';
export const FOOTER_TEXT = 'Design & Develop by LT ICT Solution PLC';
export const COPYRIGHT_YEAR = new Date().getFullYear();

// Logo files
export { logo };

// Colors
export const COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#f0f0f0',
  text: '#333',
};

// Other UI Constants
export const BUTTON_LABELS = {
  submit: 'Submit',
  cancel: 'Cancel',
  pick: 'Pick',
};

export const NAVBAR_TEXTS = {
  home: 'Home',
  about: 'About Us',
  contact: 'Contact',
};
// Termination = 88 , Extension = 85 , Status Change = 87
export const PAGE_ID = {
  MONITORING: 11,
  ROLE: 19,
  SECTOR: 20,
  USER: 21,
  USER_ROLE: 22,
  ADDRESS: 24,
  DOCUMENT: 26,
  LOOKUP: 29,
  LOOKUP_TYPE: 34,
  ACCESS_LOG: 36,
  PROJECT: 37,
  INVESTOR: 38,
  PERMISSION: 44,
  DEPARTMENT: 53,
  LOAN: 54,
  DEMAND: 80,
  POWER_PROBLEM: 81,
  TERMINATION: 88,
  EXTENSION: 85,
  STATUS_CHANGE: 87,
  REQUEST: 10,
};

export const ACTIVITY_TYPES = {
  INITIAL_REGISTRATION: 1,
  MONITORING: 2,
  EXPANSION: 3,
  EXTENSION: 4,
  TERMINATION: 5,
  MANUAL_CHANGE: 6,
};

//Login Page Constants
export const LOGIN_TITLE = 'Project Management System';
export const BUREAU_NAME = 'Oromia Investment and Industry Bureau';

//monitoring types

export const MONITORING_TYPES = {
  FOLLOW_UP: 1,
  EXTENSION: 2,
  TERMINATION: 3,
};

export const MONITORING_TYPE_OPTIONS = {
  [MONITORING_TYPES.FOLLOW_UP]: t('follow_up'),
  [MONITORING_TYPES.EXTENSION]: t('extension'),
  [MONITORING_TYPES.TERMINATION]: t('termination'),
};

export const getMonitoringTypeLabel = (type) => {
  const labels = {
    [MONITORING_TYPES.FOLLOW_UP]: t('follow_up'),
    [MONITORING_TYPES.EXTENSION]: t('extension'),
    [MONITORING_TYPES.TERMINATION]: t('termination'),
  };
  return labels[type] || '';
};
