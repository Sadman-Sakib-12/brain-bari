import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, selectedServices } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      message: message.trim(),
      selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
    };

    // Forward to backend REST API (PostgreSQL database via NeonDB)
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const backendRes = await fetch(`${API_BASE}/cms/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to submit message to backend" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received. We'll contact you within 24 hours.",
      data: data.data,
    });
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

