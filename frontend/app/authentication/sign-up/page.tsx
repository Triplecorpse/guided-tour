import { Signup } from "@/app/authentication/sign-up/signup";
import AbstractPage from "@/app/authentication/abstract-page";
import { Button } from "@mui/material";
import Links from "@/app/authentication/components/links";

export default function Page() {
  return (
    <AbstractPage>
      <Signup />
      <Links signin={true} signup={false} forgot={true}></Links>
    </AbstractPage>
  );
}
