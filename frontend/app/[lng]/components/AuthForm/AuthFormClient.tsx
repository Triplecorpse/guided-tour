"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Fade,
  Stack,
  Paper,
} from "@mui/material";

type Mode = "signin" | "signup" | "forgot";

export default function AuthFormClient() {
  const [mode, setMode] = useState<Mode>("signin");

  const handleSwitch = (newMode: Mode) => setMode(newMode);

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
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              noValidate
            >
              {mode === "signup" && <TextField label="Full Name" required />}
              <TextField label="Email" type="email" required />
              {(mode === "signin" || mode === "signup") && (
                <TextField label="Password" type="password" required />
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
            </Box>

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
