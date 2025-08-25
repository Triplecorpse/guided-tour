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

interface POI {
  id: number;
  name: string;
  type: string;
  point: any;
  location: {
    id: number;
    name: string;
  };
  recommendations: number;
}

interface Location {
  id: number;
  name: string;
}

export default function PoiTableClient() {
  const { t } = useT("locations");
  const [pois, setPois] = useState<POI[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingPoi, setEditingPoi] = useState<POI | null>(null);
  const [deletePoiId, setDeletePoiId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    locationId: "",
    coordinates: "",
  });

  useEffect(() => {
    fetchPois();
    fetchLocations();
  }, []);

  const fetchPois = async () => {
    try {
      const response = await get<{ data: POI[] }>(ROUTES.pois.list);
      setPois(response.data || []);
    } catch (error) {
      console.error("Error fetching POIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await get<{ data: Location[] }>(ROUTES.locations.list);
      setLocations(response.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAddPoi = () => {
    setEditingPoi(null);
    setFormData({ name: "", type: "", locationId: "", coordinates: "" });
    setOpenDialog(true);
  };

  const handleEditPoi = (poi: POI) => {
    setEditingPoi(poi);
    setFormData({
      name: poi.name,
      type: poi.type,
      locationId: poi.location?.id?.toString() || "",
      coordinates: poi.point
        ? `${poi.point.coordinates[0]}, ${poi.point.coordinates[1]}`
        : "",
    });
    setOpenDialog(true);
  };

  const handleDeletePoi = (id: number) => {
    setDeletePoiId(id);
    setOpenDeleteDialog(true);
  };

  const handleSavePoi = async () => {
    try {
      const [lat, lng] = formData.coordinates
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      const poiData = {
        name: formData.name,
        type: formData.type,
        location: { id: parseInt(formData.locationId) },
        point: {
          type: "Point",
          coordinates: [lat, lng],
        },
      };

      if (editingPoi) {
        await patch(ROUTES.pois.update(editingPoi.id), poiData);
      } else {
        await post(ROUTES.pois.create, poiData);
      }

      setOpenDialog(false);
      await fetchPois();
    } catch (error) {
      console.error("Error saving POI:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletePoiId) {
      try {
        await del(ROUTES.pois.delete(deletePoiId));
        setOpenDeleteDialog(false);
        setDeletePoiId(null);
        await fetchPois();
      } catch (error) {
        console.error("Error deleting POI:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{t("titles.poiManagement")}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddPoi}>
          {t("buttons.addPoi")}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("fields.poiName")}</TableCell>
              <TableCell>{t("fields.poiType")}</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>{t("fields.coordinates")}</TableCell>
              <TableCell>{t("fields.recommendations")}</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pois.map((poi) => (
              <TableRow key={poi.id}>
                <TableCell>{poi.id}</TableCell>
                <TableCell>{poi.name}</TableCell>
                <TableCell>{poi.type}</TableCell>
                <TableCell>{poi.location?.name || "-"}</TableCell>
                <TableCell>
                  {poi.point?.coordinates
                    ? `${poi.point.coordinates[0]}, ${poi.point.coordinates[1]}`
                    : "-"}
                </TableCell>
                <TableCell>{poi.recommendations || 0}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditPoi(poi)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeletePoi(poi.id)}
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
          {editingPoi ? t("titles.editPoi") : t("titles.addPoi")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("fields.poiName")}
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={t("fields.poiType")}
            fullWidth
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={formData.locationId}
              onChange={(e) =>
                setFormData({ ...formData, locationId: e.target.value })
              }
              label="Location"
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={t("fields.coordinates")}
            fullWidth
            variant="outlined"
            value={formData.coordinates}
            onChange={(e) =>
              setFormData({ ...formData, coordinates: e.target.value })
            }
            placeholder="50.4501, 30.5234"
            helperText="Enter coordinates as: latitude, longitude"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleSavePoi} variant="contained">
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
            {t("messages.confirmDeletePoi")}
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
