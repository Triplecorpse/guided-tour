import { AuthenticationForm } from "@/authentication/components/form";

export default function Login() {
  return (
    <AuthenticationForm
      password={true}
      email={true}
      name={false}
    ></AuthenticationForm>
  );
}
