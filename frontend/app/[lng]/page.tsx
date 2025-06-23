import { getT } from "@/i18n";

export async function generateMetadata() {
  const { t } = await getT("main-page");
  return { title: t("title") };
}

export default async function Page() {
  const { t } = await getT("main-page");
  return <>{t("h1")}</>;
}
