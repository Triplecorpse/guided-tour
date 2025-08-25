"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Fade,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ROUTES } from "@/config";
import { useFormContext } from "react-hook-form";
import { useT } from "@/i18n/client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/../lib/store";
import { checkAuth } from "@/../lib/slices/AuthSlice";
import Divider from "@mui/material/Divider";
import GoogleAuthButton from "@/[lng]/components/GoogleAuthButton/GoogleAuthButton";

type Mode = "signin" | "signup" | "forgot" | "2fa";

const endpoints = {
  signup: ROUTES.authentication.signup,
  signin: ROUTES.authentication.signin,
  forgot: ROUTES.authentication.forgot,
  "2fa": ROUTES.authentication.verify2fa,
};

export default function AuthFormClient() {
  const [mode, setMode] = useState<Mode>("signin");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [show2FA, setShow2FA] = useState<boolean>(false);
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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

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

  const { register, formState, handleSubmit, setError, resetField } =
    useFormContext();

  const handleSwitch = (newMode: Mode) => setMode(newMode);

  const onSubmit = (formData: {
    email?: string;
    name?: string;
    password?: string;
    code?: string;
    verificationCode?: string;
  }) => {
    setFetching(true);
    setFormError(null);

    const requestBody =
      mode === "2fa"
        ? { code: formData.verificationCode }
        : {
            email: formData.email,
            full_name: formData.name,
            password: formData.password,
          };

    fetch(endpoint, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          const errKey: string = data.message;
          const errors = Object.keys(data.data);
          errors.forEach((err: any) => {
            setError(err.type ?? err, {
              type: "manual",
              message: t(`errors.${errKey}`),
            });
          });
        } else {
          switch (mode) {
            case "signin":
              // Check if 2FA is required
              if (data.isTFARequired) {
                setShow2FA(true);
                setMode("2fa");
              } else {
                // After successful sign-in, check auth to get user data
                dispatch(checkAuth()).then(() => {
                  router.push("/personal");
                });
              }
              break;
            case "2fa":
              // After successful 2FA verification, check auth and redirect
              dispatch(checkAuth()).then(() => {
                router.push("/personal");
              });
              break;
            case "signup":
              setSuccessMessage(t("success.signup"));
              resetField("name");
              resetField("password");

              setMode("signin");

              break;
            case "forgot":
              setSuccessMessage(t("success.forgotPassword"));
              break;
            default:
              setSuccessMessage(null);
          }
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

  const handleFormMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    setSuccessMessage(null);
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
    <>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
        message="Note archived"
      >
        <Alert severity="success">{successMessage ?? "Whatever"}</Alert>
      </Snackbar>
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
            {t(`titles.${mode}`)}
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="text.secondary"
          >
            {t(`descriptions.${mode}`)}
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
                    onMouseDown={handleFormMouseDown}
                    id="name"
                    label={t("fields.fullName")}
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
                {mode !== "2fa" && (
                  <TextField
                    error={!!formState.errors.email}
                    onMouseDown={handleFormMouseDown}
                    id="email"
                    label={t("fields.email")}
                    type="email"
                    {...register("email", {
                      required: t("errors.required"),
                    })}
                  />
                )}
                {formState.errors.email && mode !== "2fa" && (
                  <p className="text-mui-error text-sm">
                    {formState.errors.email.message as string}
                  </p>
                )}
                {(mode === "signin" || mode === "signup") && (
                  <TextField
                    error={!!formState.errors.password}
                    onMouseDown={handleFormMouseDown}
                    id="password"
                    label={t("fields.password")}
                    type="password"
                    {...register("password", {
                      required: t("errors.required"),
                    })}
                  />
                )}
                {formState.errors.password && mode !== "2fa" && (
                  <p className="text-mui-error text-sm">
                    {formState.errors.password.message as string}
                  </p>
                )}

                {/* Verification Code Field - only show in 2FA mode */}
                {mode === "2fa" && (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, mb: 1 }}
                    >
                      {t("labels.verificationCodeDescription")}
                    </Typography>
                    <TextField
                      error={!!formState.errors.verificationCode}
                      onMouseDown={handleFormMouseDown}
                      id="verificationCode"
                      label={t("fields.verificationCode")}
                      type="text"
                      inputProps={{
                        maxLength: 6,
                        pattern: "[0-9]{6}",
                        inputMode: "numeric",
                      }}
                      {...register("verificationCode", {
                        required: t("errors.required"),
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message:
                            t("errors.verificationCodeFormat") ||
                            "Please enter a valid 6-digit code",
                        },
                      })}
                    />
                    {formState.errors.verificationCode && (
                      <p className="text-mui-error text-sm">
                        {formState.errors.verificationCode.message as string}
                      </p>
                    )}
                  </>
                )}

                <Box sx={{ my: 2, position: "relative" }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      {t("or")}
                    </Typography>
                  </Divider>
                </Box>

                <GoogleAuthButton
                  fullWidth
                  sx={{ mb: 2 }}
                  onMouseDown={handleFormMouseDown}
                  onError={(error) => setFormError(error)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={fetching}
                  onMouseDown={handleFormMouseDown}
                  sx={{ mt: 2 }}
                >
                  {t(`buttons.${mode}`)}
                </Button>
              </form>

              <Stack spacing={1} mt={3} textAlign="center">
                {mode !== "signin" && (
                  <Button
                    className="!text-white"
                    onMouseDown={handleFormMouseDown}
                    variant="text"
                    size="small"
                    onClick={() => handleSwitch("signin")}
                  >
                    {t("buttons.toSignin")}
                  </Button>
                )}
                {mode !== "signup" && (
                  <Button
                    className="!text-white"
                    onMouseDown={handleFormMouseDown}
                    variant="text"
                    size="small"
                    onClick={() => handleSwitch("signup")}
                  >
                    {t("buttons.toSignup")}
                  </Button>
                )}
                {mode !== "forgot" && (
                  <Button
                    className="!text-white"
                    onMouseDown={handleFormMouseDown}
                    variant="text"
                    size="small"
                    onClick={() => handleSwitch("forgot")}
                  >
                    {t("buttons.toForgot")}
                  </Button>
                )}
              </Stack>
            </div>
          </Fade>
        </Paper>
      </Box>
    </>
  );
}
