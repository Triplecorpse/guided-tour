import { Button } from "@mui/material";

interface AuthenticationFormLinksProps {
  signin: boolean;
  signup: boolean;
  forgot: boolean;
}

export default function Links(view: AuthenticationFormLinksProps) {
  return (
    <div className="mb-4 mt-4 flex gap-8">
      {view.signin && (
        <div>
          <Button href="/authentication/sign-in">Sign In</Button>
        </div>
      )}
      {view.signup && (
        <div>
          <Button href="/authentication/sign-up">Sign up</Button>
        </div>
      )}
      {view.forgot && (
        <div>
          <Button href="/authentication/forgot-password">
            Recover password
          </Button>
        </div>
      )}
    </div>
  );
}
