export interface MockTopic {
  id: string
  title: string
  imageUrl: string | null
  category: { name: string; emoji: string }
}

export const UK_ONLY_DB_TITLES = [
  "Best workshop/collaboration tools for BA work?",
]

export const UK_MOCK_TOPICS: MockTopic[] = [
  {
    id: "uk-best-workshop-collab-tools-ba",
    title: "Best workshop/collaboration tools for BA work?",
    imageUrl:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    category: { name: "Work", emoji: "💼" },
  },
  {
    id: "uk-best-fish-and-chips",
    title: "Best Fish & Chips Spot",
    imageUrl: null,
    category: { name: "Food", emoji: "🍟" },
  },
  {
    id: "uk-favourite-premier-league-club",
    title: "Favourite Premier League Club",
    imageUrl: null,
    category: { name: "Sports", emoji: "⚽" },
  },
  {
    id: "uk-greatest-british-sitcom",
    title: "Greatest British Sitcom",
    imageUrl: null,
    category: { name: "TV", emoji: "📺" },
  },
  {
    id: "uk-best-sunday-roast",
    title: "Best Sunday Roast Meat",
    imageUrl: null,
    category: { name: "Food", emoji: "🍖" },
  },
  {
    id: "uk-most-iconic-london-landmark",
    title: "Most Iconic London Landmark",
    imageUrl: null,
    category: { name: "Travel", emoji: "🗼" },
  },
  {
    id: "uk-best-british-band",
    title: "Best British Band of All Time",
    imageUrl: null,
    category: { name: "Music", emoji: "🎸" },
  },
  {
    id: "uk-favourite-bank-holiday",
    title: "Favourite Bank Holiday",
    imageUrl: null,
    category: { name: "Culture", emoji: "🎉" },
  },
  {
    id: "uk-best-pub-snack",
    title: "Best Pub Snack",
    imageUrl: null,
    category: { name: "Food", emoji: "🥜" },
  },
  {
    id: "uk-top-uk-city-break",
    title: "Top UK City Break",
    imageUrl: null,
    category: { name: "Travel", emoji: "🏙️" },
  },
  {
    id: "uk-best-cup-of-tea",
    title: "Best Cup of Tea",
    imageUrl: null,
    category: { name: "Drinks", emoji: "🫖" },
  },
  {
    id: "uk-greatest-british-monarch",
    title: "Greatest British Monarch",
    imageUrl: null,
    category: { name: "History", emoji: "👑" },
  },
  {
    id: "uk-best-biscuit-for-dunking",
    title: "Best Biscuit for Dunking",
    imageUrl: null,
    category: { name: "Food", emoji: "🍪" },
  },
]
