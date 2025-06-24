export const API_URL = "http://localhost:3000";

export const ROUTES = {
  authentication: {
    check: API_URL + "/authentication/check",
    signup: API_URL + "/authentication/sign-up",
    signin: API_URL + "/authentication/sign-in",
    forgot: API_URL + "/authentication/forgot-password",
  },
};
