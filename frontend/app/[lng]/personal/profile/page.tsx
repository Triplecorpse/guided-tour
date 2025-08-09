"use client";

import React from "react";
import { useT } from "@/i18n/client";
import {
  Box,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Typography,
  ListItemButton,
  ListItemText,
  Stack,
  Grid,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

export default function ProfilePage() {
  const methods = useForm();
  const { t } = useT("profile");

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
                    />
                  }
                  label={t("fields.enable2fa")}
                />

                {/* Divider */}
                <Divider />

                {/* Google button (no handlers yet) */}
                <Button
                  variant="outlined"
                  startIcon={
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      style={{ width: 18, height: 18 }}
                    />
                  }
                >
                  {t("buttons.google")}
                </Button>
              </Stack>
            </Box>
          </FormProvider>
        </Box>
      </Grid>
    </Grid>
  );
}
