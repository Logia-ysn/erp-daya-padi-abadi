import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import id from './id.json';

const savedLanguage = localStorage.getItem('language') || 'id';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            id: { translation: id },
        },
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
