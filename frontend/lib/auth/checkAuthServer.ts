// lib/authentication/checkAuthServer.ts
import { cookies } from "next/headers";

export async function checkAuthServer() {
  const cookieHeader = cookies().toString(); // includes HttpOnly cookies

  const res = await fetch(`http://localhost:3001/api/authentication/check`, {
    headers: {
      Cookie: cookieHeader,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const response = await res.json();
  return response.data.isAuthenticated ? response.data.user : null;
}
