export interface CoreService {
  id: string;
  slug: string;
  title: string;
  category: "ai-chatbot" | "ai-saas" | "custom-ai" | "ai-3d" | string;
  badge: string;
  startingPrice: number;
  deliveryDays: number;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  image: string;
  rating: number;
  active: boolean;
}

export interface SpecializedChatbot {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceTag: string;
  price: number;
  deliveryDays: number;
  badge: string;
  features: string[];
  image: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  statusColor: string;
  shortDesc: string;
  client: string;
  year: string;
  techStack: string[];
  metrics: string;
  image: string;
  liveUrl: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface BlogItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface OrderPayload {
  serviceType: string;
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  budget: string;
  timeline: string;
  description: string;
}
