"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ROUTES } from "@/config";
import { post } from "@/services/api.service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/../lib/store";
import { checkAuth } from "@/../lib/slices/AuthSlice";

export default function GoogleRedirectPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          setError(`OAuth error: ${error}`);
          setLoading(false);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Send the authorization code to your backend
        const response = await post(ROUTES.authentication.google, {
          code: code,
          state: state
        }) as any;

        if (response.error) {
          setError(response.message || 'Authentication failed');
        } else {
          // Handle successful authentication
          await dispatch(checkAuth());
          router.push("/personal");
        }
      } catch (error) {
        console.error("Google OAuth error:", error);
        setError('Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Completing Google authentication...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Authentication Error
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {error}
        </Typography>
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => router.push("/authentication")}
        >
          Return to login
        </Typography>
      </Box>
    );
  }

  return null;
} 