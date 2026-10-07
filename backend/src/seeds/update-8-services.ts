import prisma from '../config/prisma';

async function updateUniqueServices() {
  console.log('🔄 Updating 8 Services to be completely distinct and unique...');

  const servicesData = [
    {
      slug: 'ai-chatbot',
      title: 'AI Customer Support Chatbot',
      category: 'AI Chatbot',
      shortDesc: 'Intelligent 24/7 conversational agents trained on your business docs, FAQs, and live chat APIs for instant customer care.',
      fullDesc: 'Production-ready AI customer service chatbot with vector RAG knowledge retrieval, multi-turn memory, and seamless human agent escalation.',
      price: 499,
      deliveryDays: 5,
      features: [
        'Multi-channel integration (Web, WhatsApp, Messenger)',
        'Custom Knowledgebase & Vector RAG',
        'Human Handover & Live Agent Escalation',
        'Real-time Analytics & Token Auditing',
      ],
      badge: 'Most Popular',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'ai-agents',
      title: 'AI Voice Assistant & Call Automation',
      category: 'AI Chatbot',
      shortDesc: 'Natural human-sounding AI voice agent for inbound phone support, outbound lead qualification, and automated appointment booking.',
      fullDesc: 'Ultra-low latency telephony voice AI powered by Twilio, OpenAI Realtime, and ElevenLabs with real-time CRM synchronization.',
      price: 599,
      deliveryDays: 7,
      features: [
        'Ultra-low latency voice synthesis (<500ms)',
        'Telephony & Twilio API phone integration',
        'Call transcription & CRM synchronization',
        'Multi-language & accent adaptation',
      ],
      badge: 'Hot',
      image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'ai-saas',
      title: 'Full-Stack AI SaaS Platform Engineering',
      category: 'AI SaaS',
      shortDesc: 'Production-ready AI SaaS applications with Stripe recurring subscriptions, user authentication, and credit metering.',
      fullDesc: 'Complete end-to-end multi-tenant SaaS architecture built on Next.js 15, NeonDB/Prisma, with Stripe billing and enterprise admin dashboards.',
      price: 1499,
      deliveryDays: 14,
      features: [
        'Next.js 15 App Router & NeonDB/Prisma backend',
        'Stripe Recurring Subscriptions & Metered Usage',
        'Multi-tenant Architecture & Admin Portal',
        'High-converting Dark Mode Glassmorphism UI',
      ],
      badge: 'Enterprise',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'saas-product',
      title: 'AI Micro-SaaS & Workflow Automation Tools',
      category: 'AI SaaS',
      shortDesc: 'Lightweight niche AI software tools and browser extensions that automate specific business workflows for paying subscribers.',
      fullDesc: 'Rapid MVP deployment of niche AI productivity tools with one-time or subscription billing, license key verification, and viral referral loops.',
      price: 799,
      deliveryDays: 10,
      features: [
        'Micro-billing & License Key verification',
        'Rapid 10-day market launch readiness',
        'OpenAI / Claude API fine-tuning & prompt caching',
        'Built-in user onboarding & viral referral mechanics',
      ],
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'custom-ai',
      title: 'Private Enterprise AI Assistant (RAG & Security)',
      category: 'Custom AI Assistant',
      shortDesc: 'Private enterprise copilot that connects to your internal company documents, Slack, Notion, and Google Drive securely.',
      fullDesc: 'Tailored enterprise AI tools that automate internal repetitive tasks, document scanning, and confidential data extraction with SOC2-ready security.',
      price: 899,
      deliveryDays: 7,
      features: [
        'Document OCR & Automated Summarization',
        'Custom Fine-Tuned LLaMA / DeepSeek models',
        'Enterprise RBAC & SOC2-ready Compliance',
        'Bi-directional API & ERP Connectors',
      ],
      badge: 'SOC2 Ready',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'enterprise-software',
      title: 'Autonomous Multi-Agent AI Workflows',
      category: 'Custom AI Assistant',
      shortDesc: 'Autonomous agent swarms powered by LangChain and CrewAI that research, generate reports, and execute complex business tasks.',
      fullDesc: 'Self-correcting multi-agent systems with tool calling, vector memory, and automated task dispatching across marketing, research, and sales.',
      price: 1199,
      deliveryDays: 12,
      features: [
        'Self-correcting Multi-Agent Execution',
        'Web browsing & automated data extraction',
        'Long-term vector memory store',
        'Automated error handling & fallback routing',
      ],
      badge: 'Cutting Edge',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'ai-3d',
      title: 'Interactive 3D Web & Immersive Experience',
      category: 'AI & 3D Web/Apps',
      shortDesc: 'Stunning Three.js, Spline, and WebGL 3D web experiences that captivate visitors and elevate brand authority.',
      fullDesc: 'Interactive 3D interfaces with 60 FPS mobile performance, realistic shaders, scroll-driven camera movements, and holographic visual effects.',
      price: 699,
      deliveryDays: 6,
      features: [
        'Three.js & React Three Fiber integration',
        'Optimized 60 FPS mobile performance',
        'Interactive Physics & Scroll-driven 3D controls',
        'Dark mode cyber aesthetics & holographic effects',
      ],
      badge: 'Award Winning',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      slug: 'web-app-dev',
      title: 'High-Performance Web & Mobile App Development',
      category: 'AI & 3D Web/Apps',
      shortDesc: 'Fast, responsive web applications and cross-platform mobile apps built with modern Next.js, React Native, and Tailwind CSS.',
      fullDesc: 'Pixel-perfect UI implementation, progressive web app offline capabilities, sub-second page speeds, and seamless backend API integration.',
      price: 449,
      deliveryDays: 8,
      features: [
        'Perfect 100/100 Core Web Vitals optimization',
        'Responsive mobile-first UI with dark mode',
        'Cross-platform iOS & Android compatibility',
        'Secure REST/GraphQL API integration',
      ],
      badge: 'High Speed',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({
      where: {
        OR: [{ slug: s.slug }, { title: { contains: s.slug, mode: 'insensitive' } }],
      },
    });

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: s,
      });
      console.log(`✅ Updated existing service [${s.slug}] -> ${s.title}`);
    } else {
      await prisma.service.create({
        data: s,
      });
      console.log(`✅ Created service [${s.slug}] -> ${s.title}`);
    }
  }

  console.log('🎉 Successfully updated all 8 services with distinct titles, images, and categories!');
}

updateUniqueServices()
  .catch((e) => {
    console.error('❌ Error updating services:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
