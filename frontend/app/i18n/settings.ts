export const fallbackLng: string = "en";
export const languages: string[] = [fallbackLng, "uk"];
export const defaultNS: string = "main-page";
export const cookieName: string = "i18next";
export const headerName: string = "x-i18next-current-language";

type UILanguage = {
  code: (typeof languages)[number];
  nativeName: string;
  flag: string;
};

export const UILanguages: UILanguage[] = [
  {
    code: "en",
    nativeName: "English",
    flag: "/images/lang-flags/English_language.svg",
  },
  {
    code: "uk",
    nativeName: "Українська",
    flag: "/images/lang-flags/Flag_of_Ukraine.svg",
  },
];
