import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "@/i18n/en/_collective";
import { fr } from "@/i18n/fr/_collective";

const resources = {
  en: {
    translation: {
      ...en,
    },
  },
  fr: {
    translation: {
      ...fr,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
