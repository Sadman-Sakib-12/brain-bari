import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const publicDir = path.join(process.cwd(), "public", "images");
  const cleanImagePath = path.join(publicDir, "hero_robot_clean.jpg");
  const defaultImagePath = path.join(publicDir, "hero_robot.jpg");

  const targetPath = fs.existsSync(cleanImagePath)
    ? cleanImagePath
    : fs.existsSync(defaultImagePath)
    ? defaultImagePath
    : null;

  if (targetPath) {
    const buffer = fs.readFileSync(targetPath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  }

  return new NextResponse("Image not found", { status: 404 });
}
