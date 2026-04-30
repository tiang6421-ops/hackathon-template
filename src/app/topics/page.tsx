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

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const userId = session.user.id
  const { q, cat } = await searchParams
  const query = q?.trim() ?? ""
  const catParam = cat?.trim() ?? ""
  const favoritesOnly = catParam === "favorites"
  const categoryId = favoritesOnly ? "" : catParam

  const [topics, favorites, categories] = await Promise.all([
    prisma.topic.findMany({
      where: {
        ...(query
          ? { title: { contains: query, mode: "insensitive" } }
          : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(favoritesOnly
          ? { favorites: { some: { userId } } }
          : {}),
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
