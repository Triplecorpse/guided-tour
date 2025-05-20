import { Button } from "@mui/material";

export default function AbstractPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        {children}
        <Button variant="text">Return</Button>
        <Button variant="contained">OK</Button>
      </div>
    </div>
  );
}
