"use client";

import "@/i18n/i18n";
import { TextField } from "@mui/material";

interface AuthenticationFormProps {
  email: boolean;
  password: boolean;
  name: boolean;
}

import { useTranslation } from "react-i18next";

export function AuthenticationForm(view: AuthenticationFormProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="mb-4">
        {view.email && (
          <TextField
            className="w-full"
            id="email"
            name="email"
            label={t("email")}
            variant="standard"
            required={true}
          />
        )}
      </div>
      <div className="mb-4">
        {view.name && (
          <TextField
            className="w-full"
            id="name"
            name="name"
            label={t("name")}
            variant="standard"
            required={true}
          />
        )}
      </div>
      <div className="mb-4">
        {view.password && (
          <TextField
            className="w-full"
            id="password"
            name="password"
            type="password"
            label={t("password")}
            variant="standard"
            required={true}
          />
        )}
      </div>
    </div>
  );
}
