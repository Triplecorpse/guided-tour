import { Button, Card } from "@mui/material";

export default function AbstractPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-amber-50">
      <div className="m-auto">
        <Card variant="outlined" className="p-4">
          {children}
          <div className="flex justify-between mt-4">
            <Button variant="outlined">Return</Button>
            <Button variant="contained">OK</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
