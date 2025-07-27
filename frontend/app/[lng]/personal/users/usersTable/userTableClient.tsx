"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Role } from "../../../../../../src/iam/enums/role.enum";
import { get } from "@/services/api.service";

type User = {
  id: number;
  email: string;
  full_name: string;
  role: Role;
};

interface UserData {
  data: User[];
}

export default function UserTableClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchUsers = async () => {
    try {
      const response = await get<UserData>("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "email", headerName: "Email", width: 230 },
    { field: "full_name", headerName: "Full Name", width: 230 },
    { field: "role", headerName: "Role", width: 130 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
      />
    </div>
  );
}
