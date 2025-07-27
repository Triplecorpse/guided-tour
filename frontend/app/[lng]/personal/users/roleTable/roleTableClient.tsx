import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { get, patch } from "@/services/api.service";
import { Permission } from "../../../../../../src/permission/interface/Permission";
import { ROUTES } from "@/config";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useT } from "@/i18n/client";
import AddRoleModal from "./AddRoleModal";

interface RoleData {
  data: Permission[];
}

interface RoleChanges {
  [roleId: number]: Partial<Permission>;
}

export default function RoleTableClient() {
  const { t } = useT("users");
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState<Permission[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);
  const [updating, setUpdating] = useState<number | null>(null);
  const [changes, setChanges] = useState<RoleChanges>({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await get<RoleData>(ROUTES.roles.list);
      setRoles(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRole = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRoleCreated = () => {
    fetchRoles(); // Refresh the roles list
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = roles.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const trackChange = (roleId: number, field: keyof Permission, value: any) => {
    setChanges((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [field]: value,
      },
    }));
  };

  const handlePermissionChange = async (
    roleId: number,
    permissionKey: keyof Permission,
    newValue: boolean,
  ) => {
    trackChange(roleId, permissionKey, newValue);

    // Update local state immediately for responsive UI
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, [permissionKey]: newValue } : role,
      ),
    );

    // Debounce the API call
    setTimeout(() => {
      sendChanges(roleId);
    }, 500);
  };

  const handleNameChange = async (roleId: number, newName: string) => {
    trackChange(roleId, "name", newName);

    // Update local state immediately
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, name: newName } : role,
      ),
    );

    // Debounce the API call
    setTimeout(() => {
      sendChanges(roleId);
    }, 500);
  };

  const sendChanges = async (roleId: number) => {
    const roleChanges = changes[roleId];
    if (!roleChanges || Object.keys(roleChanges).length === 0) return;

    setUpdating(roleId);
    try {
      await patch<Permission>(ROUTES.roles.update(roleId), roleChanges);

      // Clear changes for this role after successful update
      setChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[roleId];
        return newChanges;
      });
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setUpdating(null);
    }
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const getRoleChanges = (roleId: number) => changes[roleId] || {};

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleAddRole}
            sx={{ color: "white" }}
          >
            {t("roleManagement.addRole")}
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ width: "100%" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < roles.length
                    }
                    checked={
                      roles.length > 0 && selected.length === roles.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>{t("roleManagement.roleName")}</TableCell>
                <TableCell>{t("roleManagement.userPermissions")}</TableCell>
                <TableCell>{t("roleManagement.poiPermissions")}</TableCell>
                <TableCell>{t("roleManagement.locationPermissions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((role) => {
                  const isItemSelected = isSelected(role.id);
                  const isUpdating = updating === role.id;
                  const roleChanges = getRoleChanges(role.id);
                  const hasChanges = Object.keys(roleChanges).length > 0;

                  return (
                    <TableRow hover key={role.id} selected={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) =>
                            handleCheckboxClick(event, role.id)
                          }
                        />
                      </TableCell>
                      <TableCell>{role.id}</TableCell>
                      <TableCell>
                        <TextField
                          value={role.name}
                          onChange={(e) =>
                            handleNameChange(role.id, e.target.value)
                          }
                          disabled={isUpdating}
                          size="small"
                          variant="standard"
                          sx={{
                            "& .MuiInput-underline:before": {
                              borderBottom: hasChanges
                                ? "2px solid #1976d2"
                                : undefined,
                            },
                            "& .MuiInput-underline:after": {
                              borderBottom: hasChanges
                                ? "2px solid #1976d2"
                                : undefined,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.createUser}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "createUser",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.createUser")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.readUser}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "readUser",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.readUser")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.updateUser}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "updateUser",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.updateUser")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.deleteUser}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "deleteUser",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.deleteUser")}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.createPoi}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "createPoi",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.createPoi")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.readPoi}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "readPoi",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.readPoi")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.updatePoi}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "updatePoi",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.updatePoi")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.deletePoi}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "deletePoi",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.deletePoi")}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.createLocation}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "createLocation",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.createLocation")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.readLocation}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "readLocation",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.readLocation")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.updateLocation}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "updateLocation",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.updateLocation")}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={role.deleteLocation}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    "deleteLocation",
                                    e.target.checked,
                                  )
                                }
                                disabled={isUpdating}
                                size="small"
                              />
                            }
                            label={t("roleManagement.deleteLocation")}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={roles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <AddRoleModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleRoleCreated}
      />
    </Box>
  );
}
