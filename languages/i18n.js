import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./en";
import vnTranslations from "./vn";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    vn: {
      translation: vnTranslations,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
