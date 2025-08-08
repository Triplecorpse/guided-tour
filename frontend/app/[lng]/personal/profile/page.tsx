import { Grid, ListItemButton, ListItemText } from "@mui/material";

export default function ProfilePage() {
  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <ListItemButton component="a" href="#simple-list">
          <ListItemText primary="Security settings" />
        </ListItemButton>
      </Grid>
      <Grid size={8}>email google 2FA</Grid>
    </Grid>
  );
}
