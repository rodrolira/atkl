import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import classNames from 'classnames';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageMenuProps {
  className?: string;
}

const LanguageMenu: React.FC<LanguageMenuProps> = () => {
  const { t, i18n } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('language');
    
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    setSelectedLanguage(savedLanguage || language);
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n, language]);

  // Memoized language change handler
  const handleChangeLanguage = useCallback((languageCode: string) => {
    changeLanguage(languageCode);
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setMenuVisibility(false);
  }, [changeLanguage, i18n]);

  // Memoized ReactCountryFlag for US
  const usFlag = useMemo(() => (
    <ReactCountryFlag
      className="max-[320px]:!me-0 flag-icon !w-auto"
      countryCode="US"
      svg
      title="US"
      alt="Flag of the United States"
    />
  ), []);

  // Memoized main ReactCountryFlag to prevent unnecessary re-renders
  const mainFlag = useMemo(() => (
    <ReactCountryFlag
      alt={selectedLanguage === 'en' ? 'US' : 'es'}
      className="max-[320px]:ms-[0.5rem] flag-icon h-[1em] !w-auto"
      countryCode={selectedLanguage === 'en' ? 'US' : 'ES'}
      svg
      title={selectedLanguage === 'en' ? 'US' : 'es'}
    />
  ), [selectedLanguage]);

  return (
    <div className="relative z-50">
      <div
        className="h-full"
        onMouseEnter={() => setMenuVisibility(true)}
        onMouseLeave={() => setMenuVisibility(false)}
      >
        <button
          type="button"
          className="max-[320px]:ms-2 md:text-xs inline-flex items-center font-medium justify-center h-full mx-4 my-2 lg:text-sm text-white rounded-t-lg cursor-pointer hover:bg-green-700 hover:text-white"
        >
          {mainFlag}
        </button>

        <div
          className={classNames(
            'lg:text-sm md:text-xs z-50 absolute top-0 text-base list-none w-full divide-y divide-gray-100 rounded-b-xl rounded-t-xl hover:rounded-t-xl shadow bg-green-700 max-[320px]:ms-2',
            { 'block': isMenuVisible, 'hidden': !isMenuVisible }
          )}
          role="menu"
        >
          <ul className="font-medium" role="none">
            <li>
              <button
                type="button"
                className={classNames(
                  'block px-2 py-2 lg:text-sm md:text-xs w-full text-white hover:bg-green-600 rounded-t-xl',
                  { '!bg-green-600': selectedLanguage === 'en' }
                )}
                onClick={() => handleChangeLanguage('en')}
              >
                <div className="inline-flex items-center">
                  {usFlag}
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={classNames(
                  'block px-2 py-2 text-sm w-full text-white hover:rounded-b-xl hover:bg-green-600 rounded-b-xl',
                  { '!bg-green-600': selectedLanguage === 'es' }
                )}
                onClick={() => handleChangeLanguage('es')}
              >
                <div className="inline-flex items-center">
                  <ReactCountryFlag
                    className="max-[320px]:!me-0 lg:text-sm md:text-xs flag-icon !w-auto"
                    countryCode="ES"
                    svg
                    title="ES"
                    alt="Flag of Spain"  
                  />
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with React.memo
export default memo(LanguageMenu);
