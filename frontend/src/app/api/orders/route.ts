import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `BB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const serviceList = Array.isArray(selectedServices) && selectedServices.length > 0
      ? selectedServices.join(", ")
      : "Custom AI Consultation";

    const newOrder = {
      id: orderId,
      orderNumber,
      clientName: name.trim(),
      clientEmail: email.trim(),
      clientPhone: phone.trim(),
      serviceTitle: serviceList,
      serviceCategory: "ai-services",
      budget: "Custom Quote",
      timeline: "Standard (2-3 Weeks)",
      requirements: message?.trim() || `Inquiry for ${serviceList}`,
      status: "Pending",
      quotedPrice: 0,
      paidAmount: 0,
      submissionDate: new Date().toISOString(),
    };

    // 1. Sync to Admin data (admin/src/data/orders.json)
    const adminOrdersPath = path.join(process.cwd(), "..", "admin", "src", "data", "orders.json");
    const frontendOrdersPath = path.join(process.cwd(), "src", "data", "orders.json");

    let savedToAdmin = false;
    try {
      let orders = [];
      if (fs.existsSync(adminOrdersPath)) {
        const raw = fs.readFileSync(adminOrdersPath, "utf8");
        orders = JSON.parse(raw);
      }
      orders.unshift(newOrder);
      fs.writeFileSync(adminOrdersPath, JSON.stringify(orders, null, 2), "utf8");
      savedToAdmin = true;
    } catch (adminErr) {
      console.warn("Could not save to admin/orders.json:", adminErr);
    }

    // 2. Also keep in frontend/src/data/orders.json
    try {
      let orders = [];
      if (fs.existsSync(frontendOrdersPath)) {
        const raw = fs.readFileSync(frontendOrdersPath, "utf8");
        orders = JSON.parse(raw);
      }
      orders.unshift(newOrder);
      fs.writeFileSync(frontendOrdersPath, JSON.stringify(orders, null, 2), "utf8");
    } catch (feErr) {
      console.warn("Could not save to frontend/orders.json:", feErr);
    }

    // 3. Optional: Forward to backend REST API if running
    try {
      fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      }).catch(() => {
        // Standalone mode is fine
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "Order placed successfully! We will contact you within 24 hours.",
      order: newOrder,
      savedToAdmin,
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
    const adminOrdersPath = path.join(process.cwd(), "..", "admin", "src", "data", "orders.json");
    const frontendOrdersPath = path.join(process.cwd(), "src", "data", "orders.json");

    let orders = [];
    if (fs.existsSync(adminOrdersPath)) {
      orders = JSON.parse(fs.readFileSync(adminOrdersPath, "utf8"));
    } else if (fs.existsSync(frontendOrdersPath)) {
      orders = JSON.parse(fs.readFileSync(frontendOrdersPath, "utf8"));
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
