import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import eth from './assets/images/flags/eth.png';
import oro from './assets/images/flags/oromia.png';
import usFlag from './assets/images/flags/us.jpg';
import translationIT from './locales/am/translation.json';
import translationENG from './locales/eng/translation.json';
import translationGr from './locales/or/translation.json';

// the translations
const resources = {
  eng: {
    translation: translationENG,
  },
  or: {
    translation: translationGr,
  },
  am: {
    translation: translationIT,
  },
};

const language = localStorage.getItem('I18N_LANGUAGE');
if (!language) {
  localStorage.setItem('I18N_LANGUAGE', 'eng');
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('I18N_LANGUAGE') || 'eng',
    fallbackLng: 'eng', // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const languages = {
  en: {
    label: 'English',
    flag: usFlag,
  },
  or: {
    label: 'Afan Oromo',
    flag: oro,
  },
  am: {
    label: 'Amharic',
    flag: eth,
  },
};

export default i18n;
