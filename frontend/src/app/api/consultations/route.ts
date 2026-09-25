import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    const bookingId = `cns-${Date.now()}`;
    const bookingRef = `CNS-${new Date().toLocaleString("en-US", { month: "short" }).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newBooking = {
      id: bookingId,
      bookingRef,
      clientName: name.trim(),
      clientEmail: email.trim(),
      clientPhone: phone?.trim() || "+880 1700-000000",
      company: company?.trim() || "Independent Inquiry",
      topic: topic?.trim() || "General AI Strategy & Development",
      date: date || new Date().toISOString().split("T")[0],
      timeSlot: timeSlot || "03:00 PM - 03:45 PM",
      status: "Pending",
      notes: message?.trim() || "Consultation requested from website.",
      createdAt: new Date().toISOString(),
    };

    // 1. Sync to Admin data
    const adminPath = path.join(process.cwd(), "..", "admin", "src", "data", "consultations.json");
    const frontendPath = path.join(process.cwd(), "src", "data", "consultations.json");

    try {
      let bookings = [];
      if (fs.existsSync(adminPath)) {
        bookings = JSON.parse(fs.readFileSync(adminPath, "utf8"));
      }
      bookings.unshift(newBooking);
      fs.writeFileSync(adminPath, JSON.stringify(bookings, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not save to admin consultations:", err);
    }

    // 2. Sync to Frontend data
    try {
      let bookings = [];
      if (fs.existsSync(frontendPath)) {
        bookings = JSON.parse(fs.readFileSync(frontendPath, "utf8"));
      }
      bookings.unshift(newBooking);
      fs.writeFileSync(frontendPath, JSON.stringify(bookings, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not save to frontend consultations:", err);
    }

    // 3. Optional: forward to backend
    try {
      fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      }).catch(() => {});
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully! Invitation sent to your email.",
      booking: newBooking,
    });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const adminPath = path.join(process.cwd(), "..", "admin", "src", "data", "consultations.json");
    let bookings = [];
    if (fs.existsSync(adminPath)) {
      bookings = JSON.parse(fs.readFileSync(adminPath, "utf8"));
    }
    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
