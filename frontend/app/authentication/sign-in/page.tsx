"use client";

import Login from "./login";
import AbstractPage from "@/authentication/abstract-page";
import Links from "@/authentication/components/links";

export default function Page() {
  return (
    <AbstractPage>
      <Login />
      <Links signin={false} signup={true} forgot={true}></Links>
    </AbstractPage>
  );
}
