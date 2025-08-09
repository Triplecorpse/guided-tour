"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/../lib/store";
import { checkAuth } from "@/../lib/slices/AuthSlice";
import { post } from "@/services/api.service";
import { getGoogleIdToken } from "@/services/googleAuth.service";
import { ROUTES } from "@/config";
import { useT } from "@/i18n/client";

interface GoogleAuthButtonProps {
  onMouseDown?: (e: React.MouseEvent) => void;
  variant?: "contained" | "outlined" | "text";
  fullWidth?: boolean;
  sx?: any;
  className?: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export default function GoogleAuthButton({
  onMouseDown,
  variant = "outlined",
  fullWidth = false,
  sx,
  className,
  onError,
  onSuccess,
}: GoogleAuthButtonProps) {
  const [fetching, setFetching] = useState<boolean>(false);
  const { t } = useT("authentication-form");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoogleAuth = async () => {
    try {
      setFetching(true);

      // Get Google ID token
      const googleToken = await getGoogleIdToken();

      // Send token to backend
      const response = (await post(ROUTES.authentication.google, {
        token: googleToken,
      })) as any;

      if (response.error) {
        const errorMessage = t("errors.googleAuth");
        if (onError) {
          onError(errorMessage);
        }
      } else {
        // Handle successful authentication
        dispatch(checkAuth()).then(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/personal");
          }
        });
      }
    } catch (error) {
      console.error("Google auth error:", error);
      const errorMessage = t("errors.googleAuth");
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setFetching(false);
    }
  };

  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      startIcon={
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: 18, height: 18 }}
        />
      }
      sx={{
        borderColor: "rgba(0, 0, 0, 0.23)",
        backgroundColor: "rgba(255, 255, 255)",
        color: "text.primary",
        textTransform: "none",
        ...sx,
      }}
      onMouseDown={onMouseDown}
      onClick={handleGoogleAuth}
      disabled={fetching}
      className={className}
    >
      {t("buttons.google")}
    </Button>
  );
}
