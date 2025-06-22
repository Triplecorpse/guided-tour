import { getT } from "@/i18n";
import ClientHeader from "@/[lng]/components/ClientHeader";

export async function Header() {
  const { t, i18n } = await getT("header");
  return (
    <header>
      <div>Project: GEO</div>
      <ClientHeader></ClientHeader>
    </header>
  );
}
