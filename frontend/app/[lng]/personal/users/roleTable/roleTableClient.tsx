import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { get } from "@/services/api.service";
import { CreatePermissionDto } from "../../../../../../src/permission/interface/createPermissionDto";
import { Permission } from "../../../../../../src/permission/interface/Permission";
import { ROUTES } from "@/config";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useT } from "@/i18n/client";
import AddRoleModal from "./AddRoleModal";

interface RoleData {
  data: Permission[];
}

export default function RoleTableClient() {
  const { t } = useT("users");
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState<Permission[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);

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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
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

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const formatPermissionValue = (value: boolean) => value ? "✓" : "✗";

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
                    indeterminate={selected.length > 0 && selected.length < roles.length}
                    checked={roles.length > 0 && selected.length === roles.length}
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
                  return (
                    <TableRow
                      hover
                      key={role.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox 
                          color="primary" 
                          checked={isItemSelected}
                          onClick={(event) => handleCheckboxClick(event, role.id)}
                        />
                      </TableCell>
                      <TableCell>{role.id}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption">
                            {t("roleManagement.createUser")}: {formatPermissionValue(role.createUser)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.readUser")}: {formatPermissionValue(role.readUser)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.updateUser")}: {formatPermissionValue(role.updateUser)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.deleteUser")}: {formatPermissionValue(role.deleteUser)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption">
                            {t("roleManagement.createPoi")}: {formatPermissionValue(role.createPoi)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.readPoi")}: {formatPermissionValue(role.readPoi)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.updatePoi")}: {formatPermissionValue(role.updatePoi)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.deletePoi")}: {formatPermissionValue(role.deletePoi)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption">
                            {t("roleManagement.createLocation")}: {formatPermissionValue(role.createLocation)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.readLocation")}: {formatPermissionValue(role.readLocation)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.updateLocation")}: {formatPermissionValue(role.updateLocation)}
                          </Typography>
                          <Typography variant="caption">
                            {t("roleManagement.deleteLocation")}: {formatPermissionValue(role.deleteLocation)}
                          </Typography>
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
