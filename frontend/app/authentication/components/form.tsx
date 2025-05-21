import { TextField } from "@mui/material";

interface AuthenticationFormProps {
  email: boolean;
  password: boolean;
  name: boolean;
}

export function AuthenticationForm(view: AuthenticationFormProps) {
  return (
    <div className="mb-4">
      <div className="mb-4">
        {view.email && (
          <TextField
            className="w-full"
            id="email"
            name="email"
            label="Email"
            variant="standard"
            required={true}
          />
        )}
      </div>
      <div className="mb-4">
        {view.name && (
          <TextField
            className="w-full"
            id="name"
            name="name"
            label="Full Name"
            variant="standard"
            required={true}
          />
        )}
      </div>
      <div className="mb-4">
        {view.password && (
          <TextField
            className="w-full"
            id="password"
            name="password"
            type="password"
            label="Password"
            variant="standard"
            required={true}
          />
        )}
      </div>
    </div>
  );
}
