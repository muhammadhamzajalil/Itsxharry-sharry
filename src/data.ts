import { 
  FAQItem, 
  FeatureItem, 
  TestimonialItem, 
  HowItWorksStep, 
  EcosystemNode, 
  ComparisonRow 
} from "./types";

export const STATS_DATA = [
  { id: "members", value: 50000, suffix: "+", label: "Active Members", desc: "Globally active entrepreneurs" },
  { id: "countries", value: 100, suffix: "+", label: "Countries Connected", desc: "Borderless business reach" },
  { id: "commissions", value: 10, prefix: "$", suffix: "M+", label: "Commissions Paid", desc: "Distributed to members" },
  { id: "satisfaction", value: 95, suffix: "%", label: "Member Satisfaction", desc: "Verified success rate" }
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 1,
    title: "Join Ecom Network",
    description: "Create your workspace and obtain access to premium training and a personalized e-commerce store infrastructure.",
    iconName: "UserPlus",
    details: [
      "Instant portal setup",
      "Plug-and-play storefront",
      "Access to global product inventory",
      "Personal marketing dashboard"
    ]
  },
  {
    id: 2,
    title: "Build Your Connections",
    description: "Leverage social commerce, share high-demand products, and partner with other motivated digital entrepreneurs.",
    iconName: "Users",
    details: [
      "Share automated social funnels",
      "Affiliate link generation",
      "Global team building tools",
      "Mentorship and study groups"
    ]
  },
  {
    id: 3,
    title: "Earn Commissions & Grow",
    description: "Receive instant payouts from multi-tiered sales volume and expand your residual income channels globally.",
    iconName: "TrendingUp",
    details: [
      "Real-time wallet deposits",
      "Multi-tier team commissions",
      "Performance incentives and bonuses",
      "Weekly/monthly automated cashouts"
    ]
  }
];

