import { getT } from "@/i18n";
import { Header } from "@/[lng]/components/Header";

export async function generateMetadata() {
  const { t } = await getT("main-page");
  return { title: t("title") };
}

export default async function Page() {
  const { t } = await getT("main-page");
  console.log("page is on site");
  return (
    <>
      <Header></Header>
      <main>{t("h1")}</main>
    </>
  );
}
