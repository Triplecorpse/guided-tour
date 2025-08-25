import React from "react";
import PoiTableClient from "@/[lng]/personal/locations/poisTable/poiTableClient";

export default function PoiTable() {
  return (
    <div className="poi-table-container">
      <h2>Points of Interest Management</h2>
      <PoiTableClient />
    </div>
  );
}
