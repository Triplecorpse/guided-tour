import { getT } from "@/i18n";
import ClientHeader from "@/[lng]/components/Header/ClientHeader";
import LanguageSelector from "@/[lng]/components/Header/LanguageSelector";
import Link from "next/link";
import Divider from "@mui/material/Divider";

export async function Header() {
  const { t, i18n } = await getT("header");

  const flexStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <header>
      <div style={flexStyles}>
        <Link href="/">Project: GEO</Link>
        <Divider orientation="vertical" flexItem />
        <div style={flexStyles}>
          <Link href="/personal/users">{t("nav.users")}</Link>
        </div>
      </div>
      <div style={flexStyles}>
        <ClientHeader></ClientHeader>
        <LanguageSelector currentLang={i18n.language} />
      </div>
    </header>
  );
}
