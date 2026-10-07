import React from "react";
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  PhoneCall,
  Code2,
  Bot,
  ShoppingBag,
  FolderGit2,
  Briefcase,
  BookOpen,
  Users,
  Handshake,
  Calendar,
  Inbox,
  Building2,
  Megaphone,
  Eye,
  Compass,
  FileText,
  ShieldCheck,
  Settings,
  Star,
  Layers,
  Scale,
} from "lucide-react";

export interface SubNavItem {
  id: string;
  title: string;
  href: string;
  tab?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number | string;
  subItems?: SubNavItem[];
}

export interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export function getNavGroups(pendingRequests: number): NavGroup[] {
  return [
    {
      groupTitle: "MAIN",
      items: [
        {
          id: "dashboard",
          title: "Dashboard",
          subtitle: "Quick actions & business stats",
          icon: LayoutDashboard,
          href: "/",
        },
      ],
    },
    {
      groupTitle: "BRAIN BARI CMS",
      items: [
        {
          id: "brain-bari-cms",
          title: "Brain Bari CMS",
          subtitle: "Pages, sections & content",
          icon: Globe,
          href: "/website/navbar",
          badge: "14",
          subItems: [
            {
              id: "cms-navbar",
              title: "Navbar & Header",
              href: "/website/navbar",
              icon: Compass,
            },
            {
              id: "cms-hero",
              title: "Hero Banner",
              href: "/website/homepage?tab=hero",
              tab: "hero",
              icon: Sparkles,
            },
            {
              id: "cms-logos",
              title: "Client Logos Ticker",
              href: "/website/homepage?tab=logos",
              tab: "logos",
              icon: Building2,
            },
            {
              id: "cms-whychoose",
              title: "Why Choose Us",
              href: "/website/homepage?tab=whyChooseUs",
              tab: "whyChooseUs",
              icon: ShieldCheck,
            },
            {
              id: "cms-workflow",
              title: "Workflow Steps",
              href: "/website/homepage?tab=workflow",
              tab: "workflow",
              icon: Layers,
            },
            {
              id: "cms-reviews",
              title: "Client Testimonials",
              href: "/website/homepage?tab=reviews",
              tab: "reviews",
              icon: Star,
            },
            {
              id: "cms-conversions",
              title: "Conversions & CTA",
              href: "/website/homepage?tab=cta",
              tab: "cta",
              icon: Megaphone,
            },
            {
              id: "cms-sections",
              title: "Sections Visibility",
              href: "/website/homepage?tab=sections",
              tab: "sections",
              icon: Eye,
            },
            {
              id: "cms-about",
              title: "About Us",
              href: "/website/about",
              icon: Building2,
            },
            {
              id: "cms-team",
              title: "Team Directory",
              href: "/team",
              icon: Users,
            },
            {
              id: "cms-blog",
              title: "Blog Articles",
              href: "/blog",
              icon: BookOpen,
            },
            {
              id: "cms-events",
              title: "Events & Workshops",
              href: "/events",
              icon: Calendar,
            },
            {
              id: "cms-industries",
              title: "Industries & Badges",
              href: "/website/industries",
              icon: Building2,
            },
            {
              id: "cms-contact",
              title: "Contact & Office Info",
              href: "/website/contact",
              icon: PhoneCall,
            },
            {
              id: "cms-footer",
              title: "Footer",
              href: "/website/footer",
              icon: FileText,
            },
            {
              id: "cms-privacy",
              title: "Privacy Policy",
              href: "/website/privacy",
              icon: ShieldCheck,
            },
            {
              id: "cms-terms",
              title: "Terms & Conditions",
              href: "/website/terms",
              icon: Scale,
            },
          ],
        },
      ],
    },
    {
      groupTitle: "SERVICES & PRODUCTS",
      items: [
        {
          id: "services",
          title: "Core Services",
          subtitle: "8 AI offerings, packages & pricing",
          icon: Code2,
          href: "/services",
        },
        {
          id: "chatbots",
          title: "AI Chatbots",
          subtitle: "Chatbots catalog & demo showcase",
          icon: Bot,
          href: "/chatbots",
        },
        {
          id: "products",
          title: "AI Products & SaaS",
          subtitle: "Pre-built AI solutions & tools",
          icon: ShoppingBag,
          href: "/products",
        },
      ],
    },
    {
      groupTitle: "PORTFOLIO & CASE STUDIES",
      items: [
        {
          id: "projects",
          title: "Our Work (Portfolio)",
          subtitle: "Manage /work page projects & stats",
          icon: FolderGit2,
          href: "/projects",
        },
        {
          id: "case-studies",
          title: "Case Studies & Capabilities",
          subtitle: "Technical case studies & offerings",
          icon: Briefcase,
          href: "/case-studies",
        },
      ],
    },
    {
      groupTitle: "CLIENT LEADS & INQUIRIES",
      items: [
        {
          id: "requests",
          title: "Orders & Inquiries",
          subtitle: "Quote requests, bookings & leads",
          icon: Inbox,
          href: "/requests",
          badge: pendingRequests > 0 ? pendingRequests : undefined,
        },
      ],
    },
    {
      groupTitle: "COMPANY & ACCESS",
      items: [
        {
          id: "users",
          title: "User Accounts",
          subtitle: "Admin permissions & staff accounts",
          icon: ShieldCheck,
          href: "/users",
        },
        {
          id: "partners",
          title: "Partners",
          subtitle: "Affiliate & strategic partner program",
          icon: Handshake,
          href: "/partners",
        },
      ],
    },
    {
      groupTitle: "SYSTEM",
      items: [
        {
          id: "settings",
          title: "Website Settings",
          subtitle: "Platform profile, SEO, SMTP & security",
          icon: Settings,
          href: "/settings",
        },
      ],
    },
  ];
}
