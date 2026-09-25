import prisma from '../config/prisma';

async function main() {
  console.log('🌱 Starting Botbari Database Seeding...');

  // 1. Seed Admin User
  const adminEmail = 'admin@botbari.ai';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Botbari Admin',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        phone: '+880 1700-000000',
        company: 'Botbari AI HQ',
      },
    });
    console.log('✅ Admin user created: admin@botbari.ai');
  }

  // 2. Seed Services
  const services = [
    {
      title: 'Autonomous AI Chatbot Development',
      slug: 'ai-chatbot',
      category: 'ai-chatbot',
      shortDesc: 'Custom LLM-powered conversational agents with multi-turn memory, CRM integration, and instant support.',
      price: 499,
      deliveryDays: 5,
      features: [
        'Multi-channel integration (Web, WhatsApp, Messenger)',
        'Custom Knowledgebase & Vector RAG',
        'Human Handover & Live Agent Escalation',
        'Real-time Analytics & Token Auditing',
      ],
      badge: 'Most Popular',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    },
    {
      title: 'Custom AI Assistant & Internal Automation',
      slug: 'custom-ai',
      category: 'custom-ai',
      shortDesc: 'Tailored enterprise AI tools that automate internal repetitive tasks, document scanning, and data extraction.',
      price: 899,
      deliveryDays: 7,
      features: [
        'Document OCR & Automated Summarization',
        'Custom Fine-Tuned LLaMA / DeepSeek models',
        'Enterprise RBAC & SOC2 Compliance',
        'Bi-directional API & ERP Connectors',
      ],
      badge: 'Enterprise',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    },
    {
      title: 'Full-Stack AI SaaS Development',
      slug: 'ai-saas',
      category: 'ai-saas',
      shortDesc: 'Production-ready AI SaaS applications with Stripe billing, Next.js frontend, authentication, and credit metering.',
      price: 1499,
      deliveryDays: 14,
      features: [
        'Next.js 15 App Router & NeonDB/Prisma backend',
        'Stripe Recurring Subscriptions & Metered Usage',
        'Multi-tenant Architecture & Admin Portal',
        'High-converting Dark Mode Glassmorphism UI',
      ],
      badge: 'All-In-One',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    },
    {
      title: 'Interactive 3D Web & Immersive Experience',
      slug: 'ai-3d',
      category: 'ai-3d',
      shortDesc: 'Stunning Three.js, Spline, and WebGL 3D web experiences that captivate visitors and elevate brand authority.',
      price: 699,
      deliveryDays: 6,
      features: [
        'Three.js & React Three Fiber integration',
        'Optimized 60 FPS mobile performance',
        'Interactive Physics & Scroll-driven 3D controls',
        'Dark mode cyber aesthetics & holographic effects',
      ],
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${services.length} Core Services.`);

  // 3. Seed Chatbots
  const chatbots = [
    {
      name: 'MediAssist Healthcare Triage Bot',
      category: 'Healthcare',
      price: 599,
      deliveryTime: '3-4 Days',
      tags: ['HIPAA Ready', 'Doctor Handover', 'Symptom Triage'],
      description: 'Understands patient symptoms in multiple languages, schedules appointments, and routes urgent cases to on-call doctors.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
    },
    {
      name: 'LeadRocket B2B Sales Assistant',
      category: 'Sales & Lead Gen',
      price: 499,
      deliveryTime: '2-3 Days',
      tags: ['HubSpot Sync', 'Calendar Booking', 'Lead Scoring'],
      description: 'Engages inbound website visitors, qualifies company budget, and books qualified meetings directly into sales reps calendars.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    },
    {
      name: 'OmniSupport Customer Service Agent',
      category: 'E-commerce',
      price: 649,
      deliveryTime: '4-5 Days',
      tags: ['Shopify Sync', 'Order Tracking', 'Multi-Language'],
      description: 'Resolves 80% of customer support tickets automatically: tracking deliveries, handling returns, and recommending cross-sell products.',
      image: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=600',
    },
  ];

  for (const c of chatbots) {
    const existing = await prisma.chatbot.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.chatbot.create({ data: c });
    }
  }
  console.log(`✅ Seeded ${chatbots.length} Specialized Chatbots.`);

  // 4. Seed Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroHeadline: 'Deploy Autonomous AI Chatbots & Next-Gen Software Solutions',
      heroSubheadline:
        'From high-converting customer service AI agents to enterprise full-stack platforms, Botbari crafts scalable AI systems that accelerate your business growth.',
      heroTags: ['Enterprise Grade', '99.9% Uptime', 'Custom Trained LLM', 'Stripe Verified'],
      phone: '+880 1700-000000',
      email: 'contact@botbari.ai',
      whatsapp: '+8801700000000',
      address: 'Dhaka, Bangladesh',
      socialLinks: {
        twitter: 'https://twitter.com/botbari_ai',
        linkedin: 'https://linkedin.com/company/botbari',
        github: 'https://github.com/botbari',
      },
    },
  });
  console.log('✅ Site Settings seeded.');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
