import AbstractPage from "@/app/authentication/abstract-page";
import { ForgotPassword } from "@/app/authentication/forgot-password/forgot-password";
import { Button } from "@mui/material";

export default function Page() {
  return (
    <AbstractPage>
      <ForgotPassword />
      <div>
        <Button href="/authentication/sign-in">
          Recalled your password? Back to sign In
        </Button>
      </div>
      <div>
        <Button href="/authentication/sign-up">
          Don't have an account? Go to sign up
        </Button>
      </div>
    </AbstractPage>
  );
}
