import React, { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageMenu = () => {
  const { t, i18n } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setSelectedLanguage(savedLanguage);
    }
  }, [i18n]);
  const handleChangeLanguage = (languageCode) => {
    changeLanguage(languageCode);
    i18n.changeLanguage(languageCode); // Cambiar idioma en i18next
    localStorage.setItem('language', languageCode); // Guardar en localStorage
    setSelectedLanguage(languageCode);
    setMenuVisibility(false);
  };

  return (
    <div className="relative z-50">
      <div
        className="h-full"
        onMouseEnter={() => setMenuVisibility(true)}
        onMouseLeave={() => setMenuVisibility(false)}
      >
        <button
          type="button"
          className="max-[320px]:ms-2 md:text-xs inline-flex items-center font-medium justify-center h-full px-4 py-2 lg:text-sm text-white rounded-t-lg cursor-pointer hover:bg-green-700 hover:text-white"
        >
          <ReactCountryFlag
            className="max-[320px]:ms-[0.5rem]"
            countryCode={selectedLanguage === 'en' ? 'US' : 'ES'}
            svg
            style={{
              width: '1.5em',
              height: '1.5em',
              marginInlineEnd: '0.5rem',
            }}
            title={selectedLanguage === 'en' ? 'US' : 'ES'}
          />
          <span className="inline-block lg:text-sm md:text-xs">
            {t('languageMenu.language')}
          </span>
        </button>

        <div
          className={`${
            isMenuVisible ? 'block' : 'hidden'
          } lg:text-sm md:text-xs z-50 absolute top-0 text-base list-none w-full divide-y divide-gray-100 rounded-b-xl rounded-t-xl hover:rounded-t-xl shadow bg-green-700 max-[320px]:ms-2`}
          role="menu"
        >
          <ul className="font-medium" role="none">
            <li>
              <button
                type="button"
                className={`block px-2 py-2 lg:text-sm md:text-xs w-full text-white hover:bg-green-600 rounded-t-xl ${
                  selectedLanguage === 'en' ? '!bg-green-600' : ''
                }`}
                onClick={() => handleChangeLanguage('en')}
              >
                <div className="inline-flex items-center">
                  <ReactCountryFlag
                    className="max-[320px]:!me-0"
                    countryCode="US"
                    svg
                    style={{
                      width: '1.5em',
                      height: '1.5em',
                      marginInlineEnd: '0.5rem',
                    }}
                    title="US"
                  />
                  <span className="max-[320px]:hidden lg:text-sm md:text-xs">
                    {t('languageMenu.english')}
                  </span>
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`block px-2 py-2 text-sm w-full text-white hover:rounded-b-xl hover:bg-green-600 rounded-b-xl ${
                  selectedLanguage === 'es' ? '!bg-green-600' : ''
                }`}
                onClick={() => handleChangeLanguage('es')}
              >
                <div className="inline-flex items-center">
                  <ReactCountryFlag
                    className="max-[320px]:!me-0 lg:text-sm md:text-xs"
                    countryCode="ES"
                    svg
                    style={{
                      width: '1.5em',
                      height: '1.5em',
                      marginInlineEnd: '0.5rem',
                    }}
                    title="ES"
                  />
                  <span className="max-[320px]:hidden lg:text-sm md:text-xs">
                    {t('languageMenu.spanish')}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageMenu;
