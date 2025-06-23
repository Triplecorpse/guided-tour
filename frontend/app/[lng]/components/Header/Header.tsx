import { getT } from "@/i18n";
import ClientHeader from "@/[lng]/components/Header/ClientHeader";
import LanguageSelector from "@/[lng]/components/Header/LanguageSelector";

export async function Header() {
  const { i18n } = await getT("header");

  return (
    <header>
      <div>Project: GEO</div>
      <ClientHeader></ClientHeader>
      <LanguageSelector currentLang={i18n.language} />
    </header>
  );
}
