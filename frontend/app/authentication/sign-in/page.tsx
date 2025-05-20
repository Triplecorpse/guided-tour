import Login from "./login";
import AbstractPage from "@/app/authentication/abstract-page";
import { Button } from "@mui/material";

export default function Page() {
  return (
    <AbstractPage>
      <Login />
      <div>
        <Button href="/authentication/sign-up">
          Don't have an account? Go to sign up
        </Button>
      </div>
      <div>
        <Button href="/authentication/forgot-password">
          Forgot your password? Try to recover it here
        </Button>
      </div>
    </AbstractPage>
  );
}
