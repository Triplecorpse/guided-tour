import Link from "next/link";
import { getT } from "@/i18n";
import { checkAuthServer } from "@/../lib/auth/checkAuthServer";

export async function Header() {
  const { t, i18n } = await getT("header");
  const user = await checkAuthServer();

  console.log("dfsfsdjkfsdkl");
  console.log(user);

  return (
    <header>
      <div>Project: GEO</div>
      <div>{user?.name}</div>
      <div>{user && <Link href="/personal">{t("personal")}</Link>}</div>
    </header>
  );
}
