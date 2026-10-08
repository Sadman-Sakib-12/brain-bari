import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, date, timeSlot, topic, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required to schedule a consultation." },
        { status: 400 }
      );
    }

    // Forward directly to Backend REST API (PostgreSQL database)
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    const backendRes = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || "",
        company: company?.trim() || "Website Inquiry",
        topic: topic?.trim() || "AI & Software Consultation",
        date: date || new Date().toISOString().split("T")[0],
        timeSlot: timeSlot || "",
        message: message?.trim() || "Consultation requested from website.",
        clientName: name.trim(),
        clientEmail: email.trim(),
        clientPhone: phone?.trim() || "",
        notes: message?.trim() || "Consultation requested from website.",
      }),
    });

    const backendData = await backendRes.json();
    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully! Invitation sent to your email.",
      booking: backendData.data || backendData,
    });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    const res = await fetch(`${API_BASE}/bookings`);
    const data = await res.json();
    const bookings = data.data || [];
    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
