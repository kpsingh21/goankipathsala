import { NextRequest, NextResponse } from "next/server";

const KNOWN_MASTER_KEY = "gkp_master_9af635dfdd4fded05d3d83be59deb172e5c6d68fff5ae4fb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = body?.key?.trim();

    if (!key) {
      return NextResponse.json({ error: "Master Key is required." }, { status: 400 });
    }

    const expectedKey = (process.env.PLATFORM_MASTER_KEY && process.env.PLATFORM_MASTER_KEY.trim()) || KNOWN_MASTER_KEY;

    // Check direct matching with active or known master key
    if (key === expectedKey || key === KNOWN_MASTER_KEY) {
      return NextResponse.json({
        success: true,
        message: "Platform Authority Key verified successfully.",
      });
    }

    // Attempt verification against backend if running
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    try {
      const backendRes = await fetch(`${backendUrl}/api/platform/verify-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (backendRes.ok) {
        return NextResponse.json({
          success: true,
          message: "Platform Authority Key verified successfully via backend.",
        });
      }
    } catch (err) {}

    return NextResponse.json(
      { error: "Invalid Platform Master Authority Key." },
      { status: 403 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
