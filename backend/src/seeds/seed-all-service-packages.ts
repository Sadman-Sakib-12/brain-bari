import prisma from '../config/prisma';

async function seedAllServicePackages() {
  console.log('🔄 Seeding distinct deliverable packages for all 8 services...');

  const servicePackagesData: Record<string, any> = {
    'ai-chatbot': {
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Intelligent Conversational ',
      heroTitleGradient: 'AI Customer Support Chatbot',
      heroTitleSuffix: ' for Enterprise',
      paragraphs: [
        'We design, build, and deploy domain-trained AI chatbots capable of human-like comprehension, multi-turn reasoning, and instant query resolution across 50+ languages.',
        'Whether integrated into your customer-facing web portal, WhatsApp Business, or internal Slack channels, our bots connect directly to your knowledge base.',
      ],
      packages: [
        {
          id: 'bot-pkg-1',
          title: 'Smart Website AI Chatbot',
          meta: 'Starting at $499 • 5 Days Turnaround',
          price: 'Start $499',
          description: 'Interactive, branded website bot trained on your documentation, FAQs, and product catalogs with automated lead qualification.',
          features: ['Instant 24/7 Support', 'RAG Pipeline Training', 'Human Agent Handoff', 'Custom UI Theming'],
          image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Smart%20Website%20AI%20Chatbot',
        },
        {
          id: 'bot-pkg-2',
          title: 'Omnichannel WhatsApp & CRM Bot',
          meta: 'Starting at $650 • 7 Days Turnaround',
          price: 'Start $650',
          description: 'Automated order booking and customer retention bot directly on WhatsApp Business with real-time payment link dispatch.',
          features: ['WhatsApp Cloud API Integration', 'Catalog Browsing', 'Order Confirmation & Invoicing', 'Multi-Admin Dashboard'],
          image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Omnichannel%20WhatsApp%20Bot',
        },
      ],
    },
    'ai-agents': {
      image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Next-Generation Telephony ',
      heroTitleGradient: 'AI Voice Assistant & Call Automation',
      heroTitleSuffix: ' Agents',
      paragraphs: [
        'Natural human-sounding conversational voice AI for inbound phone support, outbound lead qualification, and automated appointment scheduling.',
        'Built with ultra-low latency audio streaming (<500ms), speech recognition, and instant CRM synchronization.',
      ],
      packages: [
        {
          id: 'voice-pkg-1',
          title: 'Inbound 24/7 AI Receptionist',
          meta: 'Starting at $599 • 7 Days Turnaround',
          price: 'Start $599',
          description: 'Handles 100% of incoming customer calls, answers FAQs, routes calls intelligently, and books calendar appointments.',
          features: ['Twilio / SIP Phone Integration', 'Natural Voice Synthesis', 'Google Calendar Sync', 'Call Recording & Summaries'],
          image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Inbound%20AI%20Receptionist',
        },
        {
          id: 'voice-pkg-2',
          title: 'Outbound Lead Qualification Voice Agent',
          meta: 'Starting at $799 • 10 Days Turnaround',
          price: 'Start $799',
          description: 'High-speed automated calling agent that dials web leads within 60 seconds, qualifies interest, and transfers hot leads to your sales reps.',
          features: ['Sub-60s Lead Response', 'Objection Handling Engine', 'CRM Webhook Triggering', 'Sentiment & Intent Analytics'],
          image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Outbound%20Voice%20Agent',
        },
      ],
    },
    'ai-saas': {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'End-to-End Production ',
      heroTitleGradient: 'Full-Stack AI SaaS Platform Engineering',
      heroTitleSuffix: ' from Scratch',
      paragraphs: [
        'We take your AI startup or enterprise SaaS concept from initial architecture design to production deployment and global scalability.',
        'Built with modern stacks including Next.js 15, FastAPI, multi-tenant databases, Stripe recurring billing, and automated CI/CD pipelines.',
      ],
      packages: [
        {
          id: 'saas-pkg-1',
          title: 'AI SaaS MVP Launchpad',
          meta: 'Starting at $1,499 • 14 Days Turnaround',
          price: 'Start $1,499',
          description: 'Complete production-ready AI SaaS boilerplate with Next.js frontend, authentication, credit metering, Stripe billing, and admin portal.',
          features: ['Next.js 15 & NeonDB Backend', 'Stripe Subscriptions & Usage Credits', 'Multi-Tenant Auth & RBAC', 'Dark Mode Glassmorphism UI'],
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=AI%20SaaS%20MVP%20Launchpad',
        },
        {
          id: 'saas-pkg-2',
          title: 'Enterprise Scalable SaaS Infrastructure',
          meta: 'Starting at $2,499 • 21 Days Turnaround',
          price: 'Start $2,499',
          description: 'High-availability enterprise SaaS architecture designed for 100k+ users with dedicated caching, background workers, and audit logging.',
          features: ['Redis Queues & Celery Workers', 'SOC2 Compliant Database Architecture', 'Advanced Analytics Dashboard', 'Custom API Developer Portal'],
          image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Enterprise%20SaaS%20Infrastructure',
        },
      ],
    },
    'saas-product': {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Rapid Turnaround ',
      heroTitleGradient: 'AI Micro-SaaS & Automation Tools',
      heroTitleSuffix: ' for Niche Markets',
      paragraphs: [
        'Lightweight, high-demand AI software tools and browser extensions that solve specific pain points and generate recurring subscription revenue.',
        'Turn specialized prompts, workflows, and media transformations into standalone paid software applications in days.',
      ],
      packages: [
        {
          id: 'microsaas-pkg-1',
          title: 'Standalone Niche AI Web Tool',
          meta: 'Starting at $799 • 10 Days Turnaround',
          price: 'Start $799',
          description: 'Focused single-purpose AI utility (e.g. AI copywriter, code auditor, resume enhancer) with one-time payment or monthly subscription.',
          features: ['Micro-billing Checkout', 'Rapid 10-day market launch', 'OpenAI / Claude API Caching', 'Built-in Viral Referral Links'],
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Niche%20AI%20Web%20Tool',
        },
        {
          id: 'microsaas-pkg-2',
          title: 'AI Chrome Extension & Web Add-on',
          meta: 'Starting at $999 • 12 Days Turnaround',
          price: 'Start $999',
          description: 'Manifest V3 Chrome Extension that injects AI superpowers into LinkedIn, Gmail, Twitter, or web portals with license key verification.',
          features: ['Manifest V3 Chrome Extension', 'License Key Auth API', 'Side-panel & Floating UI', 'Web Store Submission Support'],
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=AI%20Chrome%20Extension',
        },
      ],
    },
    'custom-ai': {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Confidential Internal ',
      heroTitleGradient: 'Private Enterprise AI Assistant (RAG & Security)',
      heroTitleSuffix: ' Systems',
      paragraphs: [
        'Empower your company workforce with internal AI copilots that search, analyze, and synthesize proprietary business documents with zero data leakage.',
        'Integrate securely with Slack, Google Drive, Notion, Confluence, and internal PostgreSQL databases with enterprise permission enforcement.',
      ],
      packages: [
        {
          id: 'custom-pkg-1',
          title: 'Internal Document Knowledge Copilot',
          meta: 'Starting at $899 • 7 Days Turnaround',
          price: 'Start $899',
          description: 'Secure enterprise RAG system that indexes thousands of PDFs, spreadsheets, and internal SOPs for instant employee query answering.',
          features: ['Private Vector DB (Milvus/Pinecone)', 'Document OCR & Parsing', 'Strict Data Encryption & Privacy', 'Role-Based Document Access'],
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Internal%20Document%20Copilot',
        },
        {
          id: 'custom-pkg-2',
          title: 'Fine-Tuned Domain LLM & Local Deployment',
          meta: 'Starting at $1,499 • 14 Days Turnaround',
          price: 'Start $1,499',
          description: 'Custom fine-tuned open-source model (LLaMA 3 / DeepSeek) trained specifically on your industry terminology and deployed on private cloud servers.',
          features: ['Custom LoRA / QLoRA Fine-tuning', 'On-Premise / Private Cloud Deploy', 'Zero Third-Party Data Sharing', 'Model Evaluation & Benchmarks'],
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Fine-Tuned%20Domain%20LLM',
        },
      ],
    },
    'enterprise-software': {
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Self-Correcting Autonomous ',
      heroTitleGradient: 'Autonomous Multi-Agent AI Workflows',
      heroTitleSuffix: ' Pipelines',
      paragraphs: [
        'Multi-agent systems powered by LangChain and CrewAI that plan, collaborate, and execute complex business tasks autonomously without human bottlenecks.',
        'Agents research market trends, draft technical documentation, verify outputs, and trigger automated system actions across your enterprise stack.',
      ],
      packages: [
        {
          id: 'agents-pkg-1',
          title: 'Autonomous Research & Data Synthesis Agent',
          meta: 'Starting at $1,199 • 12 Days Turnaround',
          price: 'Start $1,199',
          description: 'Autonomous web browsing agent swarm that crawls competitor websites, aggregates data, cleans unstructured content, and generates executive summaries.',
          features: ['Self-correcting Execution Loops', 'Headless Browser & Scraping Tools', 'Structured JSON Output Guarantee', 'Long-term Vector Memory Store'],
          image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Autonomous%20Research%20Agent',
        },
        {
          id: 'agents-pkg-2',
          title: 'Multi-Agent Enterprise Workflow Orchestrator',
          meta: 'Starting at $1,899 • 18 Days Turnaround',
          price: 'Start $1,899',
          description: 'Coordinated agent swarm handling complex multi-step pipelines: intake validation, CRM enrichment, automated proposal generation, and email dispatch.',
          features: ['LangGraph / CrewAI Architecture', 'Human-in-the-Loop Approvals', 'Bi-directional Webhook Dispatch', 'Full Audit Logging & Tracing'],
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Multi-Agent%20Workflow%20Orchestrator',
        },
      ],
    },
    'ai-3d': {
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Immersive Real-Time ',
      heroTitleGradient: 'Interactive 3D Web & Immersive Experience',
      heroTitleSuffix: ' Platforms',
      paragraphs: [
        'Combine cutting-edge WebGL, Three.js, and interactive shaders to create breathtaking 3D web experiences that captivate visitors and multiply website engagement.',
        'From interactive product configurators to spatial web apps, we bring 60 FPS mobile-smooth 3D experiences directly to the browser with zero plugins required.',
      ],
      packages: [
        {
          id: 'threed-pkg-1',
          title: 'Interactive 3D Product Visualizer',
          meta: 'Starting at $699 • 6 Days Turnaround',
          price: 'Start $699',
          description: 'High-performance Three.js visualizer with custom 3D models, smooth camera orbits, real-time materials tweaking, and mobile responsiveness.',
          features: ['Three.js / React Three Fiber', 'Blender Model Mesh Optimization', 'Real-time Shaders & Lighting', 'Mobile 60 FPS Performance'],
          image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=3D%20Product%20Visualizer',
        },
        {
          id: 'threed-pkg-2',
          title: 'Full 3D Cyber Web Experience with Spline',
          meta: 'Starting at $1,150 • 12 Days Turnaround',
          price: 'Start $1,150',
          description: 'Complete scroll-driven interactive 3D landing page with cinematic camera transitions, particle systems, and dark-mode futuristic cyber aesthetics.',
          features: ['Scroll-driven 3D Camera Rig', 'Spline 3D Scene Integration', 'Interactive Hover & Physics', 'Fast WebGL Fallback Loading'],
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=Full%203D%20Web%20Experience',
        },
      ],
    },
    'web-app-dev': {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      heroTitlePrefix: 'Modern Full-Stack ',
      heroTitleGradient: 'High-Performance Web & Mobile App Development',
      heroTitleSuffix: ' Engineering',
      paragraphs: [
        'Fast, responsive web applications and cross-platform mobile apps built with React, Next.js 15, React Native, and Tailwind CSS.',
        'Pixel-perfect UI implementation, progressive web app offline capabilities, sub-second page speeds, and seamless backend API integration.',
      ],
      packages: [
        {
          id: 'webapp-pkg-1',
          title: 'High-Performance Next.js Web App',
          meta: 'Starting at $449 • 8 Days Turnaround',
          price: 'Start $449',
          description: 'Blazing fast, SEO-tuned web application with Next.js 15 App Router, TypeScript, Tailwind CSS, and server-side rendering.',
          features: ['100/100 Core Web Vitals', 'Responsive Mobile-First UI', 'REST / GraphQL API Hooks', 'Automated Vercel CI/CD'],
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=High-Performance%20Web%20App',
        },
        {
          id: 'webapp-pkg-2',
          title: 'Cross-Platform React Native Mobile App',
          meta: 'Starting at $899 • 14 Days Turnaround',
          price: 'Start $899',
          description: 'Production-ready iOS and Android mobile app built with Expo / React Native with push notifications and native device API access.',
          features: ['Single Codebase for iOS & Android', 'Push Notification Service', 'Offline Storage & Fast Caching', 'App Store & Google Play Ready'],
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
          link: '/order?service=React%20Native%20Mobile%20App',
        },
      ],
    },
  };

  const existingContent = await prisma.cmsContent.findUnique({
    where: { key: 'servicePackages' },
  });

  if (existingContent) {
    await prisma.cmsContent.update({
      where: { key: 'servicePackages' },
      data: { data: servicePackagesData },
    });
    console.log('✅ Updated servicePackages CMS content with packages for ALL 8 services!');
  } else {
    await prisma.cmsContent.create({
      data: {
        key: 'servicePackages',
        data: servicePackagesData,
      },
    });
    console.log('✅ Created servicePackages CMS content with packages for ALL 8 services!');
  }
}

seedAllServicePackages()
  .catch((e) => {
    console.error('❌ Error seeding service packages:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
