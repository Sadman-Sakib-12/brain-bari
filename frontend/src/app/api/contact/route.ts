import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    const msgId = `msg-${Date.now()}`;
    const serviceType = Array.isArray(selectedServices) && selectedServices.length > 0
      ? selectedServices.join(", ")
      : "General Inquiry";

    const newMessage = {
      id: msgId,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      subject: `Inquiry regarding ${serviceType}`,
      message: message.trim(),
      date: new Date().toISOString(),
      status: "New",
      serviceType,
    };

    // 1. Sync to Admin requests.json
    const adminPath = path.join(process.cwd(), "..", "admin", "src", "data", "requests.json");
    try {
      if (fs.existsSync(adminPath)) {
        const raw = fs.readFileSync(adminPath, "utf8");
        const data = JSON.parse(raw);
        if (!data.contactMessages) data.contactMessages = [];
        data.contactMessages.unshift(newMessage);
        fs.writeFileSync(adminPath, JSON.stringify(data, null, 2), "utf8");
      }
    } catch (err) {
      console.warn("Could not save to admin requests:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received. We'll contact you within 24 hours.",
      data: newMessage,
    });
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
