import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    framework: "next",
    router: "app",
    timestamp: new Date().toISOString()
  });
}
