"use client";

import i18n from "i18next";
import { useRouter, usePathname } from "next/navigation";

export function useChangeLanguage() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = async (newLang: string) => {
    await i18n.changeLanguage(newLang);

    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/");

    router.push(newPath);
  };

  return changeLanguage;
}
