import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is required")

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const DEFAULT_FAVORITE_TITLES = [
  "Best workshop/collaboration tools for BA work?",
  "Best Fish & Chips in Kuala Lumpur?",
  "Best Good-Vibes Bar in KL?",
]

async function main() {
  const topics = await prisma.topic.findMany({
    where: { title: { in: DEFAULT_FAVORITE_TITLES } },
    select: { id: true, title: true },
  })
  if (topics.length !== DEFAULT_FAVORITE_TITLES.length) {
    const found = new Set(topics.map((t) => t.title))
    const missing = DEFAULT_FAVORITE_TITLES.filter((t) => !found.has(t))
    console.warn("Missing topics:", missing)
  }

  const users = await prisma.user.findMany({ select: { id: true } })
  console.log(`Applying ${topics.length} default favorites to ${users.length} users`)

  let created = 0
  for (const user of users) {
    for (const topic of topics) {
      const result = await prisma.favorite.upsert({
        where: { userId_topicId: { userId: user.id, topicId: topic.id } },
        create: { userId: user.id, topicId: topic.id },
        update: {},
      })
      if (result) created++
    }
  }

  const total = await prisma.favorite.count()
  console.log(`Upserted ${created} favorites; total now ${total}.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
