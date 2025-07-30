export const API_URL = "http://localhost:3000";

export const ROUTES = {
  authentication: {
    check: API_URL + "/authentication/check",
    signup: API_URL + "/authentication/sign-up",
    signin: API_URL + "/authentication/sign-in",
    signout: API_URL + "/authentication/sign-out",
    forgot: API_URL + "/authentication/forgot-password",
    google: API_URL + "/authentication/google",
  },
  users: {
    list: API_URL + "/users",
  },
  roles: {
    list: API_URL + "/permissions",
    update: (id: number) => API_URL + `/permissions/${id}`,
  },
};
