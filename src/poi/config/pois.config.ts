import { registerAs } from "@nestjs/config";

export default registerAs("pois", () => ({
  name: "Triplecorpse",
}));
