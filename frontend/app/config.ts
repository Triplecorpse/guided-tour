export const API_URL = "http://localhost:3000";

export const ROUTES = {
  authentication: {
    check: API_URL + "/authentication/check",
    signup: API_URL + "/authentication/sign-up",
    signin: API_URL + "/authentication/sign-in",
    signout: API_URL + "/authentication/sign-out",
    refresh: API_URL + "/authentication/refresh-tokens",
    forgot: API_URL + "/authentication/forgot-password",
    google: API_URL + "/authentication/google",
    generateSecret: API_URL + "/authentication/2fa/generate-secret",
    verify2fa: API_URL + "/authentication/2fa/verify",
    disable2fa: API_URL + "/authentication/2fa/disable",
  },
  users: {
    list: API_URL + "/users",
    profile: API_URL + "/users/profile",
  },
  roles: {
    list: API_URL + "/permissions",
    update: (id: number) => API_URL + `/permissions/${id}`,
  },
  locations: {
    list: API_URL + "/location/all",
    create: API_URL + "/location",
    update: (id: number) => API_URL + `/location/${id}`,
    delete: (id: number) => API_URL + `/location/${id}`,
  },
  pois: {
    list: API_URL + "/poi/all",
    create: API_URL + "/poi",
    update: (id: number) => API_URL + `/poi/${id}`,
    delete: (id: number) => API_URL + `/poi/${id}`,
  },
};
