import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import i18n, { languages } from '../../../i18n';

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('I18N_LANGUAGE') || 'en';
  });

  const changeLanguageAction = (lang) => {
    const value = lang.value;

    i18n.changeLanguage(value);
    localStorage.setItem('I18N_LANGUAGE', value);
    setSelectedLang(value);
  };

  const languagesArray = Object.entries(languages).map(([value, lang]) => ({
    value,
    ...lang,
  }));

  const selectedLangObj = languagesArray.find(
    (lang) => lang.value === selectedLang
  );

  return (
    <Dropdown className="d-inline-block">
      <Dropdown.Toggle variant="transparent" className="header-item">
        {selectedLangObj && (
          <img
            src={selectedLangObj.flag}
            alt={selectedLangObj.label}
            height="16"
            className="me-1"
          />
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-end">
        {languagesArray.map((lang) => (
          <Dropdown.Item
            key={lang.value}
            onClick={() => changeLanguageAction(lang)}
            active={selectedLang === lang.value}
            className="notify-item"
          >
            <img
              src={lang.flag}
              alt={lang.label}
              className="me-1"
              height="12"
            />
            <span className="align-middle">{lang.label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
