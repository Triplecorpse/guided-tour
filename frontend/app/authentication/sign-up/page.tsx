import { Signup } from "@/authentication/sign-up/signup";
import AbstractPage from "@/authentication/abstract-page";
import Links from "@/authentication/components/links";

export default function Page() {
  return (
    <AbstractPage>
      <Signup />
      <Links signin={true} signup={false} forgot={true}></Links>
    </AbstractPage>
  );
}
