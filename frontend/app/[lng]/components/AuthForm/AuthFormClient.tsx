"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ROUTES } from "@/config";
import { useFormContext } from "react-hook-form";
import { useT } from "@/i18n/client";

type Mode = "signin" | "signup" | "forgot";

const endpoints = {
  signup: ROUTES.authentication.signup,
  signin: ROUTES.authentication.signin,
  forgot: ROUTES.authentication.forgot,
};

export default function AuthFormClient() {
  const [mode, setMode] = useState<Mode>("signin");
  const [fetching, setFetching] = useState<boolean>(false);
  const [endpoint, setEndpoint] = useState<string>(
    ROUTES.authentication.signin,
  );

  const { t } = useT("authentication-form");

  useEffect(() => {
    setEndpoint(endpoints[mode]);
  }, [mode]);

  const { register, formState, handleSubmit } = useFormContext();

  const handleSwitch = (newMode: Mode) => setMode(newMode);

  const onSubmit = (formData: {
    email?: string;
    name?: string;
    password?: string;
  }) => {
    setFetching(true);
    fetch(endpoint, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("fetch successfull", data);
      })
      .catch((err) => console.log(err))
      .finally(() => setFetching(false));
  };

  return (
    <Box
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        width: 400,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 3,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          {mode === "signin" && "Sign In"}
          {mode === "signup" && "Sign Up"}
          {mode === "forgot" && "Forgot Password"}
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          color="text.secondary"
        >
          {mode === "signin" && "Welcome back! Please log in."}
          {mode === "signup" && "Create a new account below."}
          {mode === "forgot" && "Enter your email to receive a reset link."}
        </Typography>

        <Fade in timeout={300} key={mode}>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
              noValidate
            >
              {mode === "signup" && (
                <TextField
                  error={!!formState.errors.name}
                  id="name"
                  label="Full Name"
                  {...register("name", {
                    required: t("errors.required"),
                  })}
                />
              )}
              {formState.errors.name && (
                <p className="text-mui-error text-sm">
                  {formState.errors.name.message as string}
                </p>
              )}
              <TextField
                error={!!formState.errors.email}
                id="email"
                label="Email"
                type="email"
                {...register("email", {
                  required: t("errors.required"),
                })}
              />
              {formState.errors.email && (
                <p className="text-mui-error text-sm">
                  {formState.errors.email.message as string}
                </p>
              )}
              {(mode === "signin" || mode === "signup") && (
                <TextField
                  error={!!formState.errors.password}
                  id="password"
                  label="Password"
                  type="password"
                  {...register("password", {
                    required: t("errors.required"),
                  })}
                />
              )}
              {formState.errors.password && (
                <p className="text-mui-error text-sm">
                  {formState.errors.password.message as string}
                </p>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Sign Up"}
                {mode === "forgot" && "Send Reset Link"}
              </Button>
            </form>

            <Stack spacing={1} mt={3} textAlign="center">
              {mode !== "signin" && (
                <Button
                  className="!text-white"
                  variant="text"
                  size="small"
                  onClick={() => handleSwitch("signin")}
                >
                  Already have an account? Sign In
                </Button>
              )}
              {mode !== "signup" && (
                <Button
                  className="!text-white"
                  variant="text"
                  size="small"
                  onClick={() => handleSwitch("signup")}
                >
                  Need an account? Sign Up
                </Button>
              )}
              {mode !== "forgot" && (
                <Button
                  className="!text-white"
                  variant="text"
                  size="small"
                  onClick={() => handleSwitch("forgot")}
                >
                  Forgot your password?
                </Button>
              )}
            </Stack>
          </div>
        </Fade>
      </Paper>
    </Box>
  );
}
