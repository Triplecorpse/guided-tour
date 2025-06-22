// You can also split GET/POST separately if needed
import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/config";

const BACKEND_URL = ROUTES.authentication.check;

export async function GET(req: NextRequest) {
  const res = await fetch(BACKEND_URL, {
    headers: {
      "Content-Type": "application/json",
      Cookie: req.cookies.get("accessToken") || "",
      // forward any custom headers if needed
    },
    credentials: "include",
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
