import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const INQUIRIES_DIR = path.resolve(process.cwd(), "..", "backend", "data", "school-inquiries");

function saveSchoolInquiryLocally(slug: string, inquiry: any) {
  try {
    if (!fs.existsSync(INQUIRIES_DIR)) {
      fs.mkdirSync(INQUIRIES_DIR, { recursive: true });
    }
    const filePath = path.join(INQUIRIES_DIR, `${slug}.json`);
    let list: any[] = [];
    if (fs.existsSync(filePath)) {
      list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    list.unshift(inquiry);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write school inquiry locally:", err);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json().catch(() => ({}));
    const { parentName, studentName, phone, email, gradeSeeking, inquiryType, message } = body;

    if (!parentName?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Please provide Parent / Guardian name, contact phone number, and your inquiry message." },
        { status: 400 }
      );
    }

    // Try forwarding to backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/tenants/${slug}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ parentName, studentName, phone, email, gradeSeeking, inquiryType, message, slug }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch (err) {
      // Backend offline or unreachable
    }

    const fallbackInquiry = {
      id: `sch_inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantSlug: slug,
      parentName: String(parentName).trim(),
      studentName: studentName ? String(studentName).trim() : null,
      phone: String(phone).trim(),
      email: email ? String(email).trim() : null,
      gradeSeeking: gradeSeeking ? String(gradeSeeking).trim() : null,
      inquiryType: inquiryType ? String(inquiryType).trim() : "Admission Inquiry",
      message: String(message).trim(),
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    saveSchoolInquiryLocally(slug, fallbackInquiry);

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been submitted to the school administration. Our admissions desk will contact you shortly.",
        inquiry: fallbackInquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit inquiry." },
      { status: 500 }
    );
  }
}
