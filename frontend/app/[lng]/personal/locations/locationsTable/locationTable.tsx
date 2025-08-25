import React from "react";
import LocationTableClient from "@/[lng]/personal/locations/locationsTable/locationTableClient";

export default function LocationTable() {
  return (
    <div className="location-table-container">
      <h2>Location Management</h2>
      <LocationTableClient />
    </div>
  );
}
