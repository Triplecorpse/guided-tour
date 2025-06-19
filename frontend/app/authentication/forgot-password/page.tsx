"use client";

const [{ AbstractPage }, { ForgotPassword }, { Links }] = await Promise.all([
  import("@/authentication/abstract-page"),
  import("@/authentication/forgot-password/forgot-password"),
  import("@/authentication/components/links"),
]);

export default function Page() {
  return (
    <AbstractPage state="forgot">
      <ForgotPassword />
      <Links signin={true} signup={true} forgot={false}></Links>
    </AbstractPage>
  );
}
