"use client";

import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface AuthenticationFormLinksProps {
  signin: boolean;
  signup: boolean;
  forgot: boolean;
}

export function Links(view: AuthenticationFormLinksProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 mt-4 flex gap-8">
      {view.signin && (
        <div>
          <Button href="/authentication/sign-in">
            {t("authentication.signin")}
          </Button>
        </div>
      )}
      {view.signup && (
        <div>
          <Button href="/authentication/sign-up">
            {t("authentication.signup")}
          </Button>
        </div>
      )}
      {view.forgot && (
        <div>
          <Button href="/authentication/forgot-password">
            {t("authentication.recover")}
          </Button>
        </div>
      )}
    </div>
  );
}
