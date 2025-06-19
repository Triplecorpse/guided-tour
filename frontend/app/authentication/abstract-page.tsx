const [
  { Button, Card, Alert },
  { useForm, FormProvider },
  { useState },
  { FormUIContext },
  { useRouter },
] = await Promise.all([
  import("@mui/material"),
  import("react-hook-form"),
  import("react"),
  import("./form-ui-context"),
  import("next/navigation"),
]);

interface AbstractPageProps {
  children: React.ReactNode;
  state: "signin" | "signup" | "forgot";
}

export function AbstractPage({ children, state }: Readonly<AbstractPageProps>) {
  const methods = useForm();
  const router = useRouter();
  const { handleSubmit } = methods;
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    let endpoint = "";

    switch (state) {
      case "signin":
        endpoint = "/api/authentication/signin";
        break;
      case "signup":
        endpoint = "/api/authentication/signup";
        break;
      case "forgot":
        endpoint = "/api/authentication/forgot";
        break;
      default:
        throw new Error("Unknown state");
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json: Record<string, any> = await response.json();

      if (!response.ok) {
        setFormError((json.message as string) ?? "An unknown error occurred");
        return;
      }

      console.log("Success:", response);

      if (state === "signup") {
        router.push("/authentication/sign-in");
      } else if (state === "signin") {
        console.log(json);
        localStorage.setItem("Auth", json.token);
        router.push("/personal");
      }
    } catch (e: unknown) {
      setFormError(
        e instanceof Error ? e.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="flex h-screen bg-amber-50">
      <FormProvider {...methods}>
        <FormUIContext.Provider value={{ disabled: isSubmitting }}>
          <form className="m-auto" onSubmit={onSubmit}>
            <Card variant="outlined" className="p-4">
              {formError && (
                <Alert severity="error" className="mb-4">
                  {formError}
                </Alert>
              )}
              {children}
              <div className="flex justify-between mt-4">
                <Button
                  variant="outlined"
                  type="button"
                  disabled={isSubmitting}
                >
                  Return
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  OK
                </Button>
              </div>
            </Card>
          </form>
        </FormUIContext.Provider>
      </FormProvider>
    </div>
  );
}
