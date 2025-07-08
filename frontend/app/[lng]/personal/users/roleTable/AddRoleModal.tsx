"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useT } from "@/i18n/client";
import { CreatePermissionDto } from "../../../../../../src/permission/interface/createPermissionDto";
import { post } from "@/services/api.service";
import { ROUTES } from "@/config";

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRoleModal({ open, onClose, onSuccess }: AddRoleModalProps) {
  const { t } = useT("users");
  const [formData, setFormData] = useState<CreatePermissionDto>({
    name: "",
    createUser: false,
    readUser: false,
    updateUser: false,
    deleteUser: false,
    createPoi: false,
    readPoi: false,
    updatePoi: false,
    deletePoi: false,
    createLocation: false,
    readLocation: false,
    updateLocation: false,
    deleteLocation: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CreatePermissionDto, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setLoading(true);
    try {
      await post<CreatePermissionDto>(ROUTES.roles.list, formData);
      onSuccess();
      onClose();
      setFormData({
        name: "",
        createUser: false,
        readUser: false,
        updateUser: false,
        deleteUser: false,
        createPoi: false,
        readPoi: false,
        updatePoi: false,
        deletePoi: false,
        createLocation: false,
        readLocation: false,
        updateLocation: false,
        deleteLocation: false,
      });
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      createUser: false,
      readUser: false,
      updateUser: false,
      deleteUser: false,
      createPoi: false,
      readPoi: false,
      updatePoi: false,
      deletePoi: false,
      createLocation: false,
      readLocation: false,
      updateLocation: false,
      deleteLocation: false,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>{t("roleManagement.addRoleTitle")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t("roleManagement.roleName")}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("roleManagement.permissions")}
          </Typography>

          {/* User Permissions */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            {t("roleManagement.userPermissions")}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.createUser}
                  onChange={(e) => handleInputChange("createUser", e.target.checked)}
                />
              }
              label={t("roleManagement.createUser")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.readUser}
                  onChange={(e) => handleInputChange("readUser", e.target.checked)}
                />
              }
              label={t("roleManagement.readUser")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.updateUser}
                  onChange={(e) => handleInputChange("updateUser", e.target.checked)}
                />
              }
              label={t("roleManagement.updateUser")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.deleteUser}
                  onChange={(e) => handleInputChange("deleteUser", e.target.checked)}
                />
              }
              label={t("roleManagement.deleteUser")}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* POI Permissions */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            {t("roleManagement.poiPermissions")}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.createPoi}
                  onChange={(e) => handleInputChange("createPoi", e.target.checked)}
                />
              }
              label={t("roleManagement.createPoi")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.readPoi}
                  onChange={(e) => handleInputChange("readPoi", e.target.checked)}
                />
              }
              label={t("roleManagement.readPoi")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.updatePoi}
                  onChange={(e) => handleInputChange("updatePoi", e.target.checked)}
                />
              }
              label={t("roleManagement.updatePoi")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.deletePoi}
                  onChange={(e) => handleInputChange("deletePoi", e.target.checked)}
                />
              }
              label={t("roleManagement.deletePoi")}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Location Permissions */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            {t("roleManagement.locationPermissions")}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.createLocation}
                  onChange={(e) => handleInputChange("createLocation", e.target.checked)}
                />
              }
              label={t("roleManagement.createLocation")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.readLocation}
                  onChange={(e) => handleInputChange("readLocation", e.target.checked)}
                />
              }
              label={t("roleManagement.readLocation")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.updateLocation}
                  onChange={(e) => handleInputChange("updateLocation", e.target.checked)}
                />
              }
              label={t("roleManagement.updateLocation")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.deleteLocation}
                  onChange={(e) => handleInputChange("deleteLocation", e.target.checked)}
                />
              }
              label={t("roleManagement.deleteLocation")}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={loading}>
          {t("roleManagement.cancel")}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.name.trim()}
        >
          {t("roleManagement.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 