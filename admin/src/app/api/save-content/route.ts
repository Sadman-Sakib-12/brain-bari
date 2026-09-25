import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Mapping from store keys to actual file names used in admin and frontend
const keyToFileMap: Record<string, { adminFiles: string[]; frontendFiles: string[] }> = {
  settings: {
    adminFiles: ["siteSettings.json", "settings.json"],
    frontendFiles: ["siteSettings.json", "settings.json"]
  },
  siteSettings: {
    adminFiles: ["siteSettings.json", "settings.json"],
    frontendFiles: ["siteSettings.json", "settings.json"]
  },
  services: {
    adminFiles: ["services.json"],
    frontendFiles: ["coreServices.json", "services.json"]
  },
  servicePackages: {
    adminFiles: ["servicePackages.json"],
    frontendFiles: ["servicePackages.json"]
  },
  chatbots: {
    adminFiles: ["chatbots.json"],
    frontendFiles: ["specializedChatbots.json", "chatbots.json"]
  },
  whyChooseUs: {
    adminFiles: ["whyChooseUs.json"],
    frontendFiles: ["whyChooseUs.json"]
  },
  events: {
    adminFiles: ["events.json"],
    frontendFiles: ["events.json"]
  },
  caseStudies: {
    adminFiles: ["caseStudies.json"],
    frontendFiles: ["caseStudies.json"]
  },
  caseStudiesPage: {
    adminFiles: ["caseStudiesPage.json"],
    frontendFiles: ["caseStudiesPage.json"]
  },
  partners: {
    adminFiles: ["partners.json"],
    frontendFiles: ["partners.json"]
  },
  team: {
    adminFiles: ["team.json"],
    frontendFiles: ["team.json"]
  },
  portfolio: {
    adminFiles: ["portfolio.json"],
    frontendFiles: ["portfolio.json"]
  },
  blogs: {
    adminFiles: ["blogs.json"],
    frontendFiles: ["blogs.json"]
  },
  faqs: {
    adminFiles: ["faqs.json"],
    frontendFiles: ["faqs.json"]
  },
  orders: {
    adminFiles: ["orders.json"],
    frontendFiles: ["orders.json"]
  },
  consultations: {
    adminFiles: ["consultations.json"],
    frontendFiles: ["consultations.json"]
  },
  products: {
    adminFiles: ["products.json"],
    frontendFiles: ["products.json"]
  },
  industryExpertises: {
    adminFiles: ["industryExpertises.json"],
    frontendFiles: ["industryExpertises.json"]
  },
  about: {
    adminFiles: ["about.json"],
    frontendFiles: ["about.json"]
  },
  requests: {
    adminFiles: ["requests.json"],
    frontendFiles: ["requests.json"]
  },
  media: {
    adminFiles: ["media.json"],
    frontendFiles: ["media.json"]
  }
};

export async function POST(req: NextRequest) {
  try {
    const { key, data } = await req.json();
    if (!key || data === undefined) {
      return NextResponse.json({ error: "Missing key or data" }, { status: 400 });
    }

    const mapping = keyToFileMap[key] || {
      adminFiles: [`${key}.json`],
      frontendFiles: [`${key}.json`]
    };

    const adminDataDir = path.join(process.cwd(), "src", "data");
    const frontendDataDir = path.join(process.cwd(), "..", "frontend", "src", "data");

    const jsonString = JSON.stringify(data, null, 2);

    const writtenFiles: string[] = [];

    // 1. Write to Admin JSON files
    for (const fileName of mapping.adminFiles) {
      const filePath = path.join(adminDataDir, fileName);
      try {
        fs.writeFileSync(filePath, jsonString, "utf8");
        writtenFiles.push(`admin/${fileName}`);
      } catch (err) {
        console.warn(`Could not write to admin file ${filePath}:`, err);
      }
    }

    // 2. Write to Frontend JSON files (synchronize instantly)
    if (fs.existsSync(frontendDataDir)) {
      for (const fileName of mapping.frontendFiles) {
        const filePath = path.join(frontendDataDir, fileName);
        try {
          fs.writeFileSync(filePath, jsonString, "utf8");
          writtenFiles.push(`frontend/${fileName}`);
        } catch (err) {
          console.warn(`Could not sync to frontend file ${filePath}:`, err);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      key, 
      synced: true,
      writtenFiles 
    });
  } catch (error: any) {
    console.error("Error in save-content API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");
    const adminDataDir = path.join(process.cwd(), "src", "data");

    if (key) {
      const mapping = keyToFileMap[key] || { adminFiles: [`${key}.json`] };
      const fileName = mapping.adminFiles[0];
      const filePath = path.join(adminDataDir, fileName);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        return NextResponse.json({
          success: true,
          key,
          data: JSON.parse(fileContent)
        });
      }
      return NextResponse.json({ error: `File not found for key: ${key}` }, { status: 404 });
    }

    return NextResponse.json({ error: "Missing 'key' query parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Error reading content in save-content API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

