"use client";

const [{ useRouter }, { DashboardPage }] = await Promise.all([
  import("next/navigation"),
  import("@/personal/dashboard/page"),
]);

export default function Personal() {
  const router = useRouter();

  if (!localStorage.Auth) {
    router.push("/authentication/sign-in");
  } else {
    return <DashboardPage />;
  }

  return <></>;
}
