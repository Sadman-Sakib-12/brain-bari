import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, selectedServices, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const serviceList = Array.isArray(selectedServices) && selectedServices.length > 0
      ? selectedServices.join(", ")
      : "Custom AI Consultation";

    // Forward directly to Backend REST API (PostgreSQL database)
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    const backendRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: name.trim(),
        clientEmail: email.trim(),
        clientPhone: phone.trim(),
        serviceName: serviceList,
        serviceTitle: serviceList,
        requirements: message?.trim() || `Inquiry for ${serviceList}`,
        budget: "Custom Quote",
      }),
    });

    const backendData = await backendRes.json();
    return NextResponse.json({
      success: true,
      message: "Order placed successfully! We will contact you within 24 hours.",
      order: backendData.data || backendData,
    });
  } catch (error: any) {
    console.error("Error processing order submission:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing order." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    const orders = data.data || [];
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
