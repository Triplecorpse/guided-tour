#!/bin/bash
set -e

# Налаштування підключення
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASS="pass123"

# Файл з даними (GeoJSON)
GEOJSON_FILE="countries.geojson"

# --- 2. Імпортувати GeoJSON у таблицю countries
echo "Importing $GEOJSON_FILE into PostGIS..."
ogr2ogr \
  -f "PostgreSQL" \
  PG:"host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASS" \
  "$GEOJSON_FILE" \
  -nln countries -overwrite \
  -nlt MULTIPOLYGON \
  -lco GEOMETRY_NAME=geom \
  -lco FID=id

echo "✅ Import completed successfully!"
