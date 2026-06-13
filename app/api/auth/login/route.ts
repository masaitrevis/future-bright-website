import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple hardcoded auth for now
    // In production, use hashed passwords in DB
    if (body.username === "admin" && body.password === "admin123") {
      return NextResponse.json({
        token: "admin-token-12345",
        user: { username: "admin", role: "admin" },
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
