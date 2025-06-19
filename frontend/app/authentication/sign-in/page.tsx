"use client";

const [{ Login }, { AbstractPage }, { Links }] = await Promise.all([
  import("@/authentication/sign-in/login"),
  import("@/authentication/abstract-page"),
  import("@/authentication/components/links"),
]);

export default function Page() {
  return (
    <AbstractPage state="signin">
      <Login />
      <Links signin={false} signup={true} forgot={true}></Links>
    </AbstractPage>
  );
}
