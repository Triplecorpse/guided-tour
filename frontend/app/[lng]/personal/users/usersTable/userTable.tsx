import React from "react";
import UserTableClient from "@/[lng]/personal/users/usersTable/userTableClient";

export default function UserTable() {
  return (
    <div className="user-table-container">
      <h2>User Management</h2>
      <UserTableClient />
    </div>
  );
}
