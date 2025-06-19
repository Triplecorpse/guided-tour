import Link from "next/link";
import { useSSR } from "react-i18next";

export function Header() {
  const { t } = useSSR();

  return (
    <header>
      <div>Project: GEO</div>
      <div>
        <Link href="/personal">t("public_pages.account")</Link>
      </div>
    </header>
  );
}
