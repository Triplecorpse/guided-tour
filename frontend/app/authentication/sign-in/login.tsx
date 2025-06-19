import { AuthenticationForm } from "@/authentication/components/form";

export function Login() {
  return (
    <AuthenticationForm
      password={true}
      email={true}
      name={false}
    ></AuthenticationForm>
  );
}
