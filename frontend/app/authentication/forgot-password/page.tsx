import AbstractPage from "@/app/authentication/abstract-page";
import { ForgotPassword } from "@/app/authentication/forgot-password/forgot-password";
import { Button } from "@mui/material";
import Links from "@/app/authentication/components/links";

export default function Page() {
  return (
    <AbstractPage>
      <ForgotPassword />
      <Links signin={true} signup={true} forgot={false}></Links>
    </AbstractPage>
  );
}
