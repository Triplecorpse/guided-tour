"use client";

const [{ useRouter }] = await Promise.all([import("next/navigation")]);

export default function Personal() {
  const router = useRouter();

  router.push("/authentication/sign-in");

  return <></>;
}
