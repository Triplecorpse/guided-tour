// You can also split GET/POST separately if needed
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3000/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // forward any custom headers if needed
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
