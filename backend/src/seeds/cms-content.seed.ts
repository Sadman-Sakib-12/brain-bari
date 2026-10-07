import prisma from '../config/prisma';
import industriesJson from './industries.json';

async function main() {
  console.log('🌱 Seeding CMS content (CmsContent)...');

  const contents: { key: string; data: any }[] = [
    // ---------------------------------------------------------
    // 1. New Work page metrics
    // ---------------------------------------------------------
    {
      key: 'newWorkMetrics',
      data: {
        metrics: [
          { value: '30+', label: 'Projects' },
          { value: '10+', label: 'AI Systems' },
          { value: '99.9%', label: 'Satisfaction' },
        ],
      },
    },

    // ---------------------------------------------------------
    // 2. Footer languages (20 languages preserved from original UI)
    // ---------------------------------------------------------
    {
      key: 'footer-languages',
      data: [
        { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
        { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
        { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
      ],
    },

    // ---------------------------------------------------------
    // 3. About page content (structure matched to /about frontend)
    // ---------------------------------------------------------
    {
      key: 'about',
      data: {
        hero: {
          headline: 'Precision AI for Smarter, Scalable Business Growth',
          intro:
            'Brain Bari is a Bangladesh-based AI & Software Solutions company delivering precision AI, custom software, and complete digital transformation for growing businesses worldwide.',
          subHeadline: 'Delivering Intelligent Solutions Across Industries',
          body:
            'We design and engineer AI systems, autonomous chatbots, and production-grade web platforms that remove operational friction and unlock measurable growth. From concept to deployment, our cross-functional team ships reliable, scalable software that businesses can depend on every day.',
          workAreasTitle: 'Our Core Work Areas',
          workAreas: [
            'Autonomous AI Chatbot Development',
            'Custom AI Assistants & Internal Automation',
            'Full-Stack AI SaaS Product Engineering',
            'Interactive 3D & Immersive Web Experiences',
            'Enterprise Web & Mobile Application Development',
            'API Development, Integration & Cloud Solutions',
          ],
          closingText:
            'Whether you are modernizing legacy workflows or launching a new AI-powered product, Brain Bari partners with you end-to-end — strategy, design, engineering, and long-term support.',
        },
        journey: {
          heading: 'Professional Journey',
          subheading: 'Milestones that shaped Brain Bari into an end-to-end AI solutions partner.',
          milestones: [
            {
              id: 'm1',
              title: 'The Beginning',
              subtitle: '2022',
              desc: 'Started as a small web development studio delivering custom websites and business tools for local clients in Dhaka.',
              tag: 'Foundation',
              alignRight: false,
            },
            {
              id: 'm2',
              title: 'AI Pivot',
              subtitle: '2023',
              desc: 'Shifted focus toward AI engineering — building LLM-powered chatbots, RAG knowledge systems, and intelligent automation for enterprises.',
              tag: 'AI Era',
              alignRight: true,
            },
            {
              id: 'm3',
              title: 'Platform Scale',
              subtitle: '2024',
              desc: 'Launched full-stack AI SaaS products, integrated Stripe billing, and scaled delivery to international clients across multiple industries.',
              tag: 'Growth',
              alignRight: false,
            },
            {
              id: 'm4',
              title: 'Global Expansion',
              subtitle: '2025 – Now',
              desc: 'Operating as an end-to-end AI & software solutions partner with 30+ delivered projects and 99.9% client satisfaction.',
              tag: 'Today',
              alignRight: true,
            },
          ],
        },
        services: {
          heading: 'Full Cycle Development Services',
          items: [
            { id: 's1', title: 'Discovery & Strategy', desc: 'Deep-dive workshops to define goals, user needs, and technical architecture before a single line of code is written.' },
            { id: 's2', title: 'UX/UI Design', desc: 'Research-driven interfaces and design systems that make complex products feel simple and intuitive.' },
            { id: 's3', title: 'AI Engineering', desc: 'Custom LLM integrations, fine-tuned models, RAG pipelines, and autonomous agents built for production.' },
            { id: 's4', title: 'Full-Stack Development', desc: 'Scalable Next.js frontends and Node/Prisma backends on cloud infrastructure with CI/CD pipelines.' },
            { id: 's5', title: 'QA & Testing', desc: 'Automated and manual testing suites that guarantee reliability, security, and performance under load.' },
            { id: 's6', title: 'Deployment & Support', desc: 'Zero-downtime deployments, monitoring, and ongoing maintenance to keep systems running at 99.9% uptime.' },
          ],
        },
        cta: {
          heading: 'Ready to transfer your Business',
          desc: 'Developing and maintaining web applications using React.js, Next.js, and other related technologies.',
          buttonLink: '/schedule/',
          buttonText: 'Schedule A Consultation',
        },
      },
    },

    // ---------------------------------------------------------
    // 4. Industries Page CMS (ROI Pillars & FAQs)
    // ---------------------------------------------------------
    {
      key: 'industriesPage',
      data: {
        hero: {
          badge: 'Domain-Specific AI Architecture',
          title: 'Engineering AI & Software Across',
          titleHighlight: 'High-Impact Industries',
          description: "We don't build one-size-fits-all software. We architect specialized conversational chatbots, intelligent automation pipelines, and enterprise web solutions tailored directly to your industry's regulatory and customer realities.",
        },
        roiSection: {
          heading: 'Why Domain Expertise Drives Superior AI ROI',
          subheading: 'Generic LLM wrappers fail when confronted with real-world jargon, strict compliance protocols, and nuanced customer inquiries. Here is how Brain Bari designs for measurable outcomes:',
        },
        roiCards: [
          {
            id: 'roi-1',
            icon: 'Cpu',
            title: 'Deep Knowledge Base Fine-Tuning',
            description: 'We ingest and structure your proprietary catalogues, documentation, and historic client interactions into private RAG vectors with zero data leakage.',
            badge: 'Tailored Embeddings',
          },
          {
            id: 'roi-2',
            icon: 'ShieldCheck',
            title: 'Security & Regulatory Compliance',
            description: 'Whether adhering to healthcare privacy or banking confidentiality, our systems incorporate strict permission guards and audit logs.',
            badge: 'Enterprise Grade Security',
          },
          {
            id: 'roi-3',
            icon: 'TrendingUp',
            title: 'Quantifiable Business Results',
            description: 'Every solution is engineered around core KPIs: cut response times from hours to seconds, automate up to 85% of repeat tasks, and lift conversions.',
            badge: 'Measurable Efficiency',
          },
        ],
        faqs: [
          {
            question: 'Can our AI chatbot connect directly to our proprietary CRM or ERP?',
            answer: 'Yes. We build custom API connectors for Salesforce, HubSpot, SAP, custom SQL databases, Shopify, and local ERP systems to ensure bidirectional real-time data sync.',
          },
          {
            question: 'Is our confidential industry data used to train public AI models?',
            answer: 'Never. We deploy private virtual private cloud (VPC) embeddings and enterprise agreements that legally guarantee your company data and customer chats are never used for public LLM training.',
          },
          {
            question: 'How long does an industry-specific deployment take?',
            answer: 'Standard conversational AI chatbots and RAG assistants are typically deployed in 1 to 2 weeks. Custom enterprise software platforms or multi-tenant SaaS MVPs take between 6 to 8 weeks from design to production.',
          },
        ],
      },
    },

    // ---------------------------------------------------------
    // 5. Navbar Spotlight Card (MegaMenu & Mobile Drawer)
    // ---------------------------------------------------------
    {
      key: 'navbarSpotlight',
      data: {
        title: 'Custom Software Solutions',
        description: 'Complete technology & security solutions to protect and scale your business.',
        features: [
          'Security Audit & Architecture',
          'Vulnerability & Code Assessment',
          'SaaS & Cloud Infrastructure',
          'Network & System Protection',
          'Web & Mobile App Security',
          'Compliance & Risk Management',
        ],
        linkText: 'Explore Custom Software',
        linkUrl: '/services',
      },
    },

    // ---------------------------------------------------------
    // 6. Partners Page CMS (Hero, Value Cards, Showcase & Registration)
    // ---------------------------------------------------------
    {
      key: 'partnersPage',
      data: {
        hero: {
          badge: 'Strategic Partner Network',
          title: 'Co-Create the Future with',
          titleHighlight: 'Brain Bari AI Ecosystem',
          description: 'Join forces with Brain Bari to deliver groundbreaking conversational AI, automated enterprise workflows, and high-performance bespoke software to organizations worldwide.',
        },
        valueCards: [
          {
            id: 'val-1',
            icon: 'TrendingUp',
            title: 'Shared Growth & Revenue',
            description: 'Unlock high-margin enterprise AI pipelines, recurring commission tiers, and collaborative co-selling channels.',
          },
          {
            id: 'val-2',
            icon: 'Cpu',
            title: 'Cutting-Edge AI Integration',
            description: 'Integrate Brain Bari\'s state-of-the-art LLM engines, autonomous agents, and high-speed API suites directly into client tech stacks.',
          },
          {
            id: 'val-3',
            icon: 'Rocket',
            title: 'Early Access & Beta Toolsets',
            description: 'Gain exclusive, zero-day access to upcoming generative AI models, private developer sandboxes, and dedicated engineering consultation.',
          },
        ],
        showcase: {
          badge: 'Active Ecosystem Network',
          title: 'Our Strategic Partners & Collaborators',
          subtitle: 'Leading universities, technology labs, and enterprise agency networks co-innovating with Brain Bari.',
        },
        registration: {
          badge: 'Join Our Partner Network',
          title: 'Accelerate Your Growth With Brain Bari AI',
          description: 'Whether you are an enterprise agency, an independent software vendor, or a technology consulting firm, our partnership tracks offer competitive revenue shares, dedicated technical enablement, and co-marketing campaigns.',
          benefits: [
            'Lucrative revenue sharing & white-label deployment tiers',
            'Direct access to specialized LLM models & automated agents',
            'Co-branded case studies, PR, and lead distribution',
            'Priority 24/7 technical architect support & integration sandbox',
          ],
          formTitle: 'Register for Partner Access',
          formSubtitle: 'Submit your details and our Partner Ecosystem team will connect within 24 hours.',
        },
      },
    },

    // ---------------------------------------------------------
    // 7. Events Page CMS (Hero)
    // ---------------------------------------------------------
    {
      key: 'eventsPage',
      data: {
        hero: {
          badge: 'Community & Culture',
          title: 'Grow Your Network & Skills',
          titleHighlight: 'with Our Events',
          description: 'Discover community gatherings, hackathons, executive roadmaps, and industry symposiums organized by Brain Bari.',
        },
      },
    },

    // ---------------------------------------------------------
    // 8. Team Page CMS (Headings)
    // ---------------------------------------------------------
    {
      key: 'teamPage',
      data: {
        expertisesTitle: 'Our Industry Expertises',
        expertisesSubtitle: 'Our deep understanding of diverse industries empowers us to design customized software solutions. Let our expertise be the Catalyst for your next triumph.',
        teamTitle: 'Meet Our Team',
        teamSubtitle: 'Click on any team member to view their complete profile and expertise.',
      },
    },

    // ---------------------------------------------------------
    // 9. Booking Consultation Settings
    // ---------------------------------------------------------
    {
      key: 'bookingSettings',
      data: {
        companyName: 'Brain Bari Technologies',
        consultationTitle: '60 Minute Consultation',
        duration: '1 Hour Duration',
        detailsNote: 'Web conferencing details provided upon booking confirmation.',
        copyrightText: '© Brain Bari 2026',
      },
    },
    {
      key: 'bookingSlots',
      data: [
        '09:00 AM',
        '10:30 AM',
        '01:00 PM',
        '02:30 PM',
        '04:00 PM',
        '05:30 PM',
      ],
    },
    {
      key: 'servicesPage',
      data: {
        hero: {
          title: 'Enterprise AI & Software',
          titleHighlight: 'Capabilities',
          description:
            'Tailor-made conversational intelligence, production-ready SaaS frameworks, and custom digital infrastructure designed to scale your business.',
        },
      },
    },
    {
      key: 'newsletterSubscribers',
      data: [],
    },

    // ---------------------------------------------------------
    // 10. Product Hero Solutions (Product Page Top 3 Cards)
    // ---------------------------------------------------------
    {
      key: 'productHeroSolutions',
      data: {
        cards: [
          {
            id: 'ai-chatbot',
            title: 'AI Chatbots',
            description: 'Automate customer interactions and enhance support efficiency.',
            image: 'https://res.cloudinary.com/lndolcud/image/upload/v1791406629/brain-bari/service_ai_chatbot.jpg',
            features: ['24/7 Availability', 'Multi-Language Support', 'Omnichannel Integration'],
            link: '/services/ai-chatbot',
          },
          {
            id: 'ai-saas',
            title: 'AI SaaS Platforms',
            description: 'Build scalable and intelligent SaaS solutions for various industries.',
            image: 'https://res.cloudinary.com/lndolcud/image/upload/v1791406755/brain-bari/service_ai_saas.jpg',
            features: ['Cloud-Based Architecture', 'CRM Integration', 'AI-Powered Analytics'],
            link: '/services/ai-saas',
          },
          {
            id: 'custom-ai',
            title: 'Custom AI Development',
            description: 'Develop tailored AI solutions to meet your unique business needs.',
            image: 'https://res.cloudinary.com/lndolcud/image/upload/v1791406757/brain-bari/service_custom_ai.jpg',
            features: ['Custom AI Models', 'Predictive Analytics', 'Scalable Solutions'],
            link: '/services/custom-ai',
          },
        ],
        whyChooseTitle: 'Why Choose',
        whyChooseHighlight: 'Brain Bari?',
        whyChooseFeatures: [
          {
            icon: 'Settings',
            title: 'Tailored AI Solutions',
            description: 'Solutions customized to fit your business requirements',
          },
          {
            icon: 'TrendingUp',
            title: 'Scalability & Growth',
            description: 'AI solutions that scale with your business',
          },
          {
            icon: 'ShieldCheck',
            title: 'Ongoing Support',
            description: 'Dedicated support and continuous optimization',
          },
          {
            icon: 'Cpu',
            title: 'Advanced Technology',
            description: 'Cutting-edge AI frameworks and tools',
          },
        ],
      },
    },

    // ---------------------------------------------------------
    // 11. Service Packages (for detailed package offerings)
    // ---------------------------------------------------------
    {
      key: 'servicePackages',
      data: {
        'ai-chatbot': {
          image: 'https://res.cloudinary.com/lndolcud/image/upload/v1791406629/brain-bari/service_ai_chatbot.jpg',
          heroTitlePrefix: 'Intelligent Conversational ',
          heroTitleGradient: 'AI Chatbots',
          heroTitleSuffix: ' for Enterprise',
          paragraphs: [
            'We design, build, and deploy domain-trained AI chatbots capable of human-like comprehension, multi-turn reasoning, and instant query resolution across 50+ languages.',
            'Whether integrated into your customer-facing web portal, WhatsApp Business, or internal Slack channels, our bots connect directly to your knowledge base.',
          ],
          highlights: [
            'Custom RAG pipeline trained on your business documents and knowledge base',
            'Multi-channel deployment: Web widget, WhatsApp Cloud API, Telegram & Slack',
            'Automated lead capture with instant CRM and webhook dispatch',
            'Zero hallucination guardrails with seamless human agent handoff',
          ],
          coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
          subtitle: 'Omnichannel conversational AI that resolves 80%+ customer inquiries instantly.',
          ctaHeadline: 'Empower Your Customer Support with Conversational AI',
          ctaDesc: 'Book a 30-minute discovery call to see how custom AI chatbots can automate support workflows and drive revenue.',
          ctaButtonText: 'Schedule Consultation',
          packages: [
            {
              id: 'pkg-1',
              title: 'Smart Website Chatbot',
              meta: 'Starting at $259 • 5 Days Turnaround',
              price: 'Start $259',
              description: 'Interactive, branded website bot trained on your documentation, FAQs, and product catalogs with automated lead qualification.',
              features: ['Instant 24/7 Support', 'RAG Pipeline Training', 'Human Agent Handoff', 'Custom UI Theming'],
              image: 'https://res.cloudinary.com/lndolcud/image/upload/v1791406629/brain-bari/service_ai_chatbot.jpg',
              link: '/order?service=Website%20Chatbot',
              isConsulting: false,
            },
            {
              id: 'pkg-2',
              title: 'WhatsApp Auto-Order Bot',
              meta: 'Starting at $350 • 7 Days Turnaround',
              price: 'Start $350',
              description: 'Automated order booking and customer retention bot directly on WhatsApp Business with real-time payment link dispatch.',
              features: ['WhatsApp Cloud API Integration', 'Catalog Browsing', 'Order Confirmation & Invoicing', 'Multi-Admin Dashboard'],
              image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
              link: '/order?service=WhatsApp%20Bot',
              isConsulting: false,
            },
          ],
        },
        'ai-saas': {
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          heroTitlePrefix: 'End-to-End Scalable ',
          heroTitleGradient: 'AI SaaS Solutions',
          heroTitleSuffix: ' from Scratch',
          paragraphs: [
            'We take your AI startup or enterprise SaaS concept from initial architecture design to production deployment and global scalability.',
            'Built with modern stacks including Next.js, FastAPI, multi-tenant databases, Stripe billing, and automated CI/CD pipelines.',
          ],
          packages: [
            {
              id: 'pkg-4',
              title: 'Full-Stack AI Micro-SaaS MVP',
              meta: 'Starting at $850 • 14 Days Turnaround',
              price: 'Start $850',
              description: 'Production-ready SaaS boilerplate with authentication, subscription tiers, Stripe checkout, AI inference engine, and admin dashboard.',
              features: ['Next.js & Tailwind Frontend', 'FastAPI / Python AI Backend', 'Stripe Subscription Billing', 'Multi-Tenant Cloud Hosting'],
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
              link: '/order?service=AI%20SaaS%20MVP',
              isConsulting: false,
            },
          ],
        },
        'custom-ai': {
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
          heroTitlePrefix: 'Bespoke Autonomous ',
          heroTitleGradient: 'Custom AI Assistants',
          heroTitleSuffix: ' & Agents',
          paragraphs: [
            'Empower your workforce with custom AI agents equipped with reasoning logic, tool execution, and direct database querying capabilities.',
            'From legal document synthesis to financial report audits, our assistants execute multi-step operational tasks autonomously.',
          ],
          packages: [
            {
              id: 'pkg-3',
              title: 'Enterprise Knowledge Assistant',
              meta: 'Starting at $450 • 7 Days Turnaround',
              price: 'Start $450',
              description: 'Secure internal employee copilot that searches millions of enterprise files, PDFs, and database tables in milliseconds.',
              features: ['Strict Data Privacy & Encryption', 'Vector Search with Milvus/Pinecone', 'Role-Based Document Access', 'Audit Trail Analytics'],
              image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
              link: '/order?service=Enterprise%20AI%20Assistant',
              isConsulting: false,
            },
          ],
        },
        'ai-3d': {
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
          heroTitlePrefix: 'Immersive Real-Time ',
          heroTitleGradient: 'AI & 3D Web',
          heroTitleSuffix: ' Experiences',
          paragraphs: [
            'Combine cutting-edge WebGL, Three.js, and generative AI shaders to create breathtaking interactive web platforms.',
            'High-performance 3D product configurators, architectural walkthroughs, and spatial web applications that drive unmatched engagement.',
          ],
          packages: [
            {
              id: 'pkg-5',
              title: 'Interactive 3D Web App',
              meta: 'Starting at $550 • 10 Days Turnaround',
              price: 'Start $550',
              description: 'Interactive Three.js visualizer with custom 3D models, smooth camera orbits, real-time materials tweaking, and mobile responsiveness.',
              features: ['Three.js / React Three Fiber', 'Blender Model Optimization', 'Interactive Physics & Lighting', 'Zero Plugin In-Browser Running'],
              image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
              link: '/order?service=3D%20Web%20App',
              isConsulting: false,
            },
          ],
        },
      },
    },

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // 12. Blog Page CMS (Header & Categories)
    // ---------------------------------------------------------
    {
      key: 'blogPage',
      data: {
        heading: 'Innovation meets expertise in our range of service',
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=80',
      },
    },

    // ---------------------------------------------------------
    // 13. Industries Data (Full 8 Specialized Industries)
    // ---------------------------------------------------------
    {
      key: 'industries',
      data: industriesJson,
    },

    // ---------------------------------------------------------
    // 14. Industry Badges Showcase (14 Filter Badges)
    // ---------------------------------------------------------
    {
      key: 'industryBadges',
      data: [
        { id: 'finance', name: 'Finance & Banking', icon: 'Landmark', bg: '#fdf5eb', targetId: 'fintech' },
        { id: 'ecommerce', name: 'E-commerce', icon: 'ShoppingCart', bg: '#eaf4fd', targetId: 'ecommerce' },
        { id: 'telecom', name: 'Telecom', icon: 'Smartphone', bg: '#fdfae5', searchQuery: 'telecom' },
        { id: 'realestate', name: 'Real Estate', icon: 'Home', bg: '#faede8', targetId: 'real-estate' },
        { id: 'software', name: 'Software', icon: 'Monitor', bg: '#f1eefa', targetId: 'enterprise-saas' },
        { id: 'automotive', name: 'Automotive', icon: 'Truck', bg: '#faf8e4', searchQuery: 'automotive' },
        { id: 'health', name: 'Health & Fitness', icon: 'Heart', bg: '#eaf7ec', targetId: 'healthcare' },
        { id: 'photo', name: 'Photo & Video', icon: 'Camera', bg: '#fdf4e8', searchQuery: 'video' },
        { id: 'business', name: 'Business', icon: 'ShoppingBag', bg: '#f2eff9', searchQuery: 'business' },
        { id: 'startup', name: 'Startup', icon: 'Zap', bg: '#e6f8fa', searchQuery: 'saas' },
        { id: 'arvr', name: 'AR/VR', icon: 'Infinity', bg: '#fdf9e3', searchQuery: '3d' },
        { id: 'nonprofit', name: 'Non-profit', icon: 'Users', bg: '#eaf4fb', searchQuery: 'non-profit' },
        { id: 'legal', name: 'Legal Services', icon: 'Scale', bg: '#faf7e4', targetId: 'legal-civic' },
        { id: 'govt', name: 'Govt. & Public Sector', icon: 'Building2', bg: '#f6eff1', targetId: 'legal-civic' },
      ],
    },

    // ---------------------------------------------------------
    // 15. Strategic Partners Network (4 Active Partners)
    // ---------------------------------------------------------
    {
      key: 'partners',
      data: [
        {
          id: 'partner-1',
          name: 'State University of Bangladesh (SUB)',
          type: 'Academic & Research',
          status: 'Active Partner',
          website: 'https://www.sub.ac.bd',
          logoInitials: 'SUB',
          joinedDate: '2024-01-15',
          description: 'Collaborative joint initiative on biomedical AI ethical frameworks and student technical internship programs.',
          isFeatured: true,
        },
        {
          id: 'partner-2',
          name: 'Asian Bioethics Network',
          type: 'Healthcare Consortium',
          status: 'Active Partner',
          website: 'https://asianbioethics.org',
          logoInitials: 'ABN',
          joinedDate: '2024-05-10',
          description: 'Official software automation and digital portal partner for international medical research conventions.',
          isFeatured: true,
        },
        {
          id: 'partner-3',
          name: 'CloudScale DevOps Labs',
          type: 'Technology & API Integration',
          status: 'Active Partner',
          website: 'https://cloudscale.io',
          logoInitials: 'CS',
          joinedDate: '2024-08-20',
          description: 'Kubernetes and high-availability cloud infrastructure provider for Brain Bari enterprise client deployments.',
          isFeatured: true,
        },
        {
          id: 'partner-4',
          name: 'Apex Agency Solutions',
          type: 'Agency & Reseller Partner',
          status: 'Active Partner',
          website: 'https://apexsolutions.net',
          logoInitials: 'AAS',
          joinedDate: '2025-02-01',
          description: 'Wholesale white-label implementation partner representing Brain Bari conversational AI solutions in North America.',
          isFeatured: true,
        },
      ],
    },

    // ---------------------------------------------------------
    // 16. Events & Conferences Calendar (3 Scheduled Events)
    // ---------------------------------------------------------
    {
      key: 'events',
      data: [
        {
          id: 'iftar-2026',
          title: 'Brain Bari Official Ramadan Iftar Mahfil',
          date: '2026-03-07',
          time: '05:30 PM - 08:30 PM',
          location: 'Brain Bari Office, Khagan, Dhaka',
          category: 'latest',
          status: 'Completed',
          attendees: '45 Attendees',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
          description: 'Brain Bari hosted a special Ramadan Iftar Mahfil bringing together the entire team for reflection, unity, and celebration.',
          agenda: [
            'Welcome Address & Team Fellowship',
            'Quran Recitation & Reflection',
            'Iftar & Dinner Gathering',
            'Team Appreciation & Open Discussion',
          ],
        },
        {
          id: 'founders-talk-2026',
          title: "Founder's Talk: Agreements & Future Roadmap",
          date: '2026-04-15',
          time: '03:00 PM - 05:30 PM',
          location: 'Brain Bari Innovation Hub & Virtual',
          category: 'nearest',
          status: 'Upcoming',
          attendees: '120 Attendees',
          image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
          description: 'Exclusive strategic gathering led by Founder & Director and CEO, outlining our long-term AI platform trajectory and international partnerships.',
          agenda: [
            '2026-2027 Technology Roadmap Reveal',
            'Enterprise SaaS & Model Integration Benchmarks',
            'Partner Agreement Signings',
            'Interactive Engineering Q&A',
          ],
        },
        {
          id: 'ai-health-conference-2026',
          title: 'Asian Bioethics & Healthcare AI Summit',
          date: '2026-05-22',
          time: '10:00 AM - 04:00 PM',
          location: 'State University of Bangladesh & Digital Livestream',
          category: 'nearest',
          status: 'Upcoming',
          attendees: '250 Attendees',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
          description: 'An academic and industry symposium exploring the ethical deployment of conversational AI diagnostics and health monitoring systems.',
          agenda: [
            'Keynote: Ethical Frontiers in Clinical AI',
            'Live Case Study: Healthcare Conversational Assistant',
            'Panel: Data Privacy in Public Health Tech',
            'Closing Networking Session',
          ],
        },
      ],
    },

    // ---------------------------------------------------------
    // 17. Client Reviews Section Header & Rating (Homepage)
    // ---------------------------------------------------------
    {
      key: 'reviewsSettings',
      data: {
        badge: '⭐ Client Testimonials',
        title: 'What Our Clients',
        titleHighlight: 'Say About Us',
        description: 'Discover how our conversational AI chatbots, enterprise SaaS products, and custom software drive measurable ROI for companies worldwide.',
        ratingText: '4.9 / 5.0 (120+ reviews)',
      },
    },

    // ---------------------------------------------------------
    // 18. Client Reviews Cards (Homepage Carousel)
    // ---------------------------------------------------------
    {
      key: 'reviews',
      data: [
        {
          id: 'rev-1',
          clientName: 'Sarah Jenkins',
          role: 'VP of Product at ScaleFlow',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          review: 'Brain Bari delivered our AI assistant in just 10 days. Our customer support resolution time dropped by 64% within the first month. Incredible speed and precision.',
          service: 'AI Chatbot',
        },
        {
          id: 'rev-2',
          clientName: 'David Chen',
          role: 'Founder & CTO at CloudPulse',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          review: 'The 3D interactive web platform they built blew our investors away. Flawless 60 FPS performance on mobile and a design aesthetic that truly commands authority.',
          service: '3D Web Platform',
        },
        {
          id: 'rev-3',
          clientName: 'Elena Rostova',
          role: 'Head of Operations at OmniLogistics',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          review: 'Their custom document scanning and automated OCR pipeline saves our team over 120 hours every single week. Highly recommend Brain Bari for enterprise automation.',
          service: 'OCR Automation',
        },
        {
          id: 'rev-4',
          clientName: 'Marcus Sterling',
          role: 'Managing Director at Apex Financial',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          review: 'Security was our #1 priority. Brain Bari provided full SOC2 data isolation and delivered a financial advisory bot that handles client queries with zero hallucinations.',
          service: 'Financial AI',
        },
      ],
    },

    // ---------------------------------------------------------
    // 18.5 Resources Spotlight (MegaMenu Right Card)
    // ---------------------------------------------------------
    {
      key: 'resourcesSpotlight',
      data: {
        title: 'Knowledge & Insights',
        description: 'Explore technical articles, playbooks, and research publications written by our engineering team.',
        features: [
          'Enterprise AI Case Studies',
          'Generative AI Architectures',
          'SOC2 Data Isolation Playbooks',
          'High-Performance Cloud SaaS',
        ],
        linkText: 'Explore Blog & Insights',
        linkUrl: '/blog',
      },
    },

    // ---------------------------------------------------------
    // 19. Case Studies List
    // ---------------------------------------------------------
    {
      key: 'caseStudies',
      data: [
        {
          id: 'cs-1',
          title: 'Automated Clinical Assistant & Appointment Engine',
          client: '24th Asian Bioethics Healthcare Network',
          category: 'Healthcare AI',
          description: 'Engineered an intelligent conversational AI chatbot integrated with hospital management databases, reducing patient intake waiting times by 68%.',
          metrics: '68% faster patient response',
          technologies: ['Next.js', 'Python FastAPI', 'LangChain', 'OpenAI GPT-4o'],
          featured: true,
        },
        {
          id: 'cs-2',
          title: 'Cross-Platform Tax Filing & Calculator Automation',
          client: 'BD Tax Automated Solutions',
          category: 'Fintech & SaaS',
          description: 'Architected a high-load tax computation engine that accurately automates complex Bangladeshi corporate and individual tax slabs with instant PDF certificate exports.',
          metrics: '50,000+ calculations processed',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
          featured: true,
        },
        {
          id: 'cs-3',
          title: 'Omnichannel Conversational Sales & Support Bot',
          client: 'Global Logistics & Commerce Group',
          category: 'Enterprise Bot',
          description: 'Deployed bilingual customer support chatbots across WhatsApp, Web and Messenger, cutting repetitive tier-1 support ticket volume by 74%.',
          metrics: '74% support tickets resolved automatically',
          technologies: ['Meta WhatsApp Cloud API', 'Node.js', 'Redis', 'Vector DB'],
          featured: true,
        },
        {
          id: 'cs-4',
          title: 'Interactive 3D Web Product Configurator',
          client: 'ArchTech Modern Interiors',
          category: '3D Web Development',
          description: 'Engineered real-time 3D product visualizer in Three.js allowing enterprise clients to customize furniture and architectural models in browser without plugin installations.',
          metrics: '3.4x higher user session engagement',
          technologies: ['Three.js', 'WebGL', 'React Three Fiber', 'Next.js'],
          featured: false,
        },
      ],
    },

    // ---------------------------------------------------------
    // 20. Case Studies Page Configuration
    // ---------------------------------------------------------
    {
      key: 'caseStudiesPage',
      data: {
        hero: {
          badge: 'Solutions & Capabilities',
          title: 'What product do you want to',
          titleHighlight: 'build?',
          description: 'Delivering value with tailored software solutions. Brain Bari is your trusted software and AI development partner.',
          buttonText: 'Start Your Solution',
          buttonLink: '/order',
        },
        capabilities: [
          { id: 'cap-1', title: 'Custom software development', description: 'We support you through all stages of custom software development. From strategy to the end-to-end solution development.', icon: 'Code', category: 'Engineering' },
          { id: 'cap-2', title: 'Mobile development', description: 'Build a successful software product with a user-first approach. We develop native and cross-platform mobile apps.', icon: 'Smartphone', category: 'Mobile' },
          { id: 'cap-3', title: 'Web application development', description: 'Create scalable, secure, and intuitive web apps engineered to meet your business goals effortlessly.', icon: 'Globe', category: 'Web' },
          { id: 'cap-4', title: 'Enterprise application development', description: 'Modernize legacy systems and integrate mission-critical software architectures for enterprise efficiency.', icon: 'Building2', category: 'Enterprise' },
          { id: 'cap-5', title: 'MVP development', description: 'Validate your ideas rapidly with cost-effective, market-ready Minimum Viable Products built in weeks.', icon: 'Rocket', category: 'Startups' },
          { id: 'cap-6', title: 'CTO as a Service', description: 'Executive technical strategy, technology stack selection, and high-level architectural oversight.', icon: 'UserCheck', category: 'Advisory' },
          { id: 'cap-7', title: 'IT consulting', description: 'Expert advice on digital transformation, technology audits, system architecture, and cloud infrastructure.', icon: 'HelpCircle', category: 'Advisory' },
          { id: 'cap-8', title: 'Software as a Service', description: 'End-to-end SaaS architecture design, subscription payment gateways, multi-tenant database scaling.', icon: 'Layers', category: 'Cloud' },
          { id: 'cap-9', title: 'Conversational AI & Chatbots', description: 'Multi-channel AI chat systems that understand context, qualify leads, and provide 24/7 intelligent customer care.', icon: 'Bot', category: 'AI' },
          { id: 'cap-10', title: 'Natural Language Processing (NLP)', description: 'Semantic document parsing, sentiment analysis, named entity extraction, and automated categorization.', icon: 'Brain', category: 'AI' },
          { id: 'cap-11', title: 'Machine Learning Solutions', description: 'Predictive modeling, regression analysis, computer vision, and customized neural network algorithms.', icon: 'Cpu', category: 'AI' },
          { id: 'cap-12', title: 'Generative AI Integration', description: 'Fine-tune LLMs, integrate enterprise RAG pipelines, and embed autonomous generative agents into workflows.', icon: 'Sparkles', category: 'AI' },
          { id: 'cap-13', title: 'UI/UX Design & Prototyping', description: 'Human-centered design systems, high-fidelity Figma prototypes, and seamless usability journeys.', icon: 'Palette', category: 'Design' },
        ],
        testimonials: [
          { id: 'test-1', name: 'Mizanur Rahman', company: 'London Oxford Tax', text: 'Brain Bari delivered our TaxBot system with flawless precision. Response times went from 48 hours to under 2 seconds for client queries.', rating: 5 },
          { id: 'test-2', name: 'Siam Ahmed', company: 'CCcalculator Platform', text: 'Outstanding engineering and speed. The live crypto profit analyzer handled massive traffic on launch day without a hitch.', rating: 5 },
          { id: 'test-3', name: 'Dr. Shamim Ara', company: 'Bioethics Society', text: 'Brain Bari built the entire 24th Asian Bioethics Conference portal. Smooth registration, paper submissions, and zero downtime.', rating: 5 },
          { id: 'test-4', name: 'Masuma Akter', company: "Tea 'N' Talk Lounge", text: 'The auto-order chatbot completely automated our table and delivery reservations. Very easy to work with!', rating: 5 },
          { id: 'test-5', name: 'Hiya Chowdhury', company: 'Health Care Network', text: 'Their team understands healthcare privacy and AI logic deeply. The automated wellness assistant is a game changer.', rating: 5 },
          { id: 'test-6', name: 'Rohat Mia', company: 'Global Logistics', text: 'Professional, dependable, and highly skilled in full-stack Next.js and AI integrations. Highly recommended!', rating: 5 },
        ],
      },
    },

    // ---------------------------------------------------------
    // 21. Why Choose Us (Homepage 3 Pillars)
    // ---------------------------------------------------------
    {
      key: 'whyChooseUs',
      data: [
        {
          id: 'wc-1',
          title: 'Creative thinking',
          subtitle: 'Unique & Original Solutions',
          description: 'Come up with unique, original and high-performing AI solutions.',
          icon: 'Sparkles',
        },
        {
          id: 'wc-2',
          title: 'Career Planning',
          subtitle: 'Strategic Software Roadmap',
          description: 'Plan scalable software architecture with our lead AI architects.',
          icon: 'Compass',
        },
        {
          id: 'wc-3',
          title: 'Public Speaking',
          subtitle: 'Multilingual High-Performance AI',
          description: 'Communicate seamlessly with global clients via smart chatbots.',
          icon: 'MessageSquare',
        },
      ],
    },

    // ---------------------------------------------------------
    // 22. Team Members Roster (9 Members)
    // ---------------------------------------------------------
    {
      key: 'team',
      data: [
        {
          id: 'sweet-mia',
          name: 'Sweet mia',
          role: 'Senior Strategic Advisor',
          department: 'Executive Advisory',
          experience: '10+ Years',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
          bio: 'Guiding enterprise strategy, AI adoption roadmaps, and business expansion across regional and global markets.',
          fullBio: 'Sweet mia serves as the Senior Strategic Advisor at Brain Bari. With over a decade of cross-industry expertise in strategic planning, venture scalability, and digital transformation, she counsels the executive leadership on high-impact partnership agreements, corporate governance, and sustainable business models.',
          skills: ['Enterprise AI Strategy', 'Market Expansion', 'Cross-border Partnerships', 'Executive Advisory'],
          email: 'sweet.mia@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'mohd-arifuzzaman',
          name: 'Mohd. Arifuzzaman',
          role: 'Chief executive officer (CEO)',
          department: 'Executive Leadership',
          experience: '12+ Years',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
          bio: "Leading Brain Bari's operational excellence, investor relations, and AI innovation ecosystem.",
          fullBio: "Mohd. Arifuzzaman is the Chief Executive Officer at Brain Bari, steering the company's overall vision, enterprise operations, and international collaborations. Under his leadership, Brain Bari has expanded its portfolio across conversational AI, specialized healthtech bots, and next-gen civic engagement platforms.",
          skills: ['Executive Leadership', 'Operations Management', 'AI Commercialization', 'Investor Relations'],
          email: 'arifuzzaman@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'all-asmoule-chowdhary',
          name: 'All Asmoule Chowdhary',
          role: 'Founder & Director, Brain Bari',
          department: 'Founding Leadership',
          experience: '8+ Years',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          bio: 'Visionary behind Brain Bari, pioneer in conversational AI, SaaS ecosystems, and digital platforms in Bangladesh.',
          fullBio: 'All Asmoule Chowdhary founded Brain Bari with the goal of democratizing generative AI and intelligent software solutions across Bangladesh and global markets. An avid tech entrepreneur and software architect, he leads core technology initiatives, product design philosophy, and strategic developer community growth.',
          skills: ['AI Systems Architecture', 'Product Innovation', 'Generative AI', 'Tech Entrepreneurship'],
          email: 'asmoule@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'md-jahirul-islam',
          name: 'MD. Jahirul Islam',
          role: 'Web Developer',
          department: 'Frontend Engineering',
          experience: '4+ Years',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
          bio: 'Full-stack web architect specializing in Next.js, high-speed UI, and cloud integrations.',
          fullBio: "MD. Jahirul Islam is a key contributor to Brain Bari's web platforms. He excels in architecting modern Next.js single-page applications, responsive design systems, and seamless RESTful/GraphQL API integrations with sub-second load times.",
          skills: ['React / Next.js', 'TypeScript', 'TailwindCSS', 'Performance Optimization'],
          email: 'jahirul@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'masuma-akter-akhi',
          name: 'Masuma Akter Akhi',
          role: 'Web Developer',
          department: 'Frontend Engineering',
          experience: '3+ Years',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
          bio: 'Frontend engineer dedicated to building accessible, responsive, and aesthetic user experiences.',
          fullBio: 'Masuma Akter Akhi brings creative flair and technical precision to user interfaces. She works extensively on micro-interactions, cross-browser compatibility, and modular component architectures across client web applications.',
          skills: ['Frontend Architecture', 'UI Components', 'JavaScript / ES6+', 'Responsive Layouts'],
          email: 'masuma@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'abrarul-haque',
          name: 'Abrarul Haque',
          role: 'Data Analyst',
          department: 'Data & Analytics',
          experience: '4+ Years',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
          bio: 'Transforming complex telemetry, user sentiment, and dataset pipelines into actionable insights.',
          fullBio: 'Abrarul Haque specializes in data cleaning, exploratory data analysis, and predictive modeling for conversational AI metrics. He builds real-time dashboards and conversion tracking pipelines that maximize client software ROI.',
          skills: ['Python / Pandas', 'SQL & Database Analytics', 'Data Visualization', 'User Behavior Telemetry'],
          email: 'abrarul@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'md-morsadul-islam',
          name: 'MD MORSADUL ISLAM',
          role: 'Software Engineer',
          department: 'Backend Systems',
          experience: '5+ Years',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
          bio: 'Core system engineer focused on backend architecture, scalability, microservices, and security.',
          fullBio: "MD MORSADUL ISLAM designs and deploys high-concurrency backend services. With a background in distributed systems, PostgreSQL optimization, and cloud deployments, he ensures Brain Bari's bots remain fast and fault-tolerant 24/7.",
          skills: ['Node.js / Express', 'PostgreSQL / Redis', 'Docker & CI/CD', 'Secure API Gateway'],
          email: 'morsadul@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'rabetul-islam-asif',
          name: 'Rabetul Islam Asif',
          role: 'AI Engineer',
          department: 'Artificial Intelligence',
          experience: '4+ Years',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
          bio: 'Fine-tuning LLMs, retrieval-augmented generation (RAG), and agentic workflows.',
          fullBio: 'Rabetul Islam Asif develops proprietary chatbot engines, vector database embeddings, and custom prompt workflows for domain-specific tasks in medical awareness, legal research, and automated order fulfillment.',
          skills: ['LLM Fine-Tuning', 'LangChain & LlamaIndex', 'Vector Search (Qdrant/Pinecone)', 'Prompt Engineering'],
          email: 'asif@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
        {
          id: 'mahbubur-rahman',
          name: 'Mahbubur RAHMAN',
          role: 'UI/UX Designer',
          department: 'Product Design',
          experience: '5+ Years',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
          bio: 'Crafting intuitive digital interfaces, design systems, and product ergonomics.',
          fullBio: "Mahbubur RAHMAN is the creative mind behind Brain Bari's design systems. He bridges the gap between complex AI algorithms and delightful human interaction through wireframing, design prototyping, and comprehensive user testing.",
          skills: ['Figma & Design Systems', 'User Research', 'Interaction Design', 'Prototyping & Wireframing'],
          email: 'mahbubur@brainbari.com',
          linkedin: 'https://linkedin.com/company/brain-bari',
        },
      ],
    },

    // ---------------------------------------------------------
    // 23. Industry Expertises
    // ---------------------------------------------------------
    {
      key: 'industryExpertises',
      data: [
        { title: 'Finance & Banking', bg: '#faf3e0', path: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { title: 'E-commerce', bg: '#e3f2fd', path: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
        { title: 'Telecom', bg: '#fffde7', path: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
        { title: 'Real Estate', bg: '#ffebe6', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { title: 'Software', bg: '#f5f5f5', path: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { title: 'Automotive', bg: '#fcf8e3', path: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1' },
      ],
    },

    // ---------------------------------------------------------
    // 24. Client Logos (Marquee on Homepage)
    // ---------------------------------------------------------
    {
      key: 'clientLogos',
      data: [
        { name: 'Apex Innovations', src: '/images/logo-1.jpeg' },
        { name: 'ScaleFlow Global', src: '/images/logo-2.jpeg' },
        { name: 'CloudPulse Labs', src: '/images/logo-3.jpeg' },
        { name: 'Bioethics Network', src: '/images/logo-4.jpeg' },
        { name: 'OmniLogistics Corp', src: '/images/logo-5.jpeg' },
        { name: 'FinCore Systems', src: '/images/logo-6.jpeg' },
      ],
    },

    // ---------------------------------------------------------
    // 25. Complete Site Settings (Navbar, Hero, Footer, Socials)
    // ---------------------------------------------------------
    {
      key: 'siteSettings',
      data: {
        siteName: 'Brain Bari',
        tagline: 'AI & Software Solutions Company in Bangladesh',
        navbar: {
          announcement: '🚀 Need AI Automation for your Enterprise? Book a 30-min strategy session',
          showAnnouncement: true,
          ctaText: 'Book Consultation',
          ctaLink: '/schedule',
          secondaryCtaText: 'Get a Quote',
          secondaryCtaLink: 'https://wa.me/8801754958008?text=Hello%20Brain%20Bari%20Team',
          logoUrl: '',
          logoAlt: 'Brain Bari',
          navLinks: [
            { id: 'nl-1', label: 'Home', href: '/', type: 'link' },
            { id: 'nl-2', label: 'About', href: '/about', type: 'link' },
            { id: 'nl-3', label: 'Services', href: '/services', type: 'dropdown' },
            { id: 'nl-4', label: 'Work', href: '/new-work', type: 'link' },
            { id: 'nl-5', label: 'Blog', href: '/blog', type: 'link' },
            { id: 'nl-6', label: 'Contact', href: '/contact', type: 'link' },
            { id: 'nl-7', label: 'Resources', href: '/resources/case-studies', type: 'dropdown' },
            { id: 'nl-8', label: 'Product', href: '/product', type: 'link' },
          ],
        },
        hero: {
          badge: '',
          headline: 'Powering Ideas\nwith',
          headlineGradient: 'AI & Software',
          subheadline: 'Crafting intelligent conversational agents, custom software, and scalable SaaS platforms for businesses worldwide.',
          searchPlaceholder: 'What do you want to build?',
          ctaText: 'Start Your Project',
          filterPills: ['AI Solutions', 'Custom Software', 'SaaS Development'],
          robotImage: '/images/hero_robot.jpg',
          speechBubble1: 'Hi! How can I help you?',
          speechBubble2: 'Hi Skilabot! I need your help.',
        },
        coreServices: {
          learnMoreText: 'Learn More',
          orderText: 'Order',
        },
        chatbotsConfig: {
          orderButtonText: 'Order Now',
        },
        workflow: {
          card1Title: 'Website Assistant Chatbot',
          card1Progress: '50%',
          card1Subtitle: 'WP Content Write',
          card1Desc: 'Corporate restructuring and automated workflows that streamline client response.',
          card2Title: 'Schedule',
          card2Subtitle: 'AI Chatbot Setup',
          card2Desc: 'Configure system prompts and integrate custom knowledge base files.',
          scheduleDays: [
            { day: 'WED', date: '7', active: true },
            { day: 'THU', date: '8', active: false },
            { day: 'FRI', date: '9', active: false },
            { day: 'SAT', date: '10', active: false },
            { day: 'SUN', date: '11', active: false },
          ],
          card3Title: 'Generate Unique Content',
          card3Desc: 'Autonomous content generation tailored to your company documentation, guaranteeing contextual accuracy and instant responses.',
        },
        whyChooseUs: {
          heading: 'Why choose us?',
          subheading: 'Select what is best for your enterprise from numerous proven AI options',
          buttonText: 'Learn more',
          buttonLink: '/about',
          items: [
            { id: 'wc-1', title: 'Creative thinking', subtitle: 'Unique & Original Solutions', description: 'Come up with unique, original and high-performing AI solutions.', icon: 'Sparkles' },
            { id: 'wc-2', title: 'Career Planning', subtitle: 'Strategic Software Roadmap', description: 'Plan scalable software architecture with our lead AI architects.', icon: 'Compass' },
            { id: 'wc-3', title: 'Public Speaking', subtitle: 'Multilingual High-Performance AI', description: 'Communicate seamlessly with global clients via smart chatbots.', icon: 'MessageSquare' },
          ],
        },
        conversionCta: {
          heading: 'Ready to transfer your Business',
          description: 'Developing and maintaining web applications using React.js, Next.js, and other related technologies. Collaborating with cross-functional teams to engineer digital infrastructure that scales effortlessly.',
          buttonText: 'Schedule A Consultation',
          buttonLink: '/schedule',
        },
        contact: {
          phone: '+8801754-958008',
          phoneFormatted: '+8801754-958008',
          whatsapp: '8801754958008',
          whatsappUrl: 'https://wa.me/8801754958008?text=Hello%20Brain%20Bari%20Team',
          email: 'contact@brainbari.com',
          address: 'Mirpur-10, Dhaka 1216, Bangladesh',
          workingHours: 'Sunday – Thursday: 9:00 AM – 6:00 PM (GMT+6)',
          mapEmbedUrl: 'https://maps.google.com/maps?q=Mirpur-10%2C%20Dhaka%201216%2C%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
        },
        socials: {
          linkedin: 'https://www.linkedin.com/company/brainbari',
          twitter: 'https://x.com/brain_bari',
          facebook: 'https://www.facebook.com/brainbari',
          instagram: 'https://www.instagram.com/brain_bari/',
          youtube: 'https://www.youtube.com/channel/brainbari',
          github: 'https://github.com/brainbari',
          upwork: 'https://www.upwork.com/ag/brainbari',
        },
        footer: {
          headline: "Let's talk",
          aboutText: 'Brain Bari is a premier AI & Software Solutions Agency in Bangladesh specializing in conversational AI chatbots, custom AI assistants, scalable SaaS products, and modern high-conversion web apps.',
          copyright: '© 2026 Brain Bari. All rights reserved.',
          termsText: 'All intellectual property rights and code developed by Brain Bari belong to the client upon full payment completion as per project agreement terms.',
          privacyText: 'Brain Bari values your privacy. We never share customer data, proprietary AI training datasets, or business strategies with any third parties.',
          links: [
            { id: 'fl-1', label: 'Our Work', href: '/new-work' },
            { id: 'fl-2', label: 'About Us', href: '/about' },
            { id: 'fl-3', label: 'Industries', href: '/industries' },
            { id: 'fl-4', label: 'Product', href: '/product' },
            { id: 'fl-5', label: 'Blog', href: '/blog' },
            { id: 'fl-6', label: 'Contact', href: '/contact' },
          ],
        },
        privacy: {
          privacyBadge: 'Enterprise Confidentiality & Security Standards',
          privacyTitle: 'Privacy Policy',
          privacySubtitle: 'How Brain Bari protects proprietary algorithms, client business data, and enterprise codebases with absolute data isolation.',
          privacyNdaBadge: 'Mutual NDA Enforced',
          privacyTocTitle: 'Table of Contents',
          privacyCrossNote: 'Looking for client deliverables agreement?',
          privacyCrossText: 'Read Terms & Conditions',
          privacyContactHeading: 'Questions or Data Requests?',
          privacyContactDescription: 'For any questions regarding our security protocols, to request a signed mutual NDA prior to engagement, or for data deletion requests, contact our dedicated legal team.',
          privacyContactButton: 'Email Legal Advisory',
          privacyContactEmail: 'privacy@brainbari.com',
          privacyText: 'Brain Bari values your privacy and enforces enterprise-grade security. We enforce strict Non-Disclosure Agreements (NDA), AES-256 data encryption, and we never share client code or train public AI models on your proprietary datasets.',
          ndaStatement: 'Strict 100% mutual NDA signed prior to code review, repository access, or training dataset ingestion.',
          dataRetention: 'Client datasets and proprietary test corpora are permanently removed or archived offline upon production sign-off.',

          termsBadge: 'Standard Enterprise Master Services Agreement',
          termsTitle: 'Terms & Conditions',
          termsSubtitle: 'Clear, transparent business terms governing our custom software engineering, conversational AI solutions, and intellectual property transfers.',
          termsIpBadge: '100% Client Code Ownership',
          termsTocTitle: 'Table of Contents',
          termsCrossNote: 'Need details regarding data handling & NDA?',
          termsCrossText: 'Read Privacy & NDA Policy',
          termsContactHeading: 'Have Contract or Licensing Questions?',
          termsContactDescription: 'Our business operations and legal advisory team are available to review custom enterprise contracts, master services agreements, and compliance requirements.',
          termsContactButton: 'Contact Legal Operations',
          termsContactEmail: 'legal@brainbari.com',
          termsText: 'All intellectual property rights, custom software designs, source code, and deployment scripts engineered by Brain Bari belong 100% to the client upon full payment completion as per project agreement terms.',
          paymentTerms: 'Milestone-based escrow releases upon verified deployment, sprint review, and client acceptance testing.',

          lastUpdated: 'October 2026',
          cookieNotice: 'We use essential cookies strictly to provide authentication and secure session state. No third-party ad tracking scripts are executed.',
          privacySections: [
            {
              id: 'overview',
              title: '1. Overview & Commitment',
              content: 'Brain Bari enforces enterprise-grade security and confidentiality. We maintain strict Non-Disclosure Agreements (NDA), AES-256 data encryption, and we never share client code or train public AI models on your proprietary datasets.\n\nThis Privacy Policy explains how Brain Bari ("we", "our", or "us") collects, protects, isolates, and handles confidential data, intellectual property, and personal information when you access our website or commission custom software, conversational AI chatbots, and cloud infrastructure.',
            },
            {
              id: 'nda-confidentiality',
              title: '2. Mutual NDA & Confidentiality Guarantee',
              content: 'All discussions, codebase reviews, architecture schematics, and customer support transcripts shared during discovery or active sprints are automatically treated as Confidential Information under our standard or mutual enterprise Non-Disclosure Agreement.\n\nStrict 100% mutual NDA signed prior to code review, repository access, or training dataset ingestion.',
            },
            {
              id: 'zero-ai-training',
              title: '3. Zero Public Model Training Guarantee',
              content: 'We know your trade secrets and proprietary data are critical assets. Brain Bari provides an irrevocable guarantee:\n\n• No Model Ingestion: Client prompts, database schemas, and proprietary knowledge vectors are never used to train public foundation models (OpenAI, Anthropic, Gemini, or Meta).\n• Private Fine-Tuning: Any specialized fine-tuned model or RAG index created for your engagement remains your exclusive intellectual property and is deployed strictly to your VPC or isolated tenant.\n• Zero Cross-Tenant Leakage: Strict tenant separation guards prevent any client data from intermixing with other customer environments.',
            },
            {
              id: 'data-collection',
              title: '4. Information We Process',
              content: 'Project Deliverable Data: API tokens, repository URLs, documentation, schema diagrams, and test credentials provided to execute development milestones.\n\nCommunication Details: Authorized stakeholder names, corporate emails, phone numbers, and WhatsApp IDs used strictly for sprint alignment.',
            },
            {
              id: 'retention-deletion',
              title: '5. Data Retention & Permanent Deletion',
              content: 'Client datasets and proprietary test corpora are permanently removed or archived offline upon production sign-off.\n\nUpon formal handover and warranty closure, you may request a cryptographic certificate of data erasure for all development staging databases, synthetic training corpora, and temporary test credentials.',
            },
            {
              id: 'security-standards',
              title: '6. Security & Encryption Standards',
              content: 'All infrastructure architected by Brain Bari follows security-by-design guidelines:\n\n• AES-256 Encryption: Rest & TLS 1.3 transit encryption\n• VPC Isolation: Dedicated private VPC networks\n• Role-Based Access: Least privilege access policies',
            },
            {
              id: 'cookies-tracking',
              title: '7. Cookies & Session Integrity',
              content: 'We use essential cookies strictly to provide authentication and secure session state. No third-party ad tracking scripts are executed.',
            },
            {
              id: 'client-rights',
              title: '8. Client Rights & Compliance Standards',
              content: 'Regardless of geography, every enterprise customer retains complete rights to inspect data logs, review deployment manifests, request full data export, and revoke access keys at any time without penalty.',
            },
            {
              id: 'contact-legal',
              title: '9. Questions or Data Requests?',
              content: 'For any questions regarding our security protocols, to request a signed mutual NDA prior to engagement, or for data deletion requests, contact our dedicated legal team.',
            },
          ],
          termsSections: [
            {
              id: 'acceptance',
              title: '1. Acceptance & Engagement Scope',
              content: 'By commissioning software development, purchasing service packages, or entering an agreement with Brain Bari ("Company"), the client ("Customer") agrees to be bound by these Terms & Conditions.\n\nEach engagement is executed through agreed Statements of Work (SOW), project milestones, or formal invoices detailing deliverables, technology stacks, sprint schedules, and pricing.',
            },
            {
              id: 'ip-ownership',
              title: '2. 100% Client Intellectual Property & Code Ownership',
              content: 'All intellectual property rights, custom software designs, source code, and deployment scripts engineered by Brain Bari belong 100% to the client upon full payment completion as per project agreement terms.\n\nUnlike traditional agencies that license code with recurring lock-ins, Brain Bari delivers complete intellectual property assignment. Upon milestone payment settlement, all Git repositories, Figma designs, database schemas, and deploy scripts belong exclusively to you.',
            },
            {
              id: 'milestones-payment',
              title: '3. Milestones & Escrow Payment Structure',
              content: 'Milestone-based escrow releases upon verified deployment, sprint review, and client acceptance testing.\n\n• Milestone Based: Payments tied to verified deliverables\n• Escrow Protection: Supported via Upwork or direct wire escrow\n• Accepted Sign-off: 7-day testing and acceptance review',
            },
            {
              id: 'client-obligations',
              title: '4. Client Obligations & Timely Approvals',
              content: 'Timely delivery relies on mutual collaboration. Customers agree to designate a technical or product lead authorized to provide design reviews, API credentials, and milestone approvals within 5 business days of sprint submission.',
            },
            {
              id: 'ai-dependencies',
              title: '5. Third-Party AI Models & Cloud Dependencies',
              content: 'For solutions leveraging foundation LLM APIs (such as OpenAI, Anthropic Claude, Google Gemini, or AWS Bedrock), ongoing inference token fees are billed directly to the customer\'s own cloud accounts. Brain Bari architects solutions with rate limiting, prompt optimization, and fallback safeguards to minimize ongoing token expenditure.',
            },
            {
              id: 'warranty-support',
              title: '6. 30-Day Post-Launch Warranty',
              content: 'Every custom deliverable includes a complimentary 30-day post-launch warranty covering bug fixes, edge-case remediation, and deployment stabilization. Extended SLA maintenance and ongoing DevOps support can be retained through custom monthly retainers.',
            },
            {
              id: 'liability-limits',
              title: '7. Limitation of Liability',
              content: 'To the maximum extent permitted by applicable law, in no event shall either party be liable for indirect, incidental, special, consequential, or punitive damages. The Company\'s aggregate liability under any statement of work shall not exceed the total fees paid by the customer for the specific milestone giving rise to the claim.',
            },
            {
              id: 'termination',
              title: '8. Termination & Escrow Settlement',
              content: 'Either party may terminate an active engagement with 14 days written notice. In such an event, the customer will only be billed for completed and verified sprint milestones up to the termination date, and all intellectual property for paid deliverables will be immediately transferred.',
            },
            {
              id: 'governing-law',
              title: '9. Governing Law & Dispute Resolution',
              content: 'These terms are governed by and construed in accordance with the laws of Bangladesh, without regard to conflict of law principles. Parties agree to attempt good-faith informal negotiation for 30 days before initiating formal arbitration proceedings.',
            },
          ],
        },
      },
    },

    // ---------------------------------------------------------
    // 26. Footer Languages (Multi-Language Selector)
    // ---------------------------------------------------------
    {
      key: 'footer-languages',
      data: [
        { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
        { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
        { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
      ],
    },

    // ---------------------------------------------------------
    // 27. Resources Links (Navbar & MegaMenu Navigation)
    // ---------------------------------------------------------
    {
      key: 'resourcesLinks',
      data: [
        {
          id: 'case-studies',
          title: 'Case Studies & ROI',
          description: 'Real-world AI deployment results, metrics, and technical architecture breakdowns.',
          href: '/resources/case-studies',
          icon: 'Briefcase',
        },
        {
          id: 'partners',
          title: 'Strategic Partners',
          description: 'Collaborate, integrate, and scale with our certified AI and agency partner network.',
          href: '/resources/partners',
          icon: 'Handshake',
        },
        {
          id: 'event',
          title: 'Events & Community',
          description: 'Discover upcoming hackathons, AI symposiums, and technical roadmaps.',
          href: '/resources/event',
          icon: 'Calendar',
        },
        {
          id: 'team',
          title: 'Leadership & Team',
          description: 'Meet the specialized software engineers, ML researchers, and architects behind Brain Bari.',
          href: '/resources/team',
          icon: 'UserCheck',
        },
      ],
    },
  ];

  for (const c of contents) {
    await prisma.cmsContent.upsert({
      where: { key: c.key },
      update: { data: c.data },
      create: { key: c.key, data: c.data },
    });
    console.log(`  ✅ Seeded CMS content: ${c.key}`);
  }

  console.log('🎉 CMS content seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during CMS content seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
