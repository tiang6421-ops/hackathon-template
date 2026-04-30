import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

type SeedOption = string | { text: string; imageUrl?: string }
type SeedTopic = {
  title: string
  id?: string
  imageUrl?: string
  order?: number
  options: SeedOption[]
}
type SeedCategory = { name: string; emoji: string; topics: SeedTopic[] }

const CATEGORIES: SeedCategory[] = [
  {
    name: "KL Recommendations",
    emoji: "🇲🇾",
    topics: [
      {
        title: "Good Fish & chips in Kuala Lumpur",
        imageUrl: "/images/cor-blimey.jpg",
        order: -3,
        options: [
          { text: "Cor Blimey", imageUrl: "/images/cor-blimey.jpg" },
          { text: "Lad & Dad", imageUrl: "/images/battered-co.jpg" },
          { text: "Cwtch", imageUrl: "/images/Cwtch.jpg" },
          { text: "Boys Don't Fry", imageUrl: "/images/boys-dont-fry.jpg" },
        ],
      },
      {
        title: "Good vibes Bar in KL",
        imageUrl: "/images/Canopy-Rooftop-Lounge-Bar.jpg",
        order: -2,
        options: [
          {
            text: "Canopy Lounge Rooftop Bar KL",
            imageUrl: "/images/Canopy-Rooftop-Lounge-Bar.jpg",
          },
          { text: "Mantra Bar KL", imageUrl: "/images/mantra-bar-kl.jpg" },
          {
            text: "The Social Desk Park",
            imageUrl: "/images/the-social-desa-parkcity.jpg",
          },
        ],
      },
    ],
  },
  {
    name: "Work",
    emoji: "💼",
    topics: [
      {
        id: "uk-best-workshop-collab-tools-ba",
        title: "Best workshop/collaboration tools for BA work?",
        imageUrl:
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
        order: -1,
        options: [
          {
            text: "Monday.com",
            imageUrl: "https://cdn.cdnlogo.com/logos/m/75/monday.svg",
          },
          {
            text: "Miro",
            imageUrl: "https://cdn.worldvectorlogo.com/logos/miro-2.svg",
          },
          {
            text: "SharePoint",
            imageUrl:
              "https://res-1.cdn.office.net/files/fabric/assets/brand-icons/product/svg/sharepoint_48x1.svg",
          },
          {
            text: "Microsoft Teams",
            imageUrl:
              "https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg",
          },
        ],
      },
    ],
  },
  {
    name: "Events & Seasonal",
    emoji: "🌸",
    topics: [
      {
        title: "Best events in Brisbane this spring",
        options: [
          "Brisbane Festival",
          "Ekka Royal Show",
          "Paniyiri Greek Festival",
          "Brisbane Open House",
          "Riverfire",
        ],
      },
      {
        title: "Must-visit festivals in Sydney this month",
        options: [
          "Sydney Festival",
          "Vivid Sydney",
          "Sculpture by the Sea",
          "Chinese New Year Festival",
          "Mardi Gras",
        ],
      },
      {
        title: "Things to do this weekend near KL",
        options: [
          "Batu Caves",
          "KLCC Park",
          "Bukit Tabur hike",
          "Central Market",
          "Sunway Lagoon",
        ],
      },
      {
        title: "Best Christmas markets in Melbourne",
        options: [
          "Queen Victoria Night Market",
          "The Christmas Square at Fed Square",
          "Melbourne Christmas Market",
          "Hahndorf Christmas Market",
        ],
      },
      {
        title: "Upcoming tech events in Singapore",
        options: [
          "Tech Week Singapore",
          "FinTech Festival",
          "DevFest Singapore",
          "GeekcampSG",
          "JumpStart",
        ],
      },
    ],
  },
  {
    name: "Community & Social Impact",
    emoji: "🤝",
    topics: [
      {
        title: "Most fun community service activities in Sydney",
        options: [
          "Beach clean-up at Bondi",
          "OzHarvest food rescue",
          "Tree planting with Landcare",
          "Reading to seniors",
          "Homeless shelter meal prep",
        ],
      },
      {
        title: "Best volunteering opportunities in Brisbane",
        options: [
          "RSPCA Queensland",
          "Meals on Wheels",
          "Foodbank Queensland",
          "Beach clean-up Moreton Bay",
          "Brisbane City Council tree planting",
        ],
      },
      {
        title: "Team-friendly charity events",
        options: [
          "Charity fun run",
          "Beach clean-up day",
          "Food bank packing",
          "Christmas gift drive",
          "Sponsored silence",
        ],
      },
      {
        title: "Environmental initiatives to join locally",
        options: [
          "Tree planting",
          "River clean-up",
          "Recycling drive",
          "Community garden",
          "Beach clean-up",
        ],
      },
      {
        title: "Corporate social responsibility ideas for teams",
        options: [
          "Skills-based volunteering",
          "Team charity walk",
          "Pro bono consulting",
          "Mentor program",
          "Food bank day",
        ],
      },
    ],
  },
  {
    name: "Travel & Exploration",
    emoji: "✈️",
    topics: [
      {
        title: "Best weekend getaways from KL",
        options: [
          "Malacca",
          "Cameron Highlands",
          "Genting Highlands",
          "Port Dickson",
          "Janda Baik",
        ],
      },
      {
        title: "Must-visit places in Singapore for first-timers",
        options: [
          "Marina Bay Sands",
          "Gardens by the Bay",
          "Sentosa Island",
          "Chinatown",
          "Orchard Road",
        ],
      },
      {
        title: "Best beaches near Sydney",
        options: [
          "Bondi Beach",
          "Manly Beach",
          "Coogee Beach",
          "Palm Beach",
          "Bronte Beach",
        ],
      },
      {
        title: "Hidden gems in Melbourne",
        options: [
          "Hosier Lane",
          "Block Arcade",
          "Queen Victoria Night Market",
          "ACMI",
          "Degraves Street",
        ],
      },
      {
        title: "Best food streets in Penang",
        options: [
          "Gurney Drive",
          "Lebuh Chulia",
          "Kimberley Street",
          "New Lane",
          "Chowrasta Market",
        ],
      },
    ],
  },
  {
    name: "Health & Wellness",
    emoji: "💪",
    topics: [
      {
        title: "Best gyms near office",
        options: [
          "Virgin Active",
          "Fitness First",
          "Anytime Fitness",
          "Celebrity Fitness",
          "F45",
        ],
      },
      {
        title: "Good running routes near KL",
        options: [
          "KLCC Park loop",
          "Desa ParkCity",
          "Bukit Kiara trail",
          "Titiwangsa Lake",
          "Lake Gardens",
        ],
      },
      {
        title: "Best ways to stay active during work",
        options: [
          "Standing desk",
          "Walking meetings",
          "Lunchtime walk",
          "Desk stretches",
          "Take the stairs",
        ],
      },
      {
        title: "Yoga vs gym vs sports — what do you prefer?",
        options: ["Yoga", "Gym", "Sports", "Mix of all"],
      },
      {
        title: "Best healthy lunch options nearby",
        options: [
          "Salad bar",
          "Poke bowl",
          "Grilled chicken wrap",
          "Bento set",
          "Buddha bowl",
        ],
      },
    ],
  },
  {
    name: "Work Environment & Habits",
    emoji: "☕",
    topics: [
      {
        title: "Best cafes to work from",
        options: [
          "Starbucks",
          "Coffee Bean & Tea Leaf",
          "Local independent café",
          "Dome Café",
          "The Coffee Club",
        ],
      },
      {
        title: "Quiet spots to focus near office",
        options: [
          "Library",
          "Empty meeting room",
          "Rooftop garden",
          "Café corner booth",
          "Coworking quiet zone",
        ],
      },
      {
        title: "Office vs WFH productivity",
        options: ["Office", "WFH", "Hybrid 2-3", "Fully remote"],
      },
      {
        title: "Morning vs afternoon productivity",
        options: ["Morning", "Afternoon", "Late night", "Depends on day"],
      },
      {
        title: "Best way to run effective meetings",
        options: [
          "Clear agenda",
          "Time-boxed",
          "Stand-up format",
          "Decision-driven",
          "Rotating chair",
        ],
      },
    ],
  },
  {
    name: "Team Culture & Activities",
    emoji: "🎉",
    topics: [
      {
        title: "Team outing ideas",
        options: [
          "Escape room",
          "Bowling",
          "Karaoke",
          "Cooking class",
          "Paintball",
        ],
      },
      {
        title: "Best team bonding activities",
        options: [
          "Escape room",
          "Cooking class",
          "Trivia night",
          "Hiking",
          "Board game night",
        ],
      },
      {
        title: "Office games to play",
        options: [
          "Mario Kart",
          "Foosball",
          "Ping pong",
          "Card games",
          "Chess",
        ],
      },
      {
        title: "Friday team activity ideas",
        options: [
          "Happy hour",
          "Show and tell",
          "Team lunch",
          "Board games",
          "Demo day",
        ],
      },
      {
        title: "Virtual team building ideas",
        options: [
          "Online trivia",
          "Virtual escape room",
          "Coffee chat",
          "Online gaming",
          "Show and tell",
        ],
      },
    ],
  },
  {
    name: "Learning & Growth",
    emoji: "🧠",
    topics: [
      {
        title: "Best online learning platforms",
        options: [
          "Udemy",
          "Coursera",
          "Pluralsight",
          "LinkedIn Learning",
          "edX",
        ],
      },
      {
        title: "What skill should you learn next?",
        options: [
          "AI / ML",
          "Public speaking",
          "System design",
          "Project management",
          "Data analysis",
        ],
      },
      {
        title: "Best tech newsletters",
        options: [
          "TLDR",
          "Morning Brew Tech",
          "Hacker News Digest",
          "Bytes.dev",
          "Pragmatic Engineer",
        ],
      },
      {
        title: "Best podcasts for developers",
        options: [
          "Syntax.fm",
          "Changelog",
          "Software Engineering Daily",
          "Lex Fridman",
          "CoRecursive",
        ],
      },
      {
        title: "Best courses for career growth",
        options: [
          "People management 101",
          "Strategic thinking",
          "Communication skills",
          "Leadership essentials",
          "Negotiation",
        ],
      },
    ],
  },
  {
    name: "Tech Trends",
    emoji: "💻",
    topics: [
      {
        title: "Best AI tools for daily work",
        options: [
          "ChatGPT",
          "Claude",
          "GitHub Copilot",
          "Cursor",
          "Notion AI",
        ],
      },
      {
        title: "Most useful ChatGPT use cases",
        options: [
          "Writing emails",
          "Code review",
          "Brainstorming",
          "Summarising docs",
          "Learning new topics",
        ],
      },
      {
        title: "AI vs traditional coding tools",
        options: ["AI-first", "AI-assisted", "Traditional", "Mix"],
      },
      {
        title: "Best browser extensions for productivity",
        options: [
          "1Password",
          "Grammarly",
          "Todoist",
          "Loom",
          "Notion Web Clipper",
        ],
      },
      {
        title: "Most exciting tech trend right now",
        options: [
          "Generative AI",
          "Edge computing",
          "Quantum computing",
          "AR / VR",
          "Robotics",
        ],
      },
      {
        title: "Best testing tool",
        options: ["Playwright", "Cypress", "Vitest", "Jest", "Testing Library"],
      },
    ],
  },
  {
    name: "Fun & Opinions",
    emoji: "🍿",
    topics: [
      { title: "Coffee vs tea", options: ["Coffee", "Tea"] },
      { title: "Mac vs Windows", options: ["Mac", "Windows", "Linux"] },
      { title: "Tabs vs spaces", options: ["Tabs", "Spaces"] },
      { title: "Early bird vs night owl", options: ["Early bird", "Night owl"] },
      { title: "Work from home vs office", options: ["WFH", "Office", "Hybrid"] },
    ],
  },
  {
    name: "Daily Life Decisions",
    emoji: "🛍️",
    topics: [
      {
        title: "Best food delivery apps",
        options: [
          "GrabFood",
          "Foodpanda",
          "Shopee Food",
          "Deliveroo",
          "Uber Eats",
        ],
      },
      {
        title: "Grab vs public transport",
        options: ["Grab", "MRT/LRT", "Bus", "Walk / cycle"],
      },
      {
        title: "Best lunch under $10",
        options: [
          "Chicken rice",
          "Fishball noodles",
          "Economy rice",
          "Poke bowl",
          "Kopitiam set",
        ],
      },
      {
        title: "Best snacks in office",
        options: [
          "Mixed nuts",
          "Instant noodles",
          "Fresh fruits",
          "Biscuits",
          "Chocolate bars",
        ],
      },
      {
        title: "Best place for quick coffee",
        options: [
          "Starbucks",
          "Coffee Bean",
          "McCafé",
          "7-Eleven",
          "Flash Coffee",
        ],
      },
      {
        title: "Where to eat near SG office",
        options: [
          "Maxwell Food Centre",
          "Lau Pa Sat",
          "Amoy Street Food Centre",
          "Tanjong Pagar hawker",
          "One Raffles Place food court",
        ],
      },
    ],
  },
  {
    name: "KL Sentral",
    emoji: "🚉",
    topics: [
      {
        title: "Best budget meal in KL Sentral?",
        imageUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
        options: [
          "McDonald's KL Sentral",
          "OldTown White Coffee NU Sentral",
          "Subway KL Sentral",
          "Nando's NU Sentral",
        ],
      },
      {
        title: "Best café for working on laptop?",
        imageUrl:
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Starbucks NU Sentral",
          "Coffee Bean & Tea Leaf NU Sentral",
          "Dome Café NU Sentral",
          "San Francisco Coffee NU Sentral",
        ],
      },
      {
        title: "Best place for Malaysian breakfast?",
        imageUrl:
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
        options: [
          "OldTown White Coffee",
          "PappaRich NU Sentral",
          "KL Sentral Food Court stall",
          "Madam Kwan's NU Sentral",
        ],
      },
      {
        title: "Best quick meal under 20 minutes?",
        imageUrl:
          "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80",
        options: [
          "McDonald's KL Sentral",
          "Subway KL Sentral",
          "7-Eleven NU Sentral ready meals",
          "OldTown White Coffee express menu",
        ],
      },
      {
        title: "Best premium coffee in KL Sentral?",
        imageUrl:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Starbucks NU Sentral",
          "Coffee Bean NU Sentral",
          "San Francisco Coffee NU Sentral",
          "Coffee Bean Express kiosk NU Sentral",
        ],
      },
      {
        title: "Best café environment (comfort + seating)?",
        imageUrl:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Starbucks NU Sentral",
          "Dome Café NU Sentral",
          "Coffee Bean NU Sentral",
          "OldTown White Coffee NU Sentral",
        ],
      },
      {
        title: "Best grab-and-go coffee option?",
        imageUrl:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Starbucks takeaway counter NU Sentral",
          "Coffee Bean takeaway NU Sentral",
          "San Francisco Coffee takeaway NU Sentral",
          "7-Eleven coffee machine NU Sentral",
        ],
      },
      {
        title: "Best transport usage at KL Sentral?",
        imageUrl:
          "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
        options: [
          "KTM Komuter",
          "KLIA Ekspres",
          "LRT Kelana Jaya Line",
          "Airport shuttle bus",
        ],
      },
      {
        title: "Best traveller convenience factor?",
        imageUrl:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Direct airport access",
          "Multiple train lines in one station",
          "NU Sentral shopping mall access",
          "Food court availability",
        ],
      },
      {
        title: "1-hour layover plan choice?",
        imageUrl:
          "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Eat McDonald's KL Sentral",
          "Coffee at Starbucks NU Sentral",
          "OldTown White Coffee meal",
          "Subway quick sandwich",
        ],
      },
      {
        title: "Best place for work call?",
        imageUrl:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        options: [
          "Starbucks NU Sentral",
          "Coffee Bean NU Sentral",
          "Dome Café NU Sentral",
          "San Francisco Coffee NU Sentral",
        ],
      },
      {
        title: "Best \"safe choice\" food for tourists?",
        imageUrl:
          "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1200&q=80",
        options: [
          "McDonald's KL Sentral",
          "OldTown White Coffee",
          "Madam Kwan's NU Sentral",
          "Subway KL Sentral",
        ],
      },
    ],
  },
]

async function main() {
  console.log("Clearing existing category data...")
  await prisma.vote.deleteMany()
  await prisma.option.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.category.deleteMany()

  console.log("Seeding categories...")
  for (const [categoryIdx, category] of CATEGORIES.entries()) {
    await prisma.category.create({
      data: {
        name: category.name,
        emoji: category.emoji,
        order: categoryIdx,
        topics: {
          create: category.topics.map((t, tIdx) => ({
            ...(t.id ? { id: t.id } : {}),
            title: t.title,
            imageUrl: t.imageUrl ?? null,
            order: t.order ?? tIdx,
            options: {
              create: t.options.map((opt, oIdx) => {
                const o = typeof opt === "string" ? { text: opt } : opt
                return {
                  text: o.text,
                  imageUrl: o.imageUrl ?? null,
                  order: oIdx,
                }
              }),
            },
          })),
        },
      },
    })
  }

  const categoryCount = await prisma.category.count()
  const topicCount = await prisma.topic.count()
  const optionCount = await prisma.option.count()
  console.log(
    `Seeded ${categoryCount} categories, ${topicCount} topics, ${optionCount} options.`,
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
