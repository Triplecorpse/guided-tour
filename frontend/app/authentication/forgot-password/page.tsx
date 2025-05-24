import AbstractPage from "@/authentication/abstract-page";
import { ForgotPassword } from "@/authentication/forgot-password/forgot-password";
import Links from "@/authentication/components/links";

export default function Page() {
  return (
    <AbstractPage state="forgot">
      <ForgotPassword />
      <Links signin={true} signup={true} forgot={false}></Links>
    </AbstractPage>
  );
}
