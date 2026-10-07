import prisma from '../config/prisma';

async function main() {
  console.log('🌱 Starting Brain Bari Database Seeding...');

  // 1. Seed Admin User
  const adminEmail = 'admin@brainbari.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Brain Bari Admin',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        phone: '+880 1700-000000',
        company: 'Brain Bari Technologies HQ',
      },
    });
    console.log('✅ Admin user created: admin@brainbari.com');
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
      image: '/images/service_ai_chatbot.jpg',
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
      image: '/images/service_custom_ai.jpg',
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
      image: '/images/service_ai_saas.jpg',
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
      image: '/images/service_ai_3d.jpg',
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

  // 4. Seed Products (SaaS & AI Platforms)
  const products = [
    {
      title: 'AI Health Info & Awareness',
      slug: 'ai-health-info',
      tagline: 'HealthTech / SaaS / Content Platform',
      category: 'HealthTech',
      description: 'Empowering individuals with reliable, AI-guided health information, wellness tips, and multilingual awareness. Designed to reduce misinformation and deliver personalized guidance.',
      features: [
        'AI Symptom Pre-checker & Wellness Guides',
        'Multilingual Bangla & English Healthcare Advice',
        '24/7 Verified Health Knowledge Base',
        'Emergency Contact & Clinic Locators',
      ],
      status: 'Production Ready',
      demoUrl: 'https://health.brainbari.com/',
      logo: {
        icon: 'heart',
        color: 'bg-rose-500',
        badge: 'HealthBari',
        subtitle: 'AI Health Platform',
      },
      isFeatured: true,
    },
    {
      title: 'Brain Bari Ballot',
      slug: 'brain-bari-ballot',
      tagline: 'Digital voting and public opinion platform',
      category: 'CivicTech',
      description: 'Next-generation digital voting and civic polling platform. Ensures cryptographic integrity, transparent sentiment analysis, and instant election result reporting.',
      features: [
        'Real-time Transparent Vote Counting',
        'Anti-Fraud Voter Authentication',
        'Public Sentiment & Polling Analytics',
        'Verifiable Audit Logs & Reporting',
      ],
      status: 'Beta Deployment',
      demoUrl: 'https://ballot.brainbari.com/',
      logo: {
        icon: 'eye',
        color: 'bg-blue-600',
        badge: 'BallotEye',
        subtitle: 'Civic Voting Tech',
      },
      isFeatured: true,
    },
    {
      title: 'Brain Bari Law',
      slug: 'brain-bari-law',
      tagline: 'Digital legal information & assistance platform',
      category: 'LegalTech',
      description: 'AI-powered legal intelligence system that simplifies complex legal research, contract review, and statute analysis for legal professionals and everyday citizens.',
      features: [
        'Bangladesh & International Law Search',
        'Contract Clause Summarization & Risk Audit',
        '24/7 Instant Citizen Legal Guidance',
        'Automated Legal Document Drafter',
      ],
      status: 'Active Service',
      demoUrl: 'https://law.brainbari.com/',
      logo: {
        icon: 'message',
        color: 'bg-indigo-600',
        badge: 'LawBari',
        subtitle: 'Legal Intelligence',
      },
      isFeatured: true,
    },
    {
      title: 'Brain Bari EduBari',
      slug: 'brain-bari-edubari',
      tagline: 'Digital education and adaptive learning platform',
      category: 'EdTech',
      description: 'Intelligent learning platform leveraging adaptive AI to personalize education for students, automate grading for teachers, and provide interactive tutoring.',
      features: [
        'Personalized Student Learning Paths',
        'Automated Quiz Creation & Instant Evaluation',
        'Interactive AI Subject Tutor',
        'Institutional Analytics & Performance Tracking',
      ],
      status: 'Production Ready',
      demoUrl: 'https://edubari.brainbari.com/',
      logo: {
        icon: 'book',
        color: 'bg-emerald-600',
        badge: 'EduBari',
        subtitle: 'Adaptive Learning',
      },
      isFeatured: true,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Seeded ${products.length} Products in Database.`);

  // 5. Seed Portfolios / Case Studies
  const portfolios = [
    {
      title: 'Automated Clinical Assistant & Appointment Engine',
      slug: 'clinical-assistant',
      client: '24th Asian Bioethics Healthcare Network',
      category: 'Healthcare AI',
      description: 'Engineered an intelligent conversational AI chatbot integrated with hospital management databases, reducing patient intake waiting times by 68%.',
      tags: ['Next.js', 'Python FastAPI', 'LangChain', 'OpenAI GPT-4o'],
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      liveUrl: 'https://asianbioethics.org',
    },
    {
      title: 'Cross-Platform Tax Filing & Calculator Automation',
      slug: 'tax-filing-automation',
      client: 'BD Tax Automated Solutions',
      category: 'Fintech & SaaS',
      description: 'Architected a high-load tax computation engine that accurately automates complex Bangladeshi corporate and individual tax slabs with instant PDF certificate exports.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
      liveUrl: 'https://bdtax.com',
    },
    {
      title: 'Omnichannel Conversational Sales & Support Bot',
      slug: 'omnichannel-sales-bot',
      client: 'Global Logistics & Commerce Group',
      category: 'Enterprise Bot',
      description: 'Deployed bilingual customer support chatbots across WhatsApp, Web and Messenger, cutting repetitive tier-1 support ticket volume by 74%.',
      tags: ['Meta WhatsApp Cloud API', 'Node.js', 'Redis', 'Vector DB'],
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=800',
      liveUrl: 'https://globallogistics.com',
    },
    {
      title: 'Interactive 3D Web Product Configurator',
      slug: '3d-web-configurator',
      client: 'ArchTech Modern Interiors',
      category: '3D Web Development',
      description: 'Engineered real-time 3D product visualizer in Three.js allowing enterprise clients to customize furniture and architectural models in browser without plugin installations.',
      tags: ['Three.js', 'WebGL', 'React Three Fiber', 'Next.js'],
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      liveUrl: 'https://archtech3d.com',
    },
  ];

  for (const pf of portfolios) {
    await prisma.portfolio.upsert({
      where: { slug: pf.slug },
      update: pf,
      create: pf,
    });
  }
  console.log(`✅ Seeded ${portfolios.length} Portfolios in Database.`);

  // 6. Seed Blogs
  const blogs = [
    {
      slug: 'how-ai-is-changing-skill-development',
      title: 'How AI Is Changing Skill Development in Bangladesh – A Practical Guide',
      author: 'Brain Bari Research Team',
      tags: ['AI Trends', 'Skill Development', 'Future of Work'],
      excerpt: "Bangladesh stands at a pivotal moment. With a large, young, and increasingly digitally connected population, the nation's economic trajectory hinges on equipping its workforce with future-proof skills.",
      content: `## The AI Revolution in Workforce Education

Artificial Intelligence is reshaping how individuals learn, build software, and navigate the technical economy. Across Bangladesh, thousands of developers and university students are leveraging LLM tools, automated code refactoring, and AI-driven pedagogical assistants to 10x their productivity.

### Core Focus Areas:
1. **Interactive Mentorship**: Generative models acting as 24/7 personal coding tutors.
2. **Contextual Evaluation**: Real-time feedback on architecture, efficiency, and code safety.
3. **Closing the Global Gap**: Equipping local talent with enterprise tools matching Silicon Valley standards.

At Brain Bari, we believe practical hands-on application beats passive observation every time.`,
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      isPublished: true,
    },
    {
      slug: 'top-tech-skills-students-must-learn',
      title: 'Top Tech Skills Students Must Learn Before Entering the Job Market',
      author: 'Brain Bari Engineering',
      tags: ['Tutorials', 'Careers', 'FullStack'],
      excerpt: 'The modern job market is rapidly evolving, with technology becoming the backbone of almost every industry. Equipping yourself with the right knowledge can significantly boost your employability.',
      content: `## Navigating the Modern Software Engineering Landscape

Graduating with pure theoretical knowledge is no longer sufficient. Enterprise teams look for developers with production experience across modern TypeScript frameworks, cloud databases, and AI API integrations.

### Key Skills to Master:
- **Next.js 15 & Modern React**: Server Actions, streaming, and modern UI architectures.
- **Relational Databases & ORMs**: PostgreSQL, Prisma, NeonDB, and query optimization.
- **Generative AI Protocols**: Vector databases (Pinecone/Milvus), LangChain, and RAG architectures.
- **DevOps & Containerization**: Docker, CI/CD pipelines, and cloud platform deployments.`,
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      isPublished: true,
    },
    {
      slug: 'career-readiness-in-ai-era',
      title: "Career Readiness in the AI Era: Skills You Can't Ignore Anymore",
      author: 'Brain Bari Editorial',
      tags: ['Case Studies', 'AI Strategy', 'Leadership'],
      excerpt: "The landscape of work is undergoing a seismic shift, driven primarily by the rapid advancement of Artificial Intelligence. Career readiness is about adapting to and thriving alongside AI.",
      content: `## Embracing the AI-Augmented Workflow

AI will not replace software engineers; engineers who effectively leverage AI will replace those who do not. From automating boilerplate tasks to validating complex system edge cases, human creativity paired with machine speed is the future.

We encourage every professional to build domain expertise, understand architectural trade-offs, and treat AI as a high-powered cognitive lever.`,
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      isPublished: true,
    },
  ];

  for (const b of blogs) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }
  console.log(`✅ Seeded ${blogs.length} Blogs in Database.`);

  // 7. Seed FAQs
  const faqs = [
    {
      id: 'faq-1',
      question: 'How long does it take to develop and deploy an AI Chatbot?',
      answer: 'Our standard customized AI chatbots (Website, WhatsApp, Auto-Order) are typically trained and fully deployed within 9 to 14 business days, complete with knowledge-base testing and staff training.',
      category: 'Chatbots',
      orderIndex: 1,
      isActive: true,
    },
    {
      id: 'faq-2',
      question: "Can Brain Bari's AI chatbots integrate with our existing CRM and databases?",
      answer: 'Yes! We build bespoke API integrations and webhooks for popular platforms including WordPress, Shopify, HubSpot, Salesforce, custom PostgreSQL/MongoDB databases, and custom ERP systems.',
      category: 'Integrations',
      orderIndex: 2,
      isActive: true,
    },
    {
      id: 'faq-3',
      question: 'How do you ensure enterprise data privacy and model accuracy?',
      answer: 'We enforce strict TLS 1.3 encryption, isolated tenant vector databases, and implement rigorous guardrails with prompt safety evaluations to guarantee 99%+ answer accuracy without data leakage.',
      category: 'Security',
      orderIndex: 3,
      isActive: true,
    },
    {
      id: 'faq-4',
      question: 'What payment methods are supported for our project milestones?',
      answer: 'We accept major credit/debit cards via Stripe (Visa, MasterCard, Amex) as well as bank transfers and mobile financial services (bKash/Nagad) for local enterprises in Bangladesh.',
      category: 'Billing',
      orderIndex: 4,
      isActive: true,
    },
  ];

  for (const f of faqs) {
    await prisma.faq.upsert({
      where: { id: f.id },
      update: f,
      create: f,
    });
  }
  console.log(`✅ Seeded ${faqs.length} FAQs in Database.`);

  // 8. Seed Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroHeadline: 'Powering Ideas with AI & Software',
      heroSubheadline:
        'From high-converting customer service AI agents to enterprise full-stack platforms, Brain Bari crafts scalable AI systems that accelerate your business growth.',
      heroTags: ['AI Solutions', 'Custom Software', 'SaaS Development'],
      phone: '+8801754-958008',
      email: 'contact@brainbari.com',
      whatsapp: '8801754958008',
      address: 'Mirpur-10, Dhaka 1216, Bangladesh',
      socialLinks: {
        twitter: 'https://x.com/brain_bari',
        linkedin: 'https://www.linkedin.com/company/brainbari',
        facebook: 'https://www.facebook.com/brainbari',
        github: 'https://github.com/brainbari',
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
