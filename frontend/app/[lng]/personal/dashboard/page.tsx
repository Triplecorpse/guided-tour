"use client";

import React from "react";
import { useT } from "@/i18n/client";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface DashboardTile {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export default function DashboardPage() {
  const { t } = useT("dashboard");
  const theme = useTheme();
  const router = useRouter();

  const tiles: DashboardTile[] = [
    {
      id: "users-permissions",
      titleKey: "tiles.usersPermissions.title",
      descriptionKey: "tiles.usersPermissions.description",
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      path: "/personal/users",
      color: theme.palette.primary.main,
    },
    {
      id: "locations-poi",
      titleKey: "tiles.locationsPoi.title",
      descriptionKey: "tiles.locationsPoi.description",
      icon: <LocationIcon sx={{ fontSize: 48 }} />,
      path: "/personal/locations",
      color: theme.palette.secondary.main,
    },
    {
      id: "app-settings",
      titleKey: "tiles.appSettings.title",
      descriptionKey: "tiles.appSettings.description",
      icon: <SettingsIcon sx={{ fontSize: 48 }} />,
      path: "/personal/settings",
      color: theme.palette.success.main,
    },
  ];

  const handleTileClick = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{ mb: 6 }}
        >
          {t("title")}
        </Typography>

        <Grid container spacing={4} justifyContent="center" maxWidth="md">
          {tiles.map((tile) => (
            <Grid item xs={12} sm={6} md={4} key={tile.id}>
              <Card
                sx={{
                  height: 280,
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                    "& .tile-icon": {
                      transform: "scale(1.1)",
                      color: tile.color,
                    },
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleTileClick(tile.path)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      className="tile-icon"
                      sx={{
                        transition: "all 0.3s ease-in-out",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {tile.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      {t(tile.titleKey)}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {t(tile.descriptionKey)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
