import { AuthenticationForm } from "@/app/authentication/components/form";

export default function Login() {
  return (
    <AuthenticationForm
      password={true}
      email={true}
      name={false}
    ></AuthenticationForm>
  );
}
