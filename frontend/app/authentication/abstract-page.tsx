import { Button, Card } from "@mui/material";

interface AbstractPageProps {
  children: React.ReactNode;
  state: "signin" | "signup" | "forgot";
}

export default function AbstractPage({
  children,
  state,
}: Readonly<AbstractPageProps>) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    await fetch(endpoint, {
      method: "POST", // Use POST if you're sending data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@email.com", password: "123456" }), // replace with actual form data
    });
  };

  return (
    <div className="flex h-screen bg-amber-50">
      <form className="m-auto" onSubmit={handleSubmit}>
        <Card variant="outlined" className="p-4">
          {children}
          <div className="flex justify-between mt-4">
            <Button variant="outlined" type="button">
              Return
            </Button>
            <Button variant="contained" type="submit">
              OK
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
