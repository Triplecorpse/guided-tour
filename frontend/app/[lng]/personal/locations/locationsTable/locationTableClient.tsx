"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useT } from "@/i18n/client";
import { get, post, patch, del } from "@/services/api.service";
import { ROUTES } from "@/config";

interface Location {
  id: number;
  name: string;
  parent: Location | null;
  children: Location[];
  pois: any[];
}

export default function LocationTableClient() {
  const { t } = useT("locations");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteLocationId, setDeleteLocationId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", parentId: "" });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await get<{ data: Location[] }>(ROUTES.locations.list);
      setLocations(response.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormData({ name: "", parentId: "" });
    setOpenDialog(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      parentId: location.parent?.id?.toString() || "",
    });
    setOpenDialog(true);
  };

  const handleDeleteLocation = (id: number) => {
    setDeleteLocationId(id);
    setOpenDeleteDialog(true);
  };

  const handleSaveLocation = async () => {
    try {
      const locationData = {
        name: formData.name,
        parentId: formData.parentId ? parseInt(formData.parentId) : undefined,
      };

      if (editingLocation) {
        await patch(ROUTES.locations.update(editingLocation.id), locationData);
      } else {
        await post(ROUTES.locations.create, locationData);
      }

      setOpenDialog(false);
      await fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteLocationId) {
      try {
        await del(ROUTES.locations.delete(deleteLocationId));
        setOpenDeleteDialog(false);
        setDeleteLocationId(null);
        await fetchLocations();
      } catch (error) {
        console.error("Error deleting location:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{t("titles.locationManagement")}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddLocation}
        >
          {t("buttons.addLocation")}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("fields.locationName")}</TableCell>
              <TableCell>{t("fields.parentLocation")}</TableCell>
              <TableCell>Children Count</TableCell>
              <TableCell>POIs Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.id}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.parent?.name || "-"}</TableCell>
                <TableCell>{location.children?.length || 0}</TableCell>
                <TableCell>{location.pois?.length || 0}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditLocation(location)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteLocation(location.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingLocation ? t("titles.editLocation") : t("titles.addLocation")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("fields.locationName")}
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t("fields.parentLocation")}</InputLabel>
            <Select
              value={formData.parentId}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
              }
              label={t("fields.parentLocation")}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {locations
                .filter((loc) => loc.id !== editingLocation?.id)
                .map((location) => (
                  <MenuItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleSaveLocation} variant="contained">
            {t("buttons.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{t("buttons.confirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("messages.confirmDeleteLocation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {t("buttons.no")}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t("buttons.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
