import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { fileName, fileData } = body;

    if (!fileName || !fileData) {
      return NextResponse.json(
        { error: "fileName and fileData are required." },
        { status: 400 }
      );
    }

    // Extract base64 content and mime type
    let mimeType = "";
    let base64Content = fileData;

    if (fileData.startsWith("data:")) {
      const matches = fileData.match(/^data:([A-Za-z-+/0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Content = matches[2];
      }
    }

    const buffer = Buffer.from(base64Content, "base64");
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10 MB limit." },
        { status: 400 }
      );
    }

    // Target upload folder in public/uploads or backend/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    const ext =
      path.extname(fileName) ||
      (mimeType.includes("png")
        ? ".png"
        : mimeType.includes("jpeg") || mimeType.includes("jpg")
        ? ".jpg"
        : mimeType.includes("svg")
        ? ".svg"
        : ".png");

    const hash = crypto.randomBytes(6).toString("hex");
    const safeName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 25);
    const uniqueFileName = `logo_${Date.now()}_${safeName}_${hash}${ext}`;

    try {
      if (!fs.existsSync(/*turbopackIgnore: true*/ uploadDir)) {
        fs.mkdirSync(/*turbopackIgnore: true*/ uploadDir, { recursive: true });
      }
      fs.writeFileSync(/*turbopackIgnore: true*/ path.join(uploadDir, uniqueFileName), buffer);
    } catch (e) {}

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      message: "Logo uploaded successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
