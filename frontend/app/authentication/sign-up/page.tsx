"use client";

const [{ Signup }, { AbstractPage }, { Links }] = await Promise.all([
  import("@/authentication/sign-up/signup"),
  import("@/authentication/abstract-page"),
  import("@/authentication/components/links"),
]);

export default function Page() {
  return (
    <AbstractPage state="signup">
      <Signup />
      <Links signin={true} signup={false} forgot={true}></Links>
    </AbstractPage>
  );
}
