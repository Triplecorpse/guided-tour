import { AuthenticationForm } from "@/authentication/components/form";

export function ForgotPassword() {
  return (
    <AuthenticationForm
      password={false}
      email={true}
      name={false}
    ></AuthenticationForm>
  );
}
