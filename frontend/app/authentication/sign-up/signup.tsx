import { TextField } from "@mui/material";
import { AuthenticationForm } from "@/app/authentication/components/form";

export function Signup() {
  return (
    <AuthenticationForm
      password={true}
      email={true}
      name={true}
    ></AuthenticationForm>
  );
}
