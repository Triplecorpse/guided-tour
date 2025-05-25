// You can also split GET/POST separately if needed
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/config";

const BACKEND_URL = API_URL + "/authentication/sign-up";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
