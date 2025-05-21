import Login from "./login";
import AbstractPage from "@/app/authentication/abstract-page";
import { Button } from "@mui/material";
import Links from "@/app/authentication/components/links";

export default function Page() {
  return (
    <AbstractPage>
      <Login />
      <Links signin={false} signup={true} forgot={true}></Links>
    </AbstractPage>
  );
}
