const [{ AuthenticationForm }] = await Promise.all([
  import("@/authentication/components/form"),
]);

export function Signup() {
  return (
    <AuthenticationForm
      password={true}
      email={true}
      name={true}
    ></AuthenticationForm>
  );
}