export const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: "affiliate",
    title: "Affiliate Marketing",
    description: "Earn massive payouts by recommending verified, high-margin global physical and digital products.",
    iconName: "Link2",
    x: 50,
    y: 12,
    colorClass: "from-green-500 to-emerald-600",
    detailsList: ["Up to 40% retail commission", "High-conversion products", "Auto-cookie tracking for 60 days"]
  },
  {
    id: "ecommerce",
    title: "E-commerce Stores",
    description: "Launch pre-configured online systems loaded with trending items. No warehousing or shipping required.",
    iconName: "ShoppingBag",
    x: 82,
    y: 28,
    colorClass: "from-emerald-500 to-teal-600",
    detailsList: ["Pre-built digital showcase", "Integrated checkout backend", "Global dropship fulfilment"]
  },
  {
    id: "social",
    title: "Social Commerce",
    description: "Utilize viral content strategies on TikTok, Instagram, and WhatsApp to scale transactional volume.",
    iconName: "Share2",
    x: 80,
    y: 72,
    colorClass: "from-green-400 to-lime-500",
    detailsList: ["Viral short-form outlines", "Interactive shoppable feeds", "WhatsApp automation funnels"]
  },
  {
    id: "digital",
    title: "Digital Products",
    description: "Market premium licenses, self-growth masterclasses, and software utilities with virtually zero delivery overhead.",
    iconName: "Sparkles",
    x: 50,
    y: 88,
    colorClass: "from-emerald-600 to-green-600",
    detailsList: ["90% profit-margin items", "Instant digital downloads", "Recurring membership upgrades"]
  },
  {
    id: "referral",
    title: "Referral Income",
    description: "Earn recurring percentages by introducing high-performance distributors and creators to the ecosystem.",
    iconName: "Gift",
    x: 20,
    y: 72,
    colorClass: "from-green-600 to-teal-500",
    detailsList: ["Direct invite commissions", "Passive leadership match override", "Generous onboarding incentives"]
  },
  {
    id: "teambuilding",
    title: "Team Building",
    description: "Construct an active digital network and unlock passive revenue overwrites based on organization-wide scale.",
    iconName: "GitMerge",
    x: 18,
    y: 28,
    colorClass: "from-emerald-600 to-lime-600",
    detailsList: ["Leveraged organization volume", "Uncapped generation depth override", "Team leadership rank advances"]
  },
  {
    id: "branding",
    title: "Personal Branding",
    description: "Master digital identity framing with our templates to build an automated funnel of inbound opportunities.",
    iconName: "Award",
    x: 50,
    y: 50, // Central anchor node!
    colorClass: "from-green-600 via-emerald-500 to-green-700",
    detailsList: ["Premium social presence blueprints", "Inbound lead gen frameworks", "Influencer level status pathways"]
  }
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "feat1",
    title: "Global Community",
    description: "Connect with thousands of driven digital entrepreneurs from 100+ countries. Participate in live roundtables and joint mastermind sessions.",
    iconName: "Globe",
    badge: "Popular",
    delay: 0.1
  },
  {
    id: "feat2",
    title: "AI-Powered Business Tools",
    description: "Generate highly engaging copywriting hooks, TikTok scripts, and high-conversion e-commerce sales copy in seconds with built-in AI generators.",
    iconName: "Cpu",
    badge: "New",
    delay: 0.2
  },
  {
    id: "feat3",
    title: "Training Academy",
    description: "On-demand masterclasses taught by 7-figure earners covering affiliate techniques, automated ad scaling, store optimization, and network leadership.",
    iconName: "BookOpen",
    delay: 0.3
  },
  {
    id: "feat4",
    title: "Passive Income Streams",
    description: "Move beyond standard active selling. Grow a leverage-based network of partners to unlock consistent recurring passive royalties.",
    iconName: "Wallet",
    badge: "Uncapped",
    delay: 0.4
  },
  {
    id: "feat5",
    title: "Marketing Automation",
    description: "Deploy pre-built high-converting landing pages, e-mail nurture schedules, and WhatsApp broadcast templates with single-click integrations.",
    iconName: "Shuffle",
    delay: 0.5
  },
  {
    id: "feat6",
    title: "Commission Tracking Dashboard",
    description: "Complete oversight of personal earnings, team volume, and click attributions. Beautiful dynamic charts with precise itemized breakdowns.",
    iconName: "LineChart",
    badge: "Fintech Grade",
    delay: 0.6
  },
  {
    id: "feat7",
    title: "Real-Time Analytics",
    description: "Know exactly which paths are yielding results. Real-time updates on active traffic counts, cart completions, and referral team registration rates.",
    iconName: "PieChart",
    delay: 0.7
  },
  {
    id: "feat8",
    title: "24/7 Support",
    description: "Our dedicated backend operations and customer success teams are always available to help secure your systems and troubleshoot inquiries.",
    iconName: "Headphones",
    delay: 0.8
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "test1",
    name: "Kamran Shah",
    role: "Ecom Network Ambassador",
    location: "Lahore, PK",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    rating: 5,
    quote: "Switching from regular drop-shipping to Ecom Network was a game-changer. The storefront structure is handled for you, and the passive overriding commissions are absolutely life-changing.",
    metricLabel: "Monthly Revenue",
    metricValue: "Rs. 250k+"
  },
  {
    id: "test2",
    name: "Ayesha Khan",
    role: "Social Creator & Affiliate Director",
    location: "Karachi, PK",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    rating: 5,
    quote: "Building my digital network here takes minimal effort because of the AI-powered social funnels. I introduced 12 creators who are now matching sales of original products. The passive income makes itself.",
    metricLabel: "Total Earned",
    metricValue: "Rs. 1.2M+"
  },
  {
    id: "test3",
    name: "Marcus Dupont",
    role: "Global Affiliate Strategist",
    location: "Paris, FR",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    rating: 5,
    quote: "Ecom Network solved the core friction of digital marketing—inventory and team alignment. The real-time tracking is flawlessly exact. I have team nodes in 8 different European countries generating volume.",
    metricLabel: "Network Size",
    metricValue: "2,400+ members"
  },
  {
    id: "test4",
    name: "Zainab Malik",
    role: "Former Corporate Manager",
    location: "Islamabad, PK",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    rating: 5,
    quote: "I left my corporate job because this model offers uncapped growth, whereas my salary had strict ceilings. The Training Academy literally outlines every step. In 90 days, I surpassed my previous 12-month salary.",
    metricLabel: "Speed to Target",
    metricValue: "45 Days to Elite"
  }
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    benefit: "Scalability & Leverage",
    traditionalJob: "Fixed Salary (Trade Time For Income)",
    traditionalMLM: "Complex structures & expensive starter kits",
    ecomNetwork: "Automated duplication with no limits or physical borders",
    isPositive: [false, false, true]
  },
  {
    benefit: "Product Delivery Friction",
    traditionalJob: "Not applicable",
    traditionalMLM: "You hold inventory or deal with slow manual shipping",
    ecomNetwork: "Instant digital logistics & automated global drop-shipping",
    isPositive: [false, false, true]
  },
  {
    benefit: "Skill Building & Tech Support",
    traditionalJob: "Zero personal coaching, rigid static learning",
    traditionalMLM: "Manual local presentations & outdated warm-calling",
    ecomNetwork: "Elite AI-Powered Marketing copywriter & live global academies",
    isPositive: [false, false, true]
  },
  {
    benefit: "Lucrative Profit Margins",
    traditionalJob: "Fixed salary, minuscule performance commissions",
    traditionalMLM: "Low retail margins after heavy multi-level splits",
    ecomNetwork: "Up to 40% retail & uncapped multi-depth overriding royalties",
    isPositive: [false, false, true]
  },
  {
    benefit: "Financial & Location Freedom",
    traditionalJob: "Bound to physical workplace and set schedules",
    traditionalMLM: "Bound to home meetings and localized target zones",
    ecomNetwork: "100% cloud-based. Earn globally while working physically anywhere",
    isPositive: [false, false, true]
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq1",
    category: "General",
    question: "What exactly is representation in Ecom Network?",
    answer: "Ecom Network is an advanced, hybrid digital ecosystem combining the elements of affiliate advertising, automated high-converting e-commerce web templates, and team-based network marketing. We offer you the inventory, the digital storefront layouts, and the tracking engine to earn direct retail commissions and override passive residuals."
  },
  {
    id: "faq2",
    category: "Earnings",
    question: "How do I earn commissions?",
    answer: "You earn commissions through two main channels: (1) Direct sales commissions (up to 40%) when consumers purchase hot physical or digital items via your unique digital shop links, and (2) Network overriding commissions when members you introduce to the network scale their stores and refer new entrepreneurs themselves."
  },
  {
    id: "faq3",
    category: "System",
    question: "Do I need technical skills or past experience?",
    answer: "Absolutely not. Our system is created with simplicity at its core. Your digital shop and tracking ledger are completely pre-configured. Furthermore, our Training Academy provides bite-sized, video-guided courses that teach you everything from social media viral strategies to automated target systems."
  },
  {
    id: "faq4",
    category: "Earnings",
    question: "Is there a limit on how much I can withdraw?",
    answer: "No, there are no limits on withdrawal. Commissions are tracked perfectly in real-time. You can trigger automated withdrawals directly to your local bank account, digital wallets, or international bank transfers on a weekly basis, subject to a small standard processing clearance time."
  },
  {
    id: "faq5",
    category: "General",
    question: "What makes this different and better than standard network marketing?",
    answer: "Traditional network selling involves buying expensive initial stock and bothering close relatives. Ecom Network requires zero physical stock on your end! Every transaction happens through smooth global drop-shipping. You scale via TikTok/Instagram sharing using our custom AI generation scripts, targeting buyers who are searching actively for your items."
  },
  {
    id: "faq6",
    category: "Support",
    question: "What support will I receive?",
    answer: "You are never alone. Along with the custom portals and AI tools, you get around-the-clock tech support, direct integration with global community groups (Discord/WhatsApp), and weekly live coaching masterclasses where our top earners share updated high-converting scripts."
  }
];
