import Link from "next/link";
import { getT } from "@/i18n";

export async function Header() {
  const { t, i18n } = await getT("header");

  return (
    <header>
      <div>Project: GEO</div>
      <div>
        <Link href="/personal">{t("personal")}</Link>
      </div>
    </header>
  );
}
