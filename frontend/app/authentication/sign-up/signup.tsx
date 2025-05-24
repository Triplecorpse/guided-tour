import { AuthenticationForm } from "@/authentication/components/form";

export function Signup() {
  return (
    <AuthenticationForm
      password={true}
      email={true}
      name={true}
    ></AuthenticationForm>
  );
}
