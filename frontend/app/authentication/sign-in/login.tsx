import { FormLabel, Input, TextField } from "@mui/material";

export default function Login() {
  return (
    <div>
      <form>
        <div>
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="standard"
            required={true}
          />
        </div>
        <div>
          <TextField
            id="password"
            name="password"
            label="Password"
            variant="standard"
            required={true}
          />
        </div>
      </form>
    </div>
  );
}
