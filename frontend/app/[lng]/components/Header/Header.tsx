import { getT } from "@/i18n";
import ClientHeader from "@/[lng]/components/Header/ClientHeader";
import LanguageSelector from "@/[lng]/components/Header/LanguageSelector";
import Link from "next/link";

export async function Header() {
  const { i18n } = await getT("header");

  return (
    <header>
      <Link href="/">Project: GEO</Link>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ClientHeader></ClientHeader>
        <LanguageSelector currentLang={i18n.language} />
      </div>
    </header>
  );
}
