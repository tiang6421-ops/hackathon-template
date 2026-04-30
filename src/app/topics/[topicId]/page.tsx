import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TopicDetail } from "@/components/topic-detail"

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const { topicId } = await params
  const userId = session.user.id

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { options: { orderBy: { order: "asc" } } },
  })

  if (!topic) notFound()

  const favorite = await prisma.favorite.findUnique({
    where: { userId_topicId: { userId, topicId } },
    select: { id: true },
  })

  return (
    <TopicDetail
      topicId={topic.id}
      title={topic.title}
      imageUrl={topic.imageUrl}
      options={topic.options.map((o) => ({
        id: o.id,
        text: o.text,
        imageUrl: o.imageUrl,
      }))}
      votedIds={[]}
      favorited={!!favorite}
    />
  )
}
