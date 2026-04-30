import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PageLayout } from "@/components/page-layout"
import { TopicCard } from "@/components/topic-card"
import { TopicSearch } from "@/components/topic-search"
import { LocaleSelect } from "@/components/locale-select"
import { CategoryPills } from "@/components/category-pills"
import {
  UK_MOCK_TOPICS,
  UK_ONLY_DB_TITLES,
  getTopicLocale,
  type MockTopic,
} from "@/lib/locale-topics"

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; loc?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const userId = session.user.id
  const { q, cat, loc } = await searchParams
  const query = q?.trim() ?? ""
  const catParam = cat?.trim() ?? ""
  const favoritesOnly = catParam === "favorites"
  const categoryId = favoritesOnly ? "" : catParam
  const locale = loc?.trim() || "GB"
  const isUK = locale === "GB"

  const [dbTopics, favorites, dbCategories] = await Promise.all([
    isUK
      ? Promise.resolve<MockTopic[]>([])
      : prisma.topic.findMany({
          where: {
            title: {
              notIn: UK_ONLY_DB_TITLES,
              ...(query ? { contains: query, mode: "insensitive" } : {}),
            },
            ...(categoryId ? { categoryId } : {}),
            ...(favoritesOnly ? { favorites: { some: { userId } } } : {}),
          },
          orderBy: [{ order: "asc" }, { category: { order: "asc" } }],
          select: {
            id: true,
            title: true,
            imageUrl: true,
            category: { select: { name: true, emoji: true } },
          },
        }),
    prisma.favorite.findMany({
      where: { userId },
      select: { topicId: true },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, emoji: true },
    }),
  ])

  const favoritedSet = new Set(favorites.map((f) => f.topicId))

  const ukCategoryMap = new Map(
    UK_MOCK_TOPICS.map((t) => [t.category.name, t.category]),
  )
  const ukCategories = Array.from(ukCategoryMap.values()).map((c) => ({
    id: `uk-${c.name.toLowerCase()}`,
    name: c.name,
    emoji: c.emoji,
  }))

  const ukTopics = UK_MOCK_TOPICS.filter((t) => {
    if (favoritesOnly) return false
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) {
      return false
    }
    if (categoryId && categoryId !== `uk-${t.category.name.toLowerCase()}`) {
      return false
    }
    return true
  })

  const localisedDbTopics = dbTopics.filter((t) => {
    const tl = getTopicLocale(t.title, t.category?.name)
    return tl === null || tl === locale
  })

  const topics = isUK ? ukTopics : localisedDbTopics
  const categories = isUK ? ukCategories : dbCategories

  return (
    <PageLayout
      user={session.user}
      navbarRight={
        <>
          <TopicSearch />
          <LocaleSelect />
        </>
      }
    >
      <CategoryPills categories={categories} />
      {topics.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {query
            ? `No topics match “${query}”.`
            : favoritesOnly
              ? "No favorited topics yet — tap the star on any topic to add it."
              : "No topics yet — be the first to add one."}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
          {topics.map((topic, i) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              imageUrl={topic.imageUrl}
              category={topic.category}
              index={i}
              favorited={favoritedSet.has(topic.id)}
            />
          ))}
        </div>
      )}
      <Link
        href="/topics/new"
        aria-label="Add topic"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:bg-black/80 active:scale-95 sm:bottom-8 sm:right-8"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Link>
    </PageLayout>
  )
}
