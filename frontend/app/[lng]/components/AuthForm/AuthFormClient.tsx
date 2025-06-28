"use client";

import { useState, useEffect, useRef } from "react";
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
  const [formError, setFormError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [endpoint, setEndpoint] = useState<string>(
    ROUTES.authentication.signin,
  );
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const { t } = useT("authentication-form");

  useEffect(() => {
    setEndpoint(endpoints[mode]);
  }, [mode]);

  useEffect(() => {
    if (!position && boxRef.current) {
      const box = boxRef.current;
      const { innerWidth, innerHeight } = window;
      const rect = box.getBoundingClientRect();
      setPosition({
        x: innerWidth / 2 - rect.width / 2,
        y: innerHeight / 2 - rect.height / 2,
      });
    }
  }, [boxRef, position]);

  const { register, formState, handleSubmit, setError } = useFormContext();

  const handleSwitch = (newMode: Mode) => setMode(newMode);

  const onSubmit = (formData: {
    email?: string;
    name?: string;
    password?: string;
  }) => {
    setFetching(true);
    setFormError(null);
    fetch(endpoint, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        full_name: formData.name,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("fetch result", data);
        if (data.error) {
          const errKey: string = data.message;
          const errors = Object.keys(data.data);
          errors.forEach((err: any) => {
            setError(err.type ?? err, {
              type: "manual",
              message: t(`errors.${errKey}`),
            });
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setFetching(false));
  };

  const clampPosition = (x: number, y: number) => {
    if (!boxRef.current) return { x, y };
    const box = boxRef.current;
    const { innerWidth, innerHeight } = window;
    const rect = box.getBoundingClientRect();
    const minX = 0;
    const minY = 0;
    const maxX = innerWidth - rect.width;
    const maxY = innerHeight - rect.height;
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    document.body.style.userSelect = "none";
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const unclamped = {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      };
      setPosition(clampPosition(unclamped.x, unclamped.y));
    }
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <Box
      ref={boxRef}
      onMouseDown={handleMouseDown}
      sx={{
        position: "absolute",
        left: position ? position.x : "50%",
        top: position ? position.y : "50%",
        transform: position ? "none" : "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        width: 400,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: 1300,
      }}
      className="draggable-auth-form"
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
