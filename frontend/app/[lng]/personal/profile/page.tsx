"use client";

import React, { useState } from "react";
import { useT } from "@/i18n/client";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  ListItemButton,
  ListItemText,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import GoogleAuthButton from "@/[lng]/components/GoogleAuthButton/GoogleAuthButton";
import { ROUTES } from "@/config";
import { post } from "@/services/api.service";

export default function ProfilePage() {
  const methods = useForm();
  const { t } = useT("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string>("");

  const handle2FAToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;

    // Only show modal when switching from off to on
    if (isEnabled) {
      void (async () => {
        try {
          // Call the 2FA generate-secret endpoint
          const response = await fetch(ROUTES.authentication.generateSecret, {
            method: "POST",
            credentials: "include",
          });

          if (response.ok) {
            // The response is an image, create a blob URL
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setQrCodeUrl(imageUrl);
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error("Error generating 2FA secret:", error);
          // Reset the switch if there's an error
          methods.setValue("enable2fa", false);
        }
      })();
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) return;

    setIsVerifying(true);
    setVerificationError("");

    try {
      const result = await post(ROUTES.authentication.verify2fa, {
        code: verificationCode,
      });

      console.log(result);

      if (!result.error) {
        setIsModalOpen(false);
        setVerificationCode("");
        if (qrCodeUrl) {
          URL.revokeObjectURL(qrCodeUrl);
          setQrCodeUrl("");
        }
      } else {
        setVerificationError(t("messages.verificationError"));
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      setVerificationError(t("messages.verificationError"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={4}>
        <ListItemButton component="a" href="#security-settings">
          <ListItemText primary={t("nav.securitySettings")} />
        </ListItemButton>
      </Grid>
      <Grid
        xs={12}
        md={8}
        sx={{
          borderLeft: { md: 1, xs: 0 },
          borderColor: "divider",
          pl: { md: 2 },
        }}
      >
        <Box sx={{ p: 3 }} id="security-settings">
          <Typography variant="h6" gutterBottom>
            {t("titles.securitySettings")}
          </Typography>
          <FormProvider {...methods}>
            <Box component="form" noValidate>
              <Stack spacing={2}>
                {/* Email */}
                <TextField
                  id="email"
                  label={t("fields.email")}
                  type="email"
                  {...methods.register("email")}
                />

                {/* Password + SET button inline */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    id="password"
                    label={t("fields.password")}
                    type="password"
                    fullWidth
                    {...methods.register("password")}
                  />
                  <Button variant="contained" type="button">
                    {t("buttons.set")}
                  </Button>
                </Stack>

                {/* Divider */}
                <Divider />

                {/* Enable 2FA toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      {...methods.register("enable2fa")}
                      onChange={handle2FAToggle}
                    />
                  }
                  label={t("fields.enable2fa")}
                />

                {/* Divider */}
                <Divider />

                {/* Google authentication button with handlers */}
                <GoogleAuthButton variant="outlined" />
              </Stack>
            </Box>
          </FormProvider>
        </Box>

        {/* 2FA Setup Modal */}
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setVerificationCode("");
            setVerificationError("");
            if (qrCodeUrl) {
              URL.revokeObjectURL(qrCodeUrl);
              setQrCodeUrl("");
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {t("titles.setup2fa")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t("messages.scan2faCode")}
            </Typography>
            {qrCodeUrl && (
              <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
                <img
                  src={qrCodeUrl}
                  alt="2FA QR Code"
                  style={{ maxWidth: "100%" }}
                />
              </Box>
            )}
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t("messages.enterCode")}
            </Typography>
            <TextField
              label={t("fields.verificationCode")}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              fullWidth
              inputProps={{
                maxLength: 6,
                pattern: "[0-9]*",
              }}
              placeholder="000000"
              sx={{ mt: 2, mb: 2 }}
            />
            {/* Reserved space for error message to prevent UI jumping */}
            <Box sx={{ minHeight: 48, mb: 2 }}>
              {verificationError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {verificationError}
                </Alert>
              )}
            </Box>
            <Button
              variant="contained"
              fullWidth
              disabled={verificationCode.length !== 6 || isVerifying}
              onClick={() => void handleVerifyCode()}
            >
              {isVerifying ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("buttons.close")
              )}
            </Button>
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
}
