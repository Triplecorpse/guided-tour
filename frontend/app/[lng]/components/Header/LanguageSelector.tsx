"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import { UILanguages } from "@/i18n/settings";
import Image from "next/image";
import { useT } from "@/i18n/client";
import { useChangeLanguage } from "../../../../lib/hooks/useChangeLanguage";

export default function LanguageSelector({
  currentLang,
}: {
  currentLang: string;
}) {
  const changeLanguage = useChangeLanguage();
  const handleChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <FormControl className="languageSelector">
      <Select value={currentLang} onChange={handleChange}>
        {UILanguages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <div className="languageSelector_option">
              <Image
                src={lang.flag}
                alt={`${lang.code} flag`}
                width={20}
                height={20}
                style={{ objectFit: "cover" }}
              />
              <span>{lang.nativeName}</span>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
