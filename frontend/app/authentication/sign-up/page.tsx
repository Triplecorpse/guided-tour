import { Signup } from "@/app/authentication/sign-up/signup";
import AbstractPage from "@/app/authentication/abstract-page";
import { Button } from "@mui/material";

export default function Page() {
  return (
    <AbstractPage>
      <Signup />
      <div>
        <Button href="/authentication/sign-in">
          Recalled your password? Back to sign In Sign In
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
