import { getT } from "@/i18n";
import ClientHeader from "@/[lng]/components/Header/ClientHeader";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { UILanguages } from "@/i18n/settings";
import Image from "next/image";

export async function Header() {
  const { t, i18n } = await getT("header");

  const selectedLanguage = UILanguages.find(
    (lang) => lang.code === i18n.language,
  );

  const handleSelect = function (as) {
    console.log(as);
  };

  return (
    <header>
      <div>Project: GEO</div>
      <ClientHeader></ClientHeader>
      <FormControl className="languageSelector">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedLanguage}
          onChange={handleSelect}
        >
          {UILanguages.map((lang) => {
            return (
              <MenuItem value={lang}>
                <div className="languageSelector_option">
                  <Image
                    src={lang.flag}
                    alt={lang.code + " flag"}
                    width={20}
                    height={20}
                    style={{ objectFit: "cover" }}
                  ></Image>
                  <span>{lang.nativeName}</span>
                </div>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </header>
  );
}
