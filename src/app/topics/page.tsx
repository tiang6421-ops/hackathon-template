import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageLayout } from "@/components/page-layout"
import { TopicCard } from "@/components/topic-card"
import { TopicsToolbar } from "@/components/topics-toolbar"
import { isCategory } from "@/lib/categories"

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/")

  const { q, category } = await searchParams
  const search = q?.trim() ?? ""
  const categoryFilter = isCategory(category) ? category : null

  const topics = await prisma.topic.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
    },
    orderBy: { order: "asc" },
    include: { _count: { select: { questions: true } } },
  })

  return (
    <PageLayout user={session.user}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Topics</h1>
          <p className="text-sm text-muted-foreground">
            Pick a topic and swipe through the questions.
          </p>
        </div>

        <TopicsToolbar />

        {topics.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No topics match your filters.
          </p>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {topics.map((topic, i) => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                name={topic.name}
                emoji={topic.emoji}
                category={topic.category}
                imageUrl={topic.imageUrl}
                questionCount={topic._count.questions}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
