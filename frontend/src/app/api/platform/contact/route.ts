import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const LOCAL_INQUIRIES_PATH = path.resolve(process.cwd(), "..", "backend", "data", "platform-inquiries.json");

function saveInquiryLocally(inquiry: any) {
  try {
    const dir = path.dirname(LOCAL_INQUIRIES_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let list: any[] = [];
    if (fs.existsSync(LOCAL_INQUIRIES_PATH)) {
      list = JSON.parse(fs.readFileSync(LOCAL_INQUIRIES_PATH, "utf-8"));
    }
    list.unshift(inquiry);
    fs.writeFileSync(LOCAL_INQUIRIES_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write inquiry locally:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, email, phone, schoolName, inquiryType, message } = body;

    if (!fullName?.trim() || (!email?.trim() && !phone?.trim()) || !message?.trim()) {
      return NextResponse.json(
        { error: "Please provide your Full Name, at least one contact channel (Email or Phone), and your message." },
        { status: 400 }
      );
    }

    // Try forwarding to backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/platform/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, schoolName, inquiryType, message }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch (err) {
      // Backend may be offline or unreachable, fall back to local disk storage
    }

    const fallbackInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: String(fullName).trim(),
      email: email ? String(email).trim() : null,
      phone: phone ? String(phone).trim() : null,
      schoolName: schoolName ? String(schoolName).trim() : null,
      inquiryType: inquiryType ? String(inquiryType).trim() : "General Inquiry",
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: "NEW",
    };

    saveInquiryLocally(fallbackInquiry);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting Goan Ki Pathshala! Our support and onboarding team will reach out to you shortly.",
        inquiry: fallbackInquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process inquiry submission." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const masterKey = req.headers.get("x-platform-master-key");
    if (!masterKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Attempt backend fetch first
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/platform/contact/inquiries`, {
        headers: { "x-platform-master-key": masterKey },
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {}

    // Fallback to local file read
    if (fs.existsSync(LOCAL_INQUIRIES_PATH)) {
      const list = JSON.parse(fs.readFileSync(LOCAL_INQUIRIES_PATH, "utf-8"));
      return NextResponse.json({ inquiries: list });
    }

    return NextResponse.json({ inquiries: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to read inquiries." }, { status: 500 });
  }
}
